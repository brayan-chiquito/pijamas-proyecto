import { isReservedSlug, isValidSlug, slugify } from './slug'

describe('slugify', () => {
  it('normaliza acentos, ñ, símbolos y espacios', () => {
    expect(slugify('Pijama Largo de Algodón – Rosa')).toBe('pijama-largo-de-algodon-rosa')
    expect(slugify('  Niño  ')).toBe('nino')
    expect(slugify('A  B---C')).toBe('a-b-c')
  })

  it('recorta a 120 caracteres', () => {
    expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(120)
  })
})

describe('validación de slugs', () => {
  it('acepta slugs en minúsculas y rechaza reservados o mal formados', () => {
    expect(isValidSlug('pijama-largo')).toBe(true)
    expect(isValidSlug('Pijama')).toBe(false)
    expect(isValidSlug('-pijama')).toBe(false)
    expect(isReservedSlug('productos')).toBe(true)
    expect(isReservedSlug('pijama-largo')).toBe(false)
  })
})
