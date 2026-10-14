export type InventoryMode = 'none' | 'simple' | 'variants'

export type Availability = 'in_stock' | 'low_stock' | 'out_of_stock'

export const DEFAULT_LOW_STOCK_THRESHOLD = 3

export interface VariantStock {
  stock?: number | null
}

export interface InventoryFields {
  inventoryMode: InventoryMode
  /** Modo `none`: bandera manual de disponibilidad. */
  available?: boolean | null
  /** Modo `simple`: existencias globales. */
  stock?: number | null
  /** Modo `variants`: existencias por variante. */
  variants?: ReadonlyArray<VariantStock> | null
}

/** Disponibilidad a partir de un número de unidades. */
export function getStockAvailability(
  stock: number | null | undefined,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD,
): Availability {
  const units = Math.max(0, Math.floor(stock ?? 0))
  if (units === 0) return 'out_of_stock'
  if (units <= threshold) return 'low_stock'
  return 'in_stock'
}

/**
 * Disponibilidad de un producto completo o de una variante concreta.
 * En modo `variants` sin variante seleccionada se agrega: disponible si alguna variante lo está,
 * "pocas unidades" si todas las que quedan están por debajo del umbral.
 */
export function getAvailability(
  product: InventoryFields,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD,
  variant?: VariantStock | null,
): Availability {
  switch (product.inventoryMode) {
    case 'none':
      return product.available ? 'in_stock' : 'out_of_stock'
    case 'simple':
      return getStockAvailability(product.stock, threshold)
    case 'variants': {
      if (variant) return getStockAvailability(variant.stock, threshold)
      const variants = product.variants ?? []
      if (variants.length === 0) return 'out_of_stock'
      const states = variants.map((item) => getStockAvailability(item.stock, threshold))
      if (states.includes('in_stock')) return 'in_stock'
      if (states.includes('low_stock')) return 'low_stock'
      return 'out_of_stock'
    }
  }
}

/** Unidades máximas que se pueden agregar al carrito; null cuando no se controlan existencias. */
export function getPurchasableUnits(
  product: InventoryFields,
  variant?: VariantStock | null,
): number | null {
  switch (product.inventoryMode) {
    case 'none':
      return product.available ? null : 0
    case 'simple':
      return Math.max(0, Math.floor(product.stock ?? 0))
    case 'variants':
      if (!variant) return null
      return Math.max(0, Math.floor(variant.stock ?? 0))
  }
}

export function isPurchasable(availability: Availability): boolean {
  return availability !== 'out_of_stock'
}

/** Etiqueta en español para la interfaz. */
export function availabilityLabel(availability: Availability, units?: number | null): string {
  switch (availability) {
    case 'in_stock':
      return 'Disponible'
    case 'low_stock':
      return units && units > 0
        ? `Quedan ${units} ${units === 1 ? 'unidad' : 'unidades'}`
        : 'Pocas unidades'
    case 'out_of_stock':
      return 'Agotado'
  }
}
