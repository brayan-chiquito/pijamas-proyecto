import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/store/ProductCard'
import { getCatalogProducts, getCategory, getSettings } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, settings] = await Promise.all([getCategory(slug), getSettings()])
  if (!category) return { title: 'Categoría' }
  return buildMetadata({
    title: category.metaTitle || category.title,
    description: category.metaDescription || category.description,
    path: `/categorias/${category.slug}`,
    settings,
    image: category.image?.url,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, products, settings] = await Promise.all([
    getCategory(slug),
    getCatalogProducts(),
    getSettings(),
  ])
  if (!category) notFound()
  const items = products.filter((product) => product.categorySlug === category.slug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-4xl">{category.title}</h1>
      {category.description ? <p className="mt-3 max-w-prose text-ink-600">{category.description}</p> : null}
      <div className="mt-8">
        <ProductGrid products={items} currency={settings.currency} locale={settings.locale} />
      </div>
    </div>
  )
}
