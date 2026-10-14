import type { CatalogFilters, CatalogSort } from '@pijamas/domain'

import type { ProductSummary } from './types'

export interface CatalogPage {
  items: ProductSummary[]
  total: number
  page: number
  pageCount: number
}

function matchesList(selected: string[], available: string[]): boolean {
  if (selected.length === 0) return true
  return selected.some((value) => available.includes(value))
}

export function filterProducts(
  products: readonly ProductSummary[],
  filters: CatalogFilters,
  pageSize: number,
): CatalogPage {
  const query = filters.query?.toLocaleLowerCase('es') ?? null
  const filtered = products.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.categorySlug)) return false
    if (
      filters.collections.length > 0 &&
      !filters.collections.some((slug) => product.collectionSlugs.includes(slug))
    ) {
      return false
    }
    if (filters.tags.length > 0 && !filters.tags.some((slug) => product.tagSlugs.includes(slug))) return false
    if (!matchesList(filters.sizes, product.sizes)) return false
    if (!matchesList(filters.colors, product.colors)) return false
    if (filters.onlyAvailable && product.availability === 'out_of_stock') return false
    if (filters.priceMin !== null && product.price < filters.priceMin) return false
    if (filters.priceMax !== null && product.price > filters.priceMax) return false
    if (query) {
      const haystack = `${product.title} ${product.shortDescription ?? ''}`.toLocaleLowerCase('es')
      if (!haystack.includes(query)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => compareProducts(a, b, filters.sort))
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const page = Math.min(filters.page, pageCount)
  const start = (page - 1) * pageSize

  return {
    items: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageCount,
  }
}

function compareProducts(a: ProductSummary, b: ProductSummary, sort: CatalogSort): number {
  switch (sort) {
    case 'precio-asc':
      return a.price - b.price
    case 'precio-desc':
      return b.price - a.price
    case 'nombre':
      return a.title.localeCompare(b.title, 'es')
    case 'novedades':
    default:
      return (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '')
  }
}
