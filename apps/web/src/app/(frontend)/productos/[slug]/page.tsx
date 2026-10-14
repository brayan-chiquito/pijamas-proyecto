import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/richtext/RichText'
import { BuyBox } from '@/components/store/BuyBox'
import { ProductGallery } from '@/components/store/ProductGallery'
import { ProductGrid } from '@/components/store/ProductCard'
import { getProduct, getSettings } from '@/lib/catalog/queries'
import { absoluteUrl, breadcrumbJsonLd, buildMetadata, JsonLd, productJsonLd } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()])
  if (!product) return { title: 'Producto no encontrado' }
  return buildMetadata({
    title: product.metaTitle || product.title,
    description: product.metaDescription || product.shortDescription,
    path: `/productos/${product.slug}`,
    settings,
    image: `/productos/${product.slug}/og`,
  })
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()])
  if (!product) notFound()
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      <nav aria-label="Migas de pan" className="text-sm text-ink-600">
        <Link href="/">Inicio</Link>
        {' · '}
        <Link href={`/categorias/${product.categorySlug}`}>{product.categoryTitle}</Link>
        {' · '}
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-display text-4xl">{product.title}</h1>
          {product.shortDescription ? <p className="mt-3 text-ink-600">{product.shortDescription}</p> : null}
          <div className="mt-6">
            <BuyBox
              product={product}
              currency={settings.currency}
              locale={settings.locale}
              shippingNotice={settings.shippingNotice}
              whatsappPhone={settings.whatsappEnabled ? settings.whatsappPhone : ''}
              storeName={settings.siteName}
              productUrl={absoluteUrl(`/productos/${product.slug}`, serverUrl)}
            />
          </div>
        </div>
      </div>
      <section className="mt-12">
        <h2 className="font-display text-2xl">Descripción</h2>
        <RichText data={product.description} />
        {product.materials ? <p className="mt-4 text-sm text-ink-600">Materiales: {product.materials}</p> : null}
        <RichText data={product.care} />
      </section>
      {product.related.length > 0 ? (
        <section className="mt-12">
          <h2 className="mb-6 font-display text-2xl">También te puede gustar</h2>
          <ProductGrid products={product.related} currency={settings.currency} locale={settings.locale} />
        </section>
      ) : null}
      <JsonLd data={productJsonLd(product, settings, serverUrl)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: 'Inicio', path: '/' },
            { name: product.categoryTitle, path: `/categorias/${product.categorySlug}` },
            { name: product.title, path: `/productos/${product.slug}` },
          ],
          serverUrl,
        )}
      />
    </article>
  )
}
