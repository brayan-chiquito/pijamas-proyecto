'use client'

import { useMemo, useState } from 'react'
import {
  availabilityLabel,
  buildProductInquiryMessage,
  buildWhatsAppUrl,
  getAvailability,
  makeCartLineId,
  type CartLine,
} from '@pijamas/domain'

import { Button, ButtonLink } from '@/components/ui/Button'
import { Price } from '@/components/ui/Price'
import { useCart } from '@/lib/cart/store'
import type { ProductDetail } from '@/lib/catalog/types'

export function BuyBox({
  product,
  currency,
  locale,
  shippingNotice,
  whatsappPhone,
  storeName,
  productUrl,
}: {
  product: ProductDetail
  currency: string
  locale: string
  shippingNotice: string
  whatsappPhone: string
  storeName: string
  productUrl: string
}) {
  const add = useCart((state) => state.add)
  const [selection, setSelection] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState<string | null>(null)

  const variant = useMemo(() => {
    if (product.variants.length === 0) return null
    return (
      product.variants.find((item) =>
        item.options.every((option) => selection[option.name] === option.value),
      ) ?? null
    )
  }, [product.variants, selection])

  const everyOptionChosen =
    product.options.length === 0 || product.options.every((option) => Boolean(selection[option.name]))
  const ready = product.variants.length === 0 || Boolean(variant)
  const availability = variant
    ? variant.availability
    : getAvailability(
        {
          inventoryMode: product.inventoryMode,
          available: product.available,
          stock: product.stock,
          variants: product.variants,
        },
        3,
      )
  const units = variant ? variant.stock : product.inventoryMode === 'simple' ? product.stock : null
  const price = variant?.price ?? product.price
  const compareAt = variant?.compareAtPrice ?? product.compareAtPrice
  const canBuy = ready && availability !== 'out_of_stock'

  function onAdd() {
    if (!canBuy) return
    const line: CartLine = {
      id: makeCartLineId(product.id, variant?.id),
      productId: product.id,
      productSlug: product.slug,
      title: product.title,
      variantId: variant?.id ?? null,
      variantLabel: variant?.label ?? null,
      unitPrice: price,
      compareAtPrice: compareAt,
      quantity,
      imageUrl: variant?.imageUrl ?? product.image?.url ?? null,
      imageAlt: product.image?.alt ?? product.title,
      maxQuantity: product.inventoryMode === 'none' ? null : units,
    }
    add(line)
    setMessage('Agregado al carrito')
  }

  const inquiry = whatsappPhone
    ? buildWhatsAppUrl(
        whatsappPhone,
        buildProductInquiryMessage({
          storeName,
          productTitle: product.title,
          variantLabel: variant?.label,
          url: productUrl,
        }),
      )
    : null

  return (
    <div className="space-y-5">
      <Price amount={price} compareAt={compareAt} currency={currency} locale={locale} />
      <p className={availability === 'out_of_stock' ? 'text-red-600' : 'text-sage-600'}>
        {availabilityLabel(availability, units)}
      </p>
      {product.options.map((option) => (
        <fieldset key={option.name}>
          <legend className="text-sm font-semibold">{option.name}</legend>
          <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={option.name}>
            {option.values.map((value) => {
              const active = selection[option.name] === value
              const soldOut = product.variants
                .filter((item) => item.options.some((entry) => entry.name === option.name && entry.value === value))
                .every((item) => item.availability === 'out_of_stock')
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={soldOut}
                  onClick={() => setSelection((current) => ({ ...current, [option.name]: value }))}
                  className={`min-h-11 rounded-sm border px-3 text-sm ${active ? 'border-plum-700 bg-plum-100' : 'border-cream-200'} disabled:opacity-50`}
                >
                  {value}
                  {soldOut ? ' · Agotado' : ''}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
      <div className="flex items-center gap-3">
        <label htmlFor="cantidad" className="text-sm font-semibold">
          Cantidad
        </label>
        <input
          id="cantidad"
          type="number"
          min={1}
          max={99}
          inputMode="numeric"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value) || 1)}
          className="min-h-11 w-20 rounded-sm border border-cream-200 px-3"
        />
      </div>
      <Button type="button" onClick={onAdd} disabled={!canBuy} className="w-full">
        {canBuy ? 'Agregar al carrito' : everyOptionChosen ? 'No disponible' : 'Elige las opciones'}
      </Button>
      {message ? <p role="status">{message}</p> : null}
      {inquiry ? (
        <ButtonLink href={inquiry} variant="secondary" className="w-full">
          Consultar por WhatsApp
        </ButtonLink>
      ) : null}
      <p className="text-sm text-ink-600">{shippingNotice}</p>
    </div>
  )
}
