import { describe, expect, it } from 'vitest'

import { filterProducts } from './filter'
import type { ProductSummary } from './types'

const product = (overrides: Partial<ProductSummary>): ProductSummary => ({
  id: '1',
  slug: 'pijama',
  title: 'Pijama rosa',
  shortDescription: 'Algodón',
  price: 50000,
  compareAtPrice: null,
  priceMax: null,
  availability: 'in_stock',
  image: null,
  hoverImage: null,
  categorySlug: 'mujer',
  categoryTitle: 'Mujer',
  collectionSlugs: [],
  tagSlugs: [],
  sizes: ['S', 'M'],
  colors: ['Rosa'],
  featured: false,
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('filterProducts', () => {
  const products = [
    product({ id: '1', price: 50000, sizes: ['S'] }),
    product({ id: '2', slug: 'gris', title: 'Conjunto gris', price: 80000, sizes: ['L'], colors: ['Gris'], categorySlug: 'hombre' }),
  ]

  it('filtra por talla y ordena por precio', () => {
    const page = filterProducts(
      products,
      {
        page: 1,
        sort: 'precio-asc',
        categories: [],
        collections: [],
        sizes: ['L'],
        colors: [],
        tags: [],
        priceMin: null,
        priceMax: null,
        onlyAvailable: false,
        query: null,
      },
      24,
    )
    expect(page.total).toBe(1)
    expect(page.items[0]?.id).toBe('2')
  })
})
