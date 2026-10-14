import {
  cartLinesInputSchema,
  checkoutFormSchema,
  hasNonIndexableFilters,
  parseCatalogSearchParams,
  whatsAppPhoneSchema,
} from './schemas'

describe('checkoutFormSchema', () => {
  it('exige nombre y normaliza campos opcionales vacíos', () => {
    const result = checkoutFormSchema.safeParse({ name: ' Ana ', city: '  ', note: '' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ name: 'Ana', city: null, note: null })
    }
  })

  it('rechaza nombre corto y nota demasiado larga', () => {
    expect(checkoutFormSchema.safeParse({ name: 'A' }).success).toBe(false)
    expect(checkoutFormSchema.safeParse({ name: 'Ana', note: 'x'.repeat(501) }).success).toBe(
      false,
    )
  })
})

describe('whatsAppPhoneSchema', () => {
  it('devuelve el número normalizado', () => {
    expect(whatsAppPhoneSchema.parse('+57 300 111 2233')).toBe('573001112233')
  })

  it('informa el error en español', () => {
    const result = whatsAppPhoneSchema.safeParse('abc')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/dígitos/)
    }
  })
})

describe('cartLinesInputSchema', () => {
  it('acepta líneas válidas y rechaza carrito vacío', () => {
    expect(
      cartLinesInputSchema.safeParse([{ productId: '1', variantId: null, quantity: 2 }]).success,
    ).toBe(true)
    expect(cartLinesInputSchema.safeParse([]).success).toBe(false)
    expect(
      cartLinesInputSchema.safeParse([{ productId: '1', variantId: null, quantity: 0 }]).success,
    ).toBe(false)
  })
})

describe('parseCatalogSearchParams', () => {
  it('interpreta filtros válidos', () => {
    const filters = parseCatalogSearchParams({
      page: '2',
      orden: 'precio-asc',
      categoria: 'mujer,hombre',
      talla: ['M', 'L'],
      color: 'Rosa',
      precio_min: '10000',
      precio_max: '80000',
      disponible: '1',
      q: '  algodón  ',
    })
    expect(filters).toMatchObject({
      page: 2,
      sort: 'precio-asc',
      categories: ['mujer', 'hombre'],
      sizes: ['M', 'L'],
      colors: ['Rosa'],
      priceMin: 10000,
      priceMax: 80000,
      onlyAvailable: true,
      query: 'algodón',
    })
    expect(hasNonIndexableFilters(filters)).toBe(true)
  })

  it('descarta valores inválidos y usa valores por defecto', () => {
    const filters = parseCatalogSearchParams({
      page: '-3',
      orden: 'popularidad',
      categoria: 'Mujer',
      precio_min: 'no',
      precio_max: '10',
    })
    expect(filters.page).toBe(1)
    expect(filters.sort).toBe('novedades')
    expect(filters.categories).toEqual([])
    expect(filters.priceMin).toBeNull()
    expect(filters.priceMax).toBe(10)
    expect(hasNonIndexableFilters(filters)).toBe(true)
  })

  it('anula el máximo de precio si es menor que el mínimo', () => {
    const filters = parseCatalogSearchParams({ precio_min: '50000', precio_max: '1000' })
    expect(filters.priceMin).toBe(50000)
    expect(filters.priceMax).toBeNull()
  })

  it('la paginación sola sigue siendo indexable', () => {
    expect(hasNonIndexableFilters(parseCatalogSearchParams({ page: '3' }))).toBe(false)
  })
})
