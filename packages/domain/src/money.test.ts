import {
  discountPercent,
  formatPrice,
  fromMajorUnits,
  getFractionDigits,
  toDecimalString,
  toMajorUnits,
} from './money'

describe('getFractionDigits', () => {
  it('devuelve 0 para monedas sin decimales prácticos', () => {
    expect(getFractionDigits('COP')).toBe(0)
    expect(getFractionDigits('clp')).toBe(0)
    expect(getFractionDigits('JPY')).toBe(0)
  })

  it('devuelve 2 por defecto y 3 para monedas con milésimas', () => {
    expect(getFractionDigits('USD')).toBe(2)
    expect(getFractionDigits('EUR')).toBe(2)
    expect(getFractionDigits('KWD')).toBe(3)
  })
})

describe('toDecimalString', () => {
  it('formatea con punto decimal para datos estructurados', () => {
    expect(toDecimalString(3999, 'USD')).toBe('39.99')
    expect(toDecimalString(500, 'USD')).toBe('5.00')
    expect(toDecimalString(7, 'USD')).toBe('0.07')
    expect(toDecimalString(59900, 'COP')).toBe('59900')
  })

  it('rechaza valores no enteros o negativos', () => {
    expect(() => toDecimalString(39.99, 'USD')).toThrow(TypeError)
    expect(() => toDecimalString(-1, 'USD')).toThrow(RangeError)
  })
})

describe('conversión entre unidades', () => {
  it('convierte ida y vuelta', () => {
    expect(toMajorUnits(3999, 'USD')).toBe(39.99)
    expect(fromMajorUnits(39.99, 'USD')).toBe(3999)
    expect(fromMajorUnits(59900, 'COP')).toBe(59900)
  })

  it('rechaza importes inválidos', () => {
    expect(() => fromMajorUnits(-5, 'USD')).toThrow(RangeError)
    expect(() => fromMajorUnits(Number.NaN, 'USD')).toThrow(RangeError)
  })
})

describe('formatPrice', () => {
  it('formatea COP sin decimales en es-CO', () => {
    const formatted = formatPrice(59900, 'COP', 'es-CO')
    expect(formatted.replace(/\s/g, '')).toBe('$59.900')
  })

  it('formatea USD con dos decimales', () => {
    const formatted = formatPrice(3999, 'USD', 'en-US')
    expect(formatted).toBe('$39.99')
  })
})

describe('discountPercent', () => {
  it('calcula el porcentaje redondeado', () => {
    expect(discountPercent(10000, 7500)).toBe(25)
    expect(discountPercent(59900, 49900)).toBe(17)
  })

  it('devuelve null si no hay descuento real', () => {
    expect(discountPercent(10000, 10000)).toBeNull()
    expect(discountPercent(10000, 12000)).toBeNull()
    expect(discountPercent(0, 0)).toBeNull()
  })
})
