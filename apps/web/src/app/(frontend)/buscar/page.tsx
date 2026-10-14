import { parseCatalogSearchParams, type RawSearchParams } from '@pijamas/domain'

import { ProductGrid } from '@/components/store/ProductCard'
import { filterProducts, getCatalogProducts, getSettings, PAGE_SIZE } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Buscar',
    description: 'Busca pijamas por nombre.',
    path: '/buscar',
    settings,
    noindex: true,
  })
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const filters = parseCatalogSearchParams(await searchParams)
  const [products, settings] = await Promise.all([getCatalogProducts(), getSettings()])
  const page = filterProducts(products, { ...filters, page: 1 }, PAGE_SIZE)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-4xl">Buscar</h1>
      <form action="/buscar" className="mt-6 flex gap-3">
        <label className="sr-only" htmlFor="q">
          Buscar productos
        </label>
        <input
          id="q"
          name="q"
          defaultValue={filters.query ?? ''}
          className="min-h-11 flex-1 rounded-sm border border-cream-200 px-3"
        />
        <button type="submit" className="min-h-11 rounded-md bg-plum-700 px-5 text-sm font-semibold text-white">
          Buscar
        </button>
      </form>
      <div className="mt-8">
        <ProductGrid products={page.items} currency={settings.currency} locale={settings.locale} />
      </div>
    </div>
  )
}
