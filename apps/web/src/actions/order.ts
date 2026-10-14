'use server'

import {
  applyRevalidation,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  cartLinesInputSchema,
  checkoutFormSchema,
  computeCartTotals,
  getEffectivePrice,
  getPurchasableUnits,
  makeCartLineId,
  type CartLine,
  type CartLineRevalidation,
} from '@pijamas/domain'

import { getSettings } from '@/lib/catalog/queries'
import { getPayloadClient } from '@/lib/payload'
import type { Product } from '@/payload-types'

function variantOf(product: Product, variantId: string | null) {
  if (!variantId) return null
  return (
    product.variants?.find((variant, index) => (variant.id || `variant-${index}`) === variantId) ??
    null
  )
}

function lineFromProduct(product: Product, variantId: string | null, quantity: number): CartLine | null {
  if (product._status && product._status !== 'published') return null
  const variant = variantOf(product, variantId)
  if (product.inventoryMode === 'variants' && !variant) return null
  const price = getEffectivePrice(product, variant)
  const maxQuantity = getPurchasableUnits(
    product,
    variant ? { stock: variant.stock } : null,
  )
  if (maxQuantity === 0) return null
  const options = variant?.selectedOptions?.map((option) => option.value).join(' · ') || null
  const image = product.images?.[0]?.image
  return {
    id: makeCartLineId(String(product.id), variant?.id ?? variantId),
    productId: String(product.id),
    productSlug: product.slug,
    title: product.title,
    variantId: variant?.id ?? variantId,
    variantLabel: options,
    unitPrice: price.price,
    compareAtPrice: price.compareAtPrice,
    quantity: maxQuantity === null ? quantity : Math.min(quantity, maxQuantity),
    imageUrl: image && typeof image !== 'number' ? image.url ?? null : null,
    imageAlt: image && typeof image !== 'number' ? image.alt : product.title,
    maxQuantity,
  }
}

async function loadProducts(ids: string[]): Promise<Product[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    depth: 1,
    limit: ids.length,
    where: { id: { in: ids } },
  })
  return result.docs
}

export async function revalidateCart(lines: unknown): Promise<CartLineRevalidation[]> {
  const parsed = cartLinesInputSchema.safeParse(lines)
  if (!parsed.success) return []
  const products = await loadProducts(parsed.data.map((line) => line.productId))
  return parsed.data.map((input) => {
    const id = makeCartLineId(input.productId, input.variantId)
    const product = products.find((item) => String(item.id) === input.productId)
    if (!product) return { id, status: 'removed', line: null }
    const line = lineFromProduct(product, input.variantId, input.quantity)
    if (!line) return { id, status: 'unavailable', line: null }
    if (line.quantity < input.quantity) return { id, status: 'quantity_reduced', line }
    if (input.unitPrice !== undefined && input.unitPrice !== line.unitPrice) {
      return { id, status: 'price_changed', previousUnitPrice: input.unitPrice, line }
    }
    return { id, status: 'ok', line }
  })
}

export async function prepareWhatsAppOrder(form: unknown, lines: unknown) {
  const parsedForm = checkoutFormSchema.safeParse(form)
  if (!parsedForm.success) {
    return { ok: false as const, error: parsedForm.error.issues[0]?.message ?? 'Revisa el formulario' }
  }
  const parsedLines = cartLinesInputSchema.safeParse(lines)
  if (!parsedLines.success) {
    return { ok: false as const, error: parsedLines.error.issues[0]?.message ?? 'El carrito está vacío' }
  }

  const settings = await getSettings()
  if (!settings.whatsappEnabled || !settings.whatsappPhone) {
    return {
      ok: false as const,
      error: settings.email
        ? `WhatsApp no está activo. Escríbenos a ${settings.email}.`
        : 'WhatsApp no está activo en este momento.',
    }
  }

  const products = await loadProducts(parsedLines.data.map((line) => line.productId))
  const results: CartLineRevalidation[] = parsedLines.data.map((input) => {
    const id = makeCartLineId(input.productId, input.variantId)
    const product = products.find((item) => String(item.id) === input.productId)
    if (!product) return { id, status: 'removed', line: null }
    const line = lineFromProduct(product, input.variantId, input.quantity)
    if (!line) return { id, status: 'unavailable', line: null }
    return { id, status: 'ok', line }
  })

  const confirmed = results.map((result) => result.line).filter((line): line is CartLine => line !== null)
  if (confirmed.length === 0) {
    return { ok: false as const, error: 'Ningún producto del carrito está disponible.' }
  }

  const totals = computeCartTotals(confirmed)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const message = buildWhatsAppMessage({
    storeName: settings.siteName,
    greeting: settings.whatsappGreeting,
    currency: settings.currency,
    locale: settings.locale,
    total: totals.subtotal,
    customer: parsedForm.data,
    lines: confirmed.map((line) => ({
      title: line.title,
      variantLabel: line.variantLabel,
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      lineTotal: line.unitPrice * line.quantity,
      url: `${serverUrl}/productos/${line.productSlug}`,
    })),
  })

  return {
    ok: true as const,
    url: buildWhatsAppUrl(settings.whatsappPhone, message),
    lines: applyRevalidation(confirmed, results),
    removed: results.filter((result) => !result.line).length,
  }
}
