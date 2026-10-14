import {
  availabilityLabel,
  DEFAULT_LOW_STOCK_THRESHOLD,
  getAvailability,
  getPurchasableUnits,
  getStockAvailability,
  isPurchasable,
} from './availability'

describe('getStockAvailability', () => {
  it('clasifica según el umbral por defecto', () => {
    expect(getStockAvailability(0)).toBe('out_of_stock')
    expect(getStockAvailability(null)).toBe('out_of_stock')
    expect(getStockAvailability(DEFAULT_LOW_STOCK_THRESHOLD)).toBe('low_stock')
    expect(getStockAvailability(1)).toBe('low_stock')
    expect(getStockAvailability(DEFAULT_LOW_STOCK_THRESHOLD + 1)).toBe('in_stock')
  })

  it('respeta un umbral personalizado', () => {
    expect(getStockAvailability(5, 5)).toBe('low_stock')
    expect(getStockAvailability(6, 5)).toBe('in_stock')
  })
})

describe('getAvailability', () => {
  it('modo none usa la bandera manual', () => {
    expect(getAvailability({ inventoryMode: 'none', available: true })).toBe('in_stock')
    expect(getAvailability({ inventoryMode: 'none', available: false })).toBe('out_of_stock')
    expect(getAvailability({ inventoryMode: 'none' })).toBe('out_of_stock')
  })

  it('modo simple usa existencias globales', () => {
    expect(getAvailability({ inventoryMode: 'simple', stock: 0 })).toBe('out_of_stock')
    expect(getAvailability({ inventoryMode: 'simple', stock: 2 })).toBe('low_stock')
    expect(getAvailability({ inventoryMode: 'simple', stock: 10 })).toBe('in_stock')
  })

  it('modo variants agrega el estado de todas las variantes', () => {
    const allOut = getAvailability({
      inventoryMode: 'variants',
      variants: [{ stock: 0 }, { stock: 0 }],
    })
    const someLow = getAvailability({
      inventoryMode: 'variants',
      variants: [{ stock: 0 }, { stock: 2 }],
    })
    const someInStock = getAvailability({
      inventoryMode: 'variants',
      variants: [{ stock: 1 }, { stock: 8 }],
    })
    expect(allOut).toBe('out_of_stock')
    expect(someLow).toBe('low_stock')
    expect(someInStock).toBe('in_stock')
  })

  it('modo variants sin variantes o sin lista se considera agotado', () => {
    expect(getAvailability({ inventoryMode: 'variants', variants: [] })).toBe('out_of_stock')
    expect(getAvailability({ inventoryMode: 'variants' })).toBe('out_of_stock')
  })

  it('modo variants con variante concreta evalúa solo esa variante', () => {
    const product = {
      inventoryMode: 'variants' as const,
      variants: [{ stock: 10 }, { stock: 0 }],
    }
    expect(getAvailability(product, 3, { stock: 0 })).toBe('out_of_stock')
    expect(getAvailability(product, 3, { stock: 10 })).toBe('in_stock')
  })
})

describe('unidades comprables y etiquetas', () => {
  it('getPurchasableUnits distingue los modos', () => {
    expect(getPurchasableUnits({ inventoryMode: 'none', available: true })).toBeNull()
    expect(getPurchasableUnits({ inventoryMode: 'none', available: false })).toBe(0)
    expect(getPurchasableUnits({ inventoryMode: 'simple', stock: 4 })).toBe(4)
    expect(getPurchasableUnits({ inventoryMode: 'variants' }, { stock: 2 })).toBe(2)
    expect(getPurchasableUnits({ inventoryMode: 'variants' })).toBeNull()
  })

  it('isPurchasable y availabilityLabel', () => {
    expect(isPurchasable('in_stock')).toBe(true)
    expect(isPurchasable('low_stock')).toBe(true)
    expect(isPurchasable('out_of_stock')).toBe(false)
    expect(availabilityLabel('in_stock')).toBe('Disponible')
    expect(availabilityLabel('low_stock', 1)).toBe('Quedan 1 unidad')
    expect(availabilityLabel('low_stock', 2)).toBe('Quedan 2 unidades')
    expect(availabilityLabel('low_stock')).toBe('Pocas unidades')
    expect(availabilityLabel('out_of_stock')).toBe('Agotado')
  })
})
