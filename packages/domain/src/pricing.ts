import { discountPercent } from './money'

export interface PriceFields {
  /** Precio regular en unidad menor. */
  price: number
  /** Precio promocional en unidad menor; null/undefined si no hay promoción. */
  salePrice?: number | null
}

export interface VariantPriceFields {
  /** Si la variante define precio propio, sustituye al del producto. */
  price?: number | null
  salePrice?: number | null
}

export interface EffectivePrice {
  /** Precio que paga el cliente. */
  price: number
  /** Precio tachado cuando hay promoción; null si no la hay. */
  compareAtPrice: number | null
  isOnSale: boolean
  discountPercent: number | null
}

/**
 * Calcula el precio vigente de un producto o de una de sus variantes.
 *
 * Reglas:
 * - Si la variante define `price`, su precio y su `salePrice` son independientes del producto
 *   (la promoción del producto no se hereda).
 * - Si la variante no define `price` pero sí `salePrice`, se aplica sobre el precio del producto.
 * - Una promoción solo es válida si es menor que el precio regular; de lo contrario se ignora.
 */
export function getEffectivePrice(
  product: PriceFields,
  variant?: VariantPriceFields | null,
): EffectivePrice {
  const variantHasOwnPrice = variant?.price !== undefined && variant?.price !== null
  const basePrice = variantHasOwnPrice ? (variant!.price as number) : product.price

  let salePrice: number | null | undefined
  if (variantHasOwnPrice) {
    salePrice = variant?.salePrice
  } else {
    salePrice = variant?.salePrice ?? product.salePrice
  }

  const hasValidSale =
    salePrice !== undefined && salePrice !== null && salePrice >= 0 && salePrice < basePrice

  if (!hasValidSale) {
    return { price: basePrice, compareAtPrice: null, isOnSale: false, discountPercent: null }
  }

  return {
    price: salePrice as number,
    compareAtPrice: basePrice,
    isOnSale: true,
    discountPercent: discountPercent(basePrice, salePrice as number),
  }
}

export interface PriceRange {
  min: number
  max: number
  /** true cuando min !== max y conviene mostrar "Desde …". */
  isRange: boolean
}

/** Rango de precios vigentes entre todas las variantes (o el único precio del producto). */
export function getPriceRange(
  product: PriceFields,
  variants?: ReadonlyArray<VariantPriceFields> | null,
): PriceRange {
  const prices =
    variants && variants.length > 0
      ? variants.map((variant) => getEffectivePrice(product, variant).price)
      : [getEffectivePrice(product).price]

  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return { min, max, isRange: min !== max }
}
