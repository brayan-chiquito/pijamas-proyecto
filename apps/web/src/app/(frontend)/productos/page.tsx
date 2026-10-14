import { hasNonIndexableFilters, parseCatalogSearchParams, type RawSearchParams } from '@pijamas/domain'

import { CatalogFilters, Pagination } from '@/components/store/CatalogFilters'
import { ProductGrid } from '@/components/store/ProductCard'
import { filterProducts, getCatalogProducts, getCategories, getSettings, PAGE_SIZE } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const filters = parseCatalogSearchParams(await searchParams)
  const settings = await getSettings()
  return buildMetadata({
    title: 'Pijamas',
    description: settings.defaultDescription,
    path: filters.page > 1 ? `/productos?page=${filters.page}` : '/productos',
    settings,
    noindex: hasNonIndexableFilters(filters),
  })
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const filters = parseCatalogSearchParams(await searchParams)
  const [products, categories, settings] = await Promise.all([
    getCatalogProducts(),
    getCategories(),
    getSettings(),
  ])
  const page = filterProducts(products, filters, PAGE_SIZE)
  const sizes = [...new Set(products.flatMap((product) => product.sizes))]
  const colors = [...new Set(products.flatMap((product) => product.colors))]

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[240px_1fr] lg:px-8">
      <CatalogFilters
        action="/productos"
        filters={filters}
        sizes={sizes}
        colors={colors}
        categories={categories}
      />
      <div>
        <h1 className="font-display text-4xl">Pijamas</h1>
        <p className="mt-2 text-sm text-ink-600">{page.total} productos</p>
        <div className="mt-6">
          <ProductGrid products={page.items} currency={settings.currency} locale={settings.locale} />
        </div>
        <Pagination page={page.page} pageCount={page.pageCount} path="/productos" />
      </div>
    </div>
  )
}
