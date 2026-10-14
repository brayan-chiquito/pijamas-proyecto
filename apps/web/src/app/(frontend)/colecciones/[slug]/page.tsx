import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/store/ProductCard'
import { getCatalogProducts, getCollection, getSettings } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [collection, settings] = await Promise.all([getCollection(slug), getSettings()])
  if (!collection) return { title: 'Colección' }
  return buildMetadata({
    title: collection.metaTitle || collection.title,
    description: collection.metaDescription || collection.description,
    path: `/colecciones/${collection.slug}`,
    settings,
  })
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [collection, products, settings] = await Promise.all([
    getCollection(slug),
    getCatalogProducts(),
    getSettings(),
  ])
  if (!collection) notFound()
  const items = products.filter((product) => product.collectionSlugs.includes(collection.slug))

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-4xl">{collection.title}</h1>
      {collection.description ? <p className="mt-3 max-w-prose text-ink-600">{collection.description}</p> : null}
      <div className="mt-8">
        <ProductGrid products={items} currency={settings.currency} locale={settings.locale} />
      </div>
    </div>
  )
}
