import { getEffectivePrice, getPriceRange } from './pricing'

describe('getEffectivePrice', () => {
  it('sin promoción devuelve el precio regular', () => {
    expect(getEffectivePrice({ price: 59900 })).toEqual({
      price: 59900,
      compareAtPrice: null,
      isOnSale: false,
      discountPercent: null,
    })
  })

  it('con promoción válida devuelve precio promocional y tachado', () => {
    expect(getEffectivePrice({ price: 59900, salePrice: 49900 })).toEqual({
      price: 49900,
      compareAtPrice: 59900,
      isOnSale: true,
      discountPercent: 17,
    })
  })

  it('ignora promociones iguales o superiores al precio', () => {
    expect(getEffectivePrice({ price: 59900, salePrice: 59900 }).isOnSale).toBe(false)
    expect(getEffectivePrice({ price: 59900, salePrice: 69900 }).isOnSale).toBe(false)
  })

  it('la variante con precio propio sustituye al del producto y no hereda su promoción', () => {
    const result = getEffectivePrice({ price: 59900, salePrice: 49900 }, { price: 64900 })
    expect(result).toEqual({
      price: 64900,
      compareAtPrice: null,
      isOnSale: false,
      discountPercent: null,
    })
  })

  it('la variante con precio y promoción propios se calcula de forma independiente', () => {
    const result = getEffectivePrice({ price: 59900 }, { price: 64900, salePrice: 54900 })
    expect(result.price).toBe(54900)
    expect(result.compareAtPrice).toBe(64900)
  })

  it('la variante solo con promoción la aplica sobre el precio del producto', () => {
    const result = getEffectivePrice({ price: 59900 }, { salePrice: 39900 })
    expect(result.price).toBe(39900)
    expect(result.compareAtPrice).toBe(59900)
  })

  it('variante nula se trata como sin variante', () => {
    expect(getEffectivePrice({ price: 100, salePrice: 80 }, null).price).toBe(80)
  })
})

describe('getPriceRange', () => {
  it('sin variantes devuelve el precio único', () => {
    expect(getPriceRange({ price: 59900, salePrice: 49900 })).toEqual({
      min: 49900,
      max: 49900,
      isRange: false,
    })
  })

  it('con variantes de precio distinto devuelve rango', () => {
    const range = getPriceRange({ price: 59900 }, [{}, { price: 64900 }, { price: 54900 }])
    expect(range).toEqual({ min: 54900, max: 64900, isRange: true })
  })

  it('con lista vacía de variantes usa el precio del producto', () => {
    expect(getPriceRange({ price: 100 }, []).min).toBe(100)
  })
})
