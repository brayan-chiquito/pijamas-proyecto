export const MAX_LINE_QUANTITY = 99
export const MAX_CART_LINES = 50

export interface CartLine {
  /** Identificador estable de la línea: `${productId}` o `${productId}:${variantId}`. */
  id: string
  productId: string
  productSlug: string
  title: string
  variantId: string | null
  /** Texto legible de la variante, p. ej. "Talla M · Rosa". */
  variantLabel: string | null
  /** Precio unitario vigente en unidad menor (siempre proveniente del servidor). */
  unitPrice: number
  /** Precio tachado si la línea está en promoción. */
  compareAtPrice: number | null
  quantity: number
  imageUrl: string | null
  imageAlt: string | null
  /** Máximo permitido por existencias; null si no se controlan. */
  maxQuantity: number | null
}

export interface CartLineTotals {
  id: string
  lineTotal: number
}

export interface CartTotals {
  subtotal: number
  itemCount: number
  lines: CartLineTotals[]
}

export function makeCartLineId(productId: string, variantId?: string | null): string {
  return variantId ? `${productId}:${variantId}` : productId
}

export function clampQuantity(quantity: number, maxQuantity?: number | null): number {
  const upper = Math.min(MAX_LINE_QUANTITY, maxQuantity ?? MAX_LINE_QUANTITY)
  const normalized = Number.isFinite(quantity) ? Math.floor(quantity) : 1
  return Math.max(0, Math.min(upper, normalized))
}

/** Totales enteros y consistentes; el subtotal es la suma exacta de las líneas. */
export function computeCartTotals(lines: ReadonlyArray<CartLine>): CartTotals {
  const lineTotals = lines.map((line) => ({
    id: line.id,
    lineTotal: line.unitPrice * line.quantity,
  }))
  return {
    subtotal: lineTotals.reduce((sum, line) => sum + line.lineTotal, 0),
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    lines: lineTotals,
  }
}

/**
 * Agrega una línea. Si ya existe la misma combinación producto/variante, suma cantidades
 * respetando el máximo. Devuelve una copia nueva (inmutable).
 */
export function addCartLine(lines: ReadonlyArray<CartLine>, incoming: CartLine): CartLine[] {
  const existing = lines.find((line) => line.id === incoming.id)
  if (!existing) {
    if (lines.length >= MAX_CART_LINES) {
      throw new RangeError(`El carrito admite como máximo ${MAX_CART_LINES} productos distintos`)
    }
    const quantity = clampQuantity(incoming.quantity, incoming.maxQuantity)
    return quantity === 0 ? [...lines] : [...lines, { ...incoming, quantity }]
  }
  const maxQuantity = incoming.maxQuantity ?? existing.maxQuantity
  const quantity = clampQuantity(existing.quantity + incoming.quantity, maxQuantity)
  return lines.map((line) =>
    line.id === incoming.id ? { ...line, ...incoming, quantity, maxQuantity } : line,
  )
}

/** Cambia la cantidad; con 0 elimina la línea. */
export function updateCartLineQuantity(
  lines: ReadonlyArray<CartLine>,
  id: string,
  quantity: number,
): CartLine[] {
  return lines
    .map((line) =>
      line.id === id ? { ...line, quantity: clampQuantity(quantity, line.maxQuantity) } : line,
    )
    .filter((line) => line.quantity > 0)
}

export function removeCartLine(lines: ReadonlyArray<CartLine>, id: string): CartLine[] {
  return lines.filter((line) => line.id !== id)
}

/** Resultado de reconfirmar una línea contra el servidor. */
export interface CartLineRevalidation {
  id: string
  status: 'ok' | 'price_changed' | 'quantity_reduced' | 'unavailable' | 'removed'
  /** Línea actualizada con datos del servidor; null cuando el producto ya no existe o no está publicado. */
  line: CartLine | null
  previousUnitPrice?: number
}

/** Aplica el resultado de la revalidación conservando el orden original. */
export function applyRevalidation(
  lines: ReadonlyArray<CartLine>,
  results: ReadonlyArray<CartLineRevalidation>,
): CartLine[] {
  const byId = new Map(results.map((result) => [result.id, result]))
  const next: CartLine[] = []
  for (const line of lines) {
    const result = byId.get(line.id)
    if (!result) {
      next.push(line)
      continue
    }
    if (result.line && result.status !== 'removed') {
      next.push(result.line)
    }
  }
  return next
}
