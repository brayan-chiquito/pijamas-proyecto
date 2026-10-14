import Link from 'next/link'

import { HeroSlideshow } from '@/components/store/HeroSlideshow'
import { ProductGrid } from '@/components/store/ProductCard'
import { getCategories, getFeaturedProducts, getHome, getSettings } from '@/lib/catalog/queries'
import { buildMetadata, JsonLd, websiteJsonLd } from '@/lib/seo'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata({
    title: settings.siteName,
    description: settings.defaultDescription,
    path: '/',
    settings,
    image: '/og',
  })
}

export default async function HomePage() {
  const [home, settings, products, categories] = await Promise.all([
    getHome(),
    getSettings(),
    getFeaturedProducts(),
    getCategories(),
  ])
  const hero = home.hero[0]
  const heroImages = home.hero.flatMap((slide) => {
    if (!slide.image || typeof slide.image === 'number' || !slide.image.url) return []
    return [{ url: slide.image.url, alt: slide.image.alt || slide.title }]
  })
  const featuredCategories = home.featuredCategories.length > 0 ? home.featuredCategories : categories.slice(0, 4)
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div>
          {hero?.eyebrow ? (
            <p className="text-xs tracking-[0.08em] text-ink-600 uppercase">{hero.eyebrow}</p>
          ) : null}
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            {hero?.title || settings.tagline}
          </h1>
          <p className="mt-4 max-w-prose text-lg text-ink-600">{hero?.text || settings.defaultDescription}</p>
          <Link
            href={hero?.ctaLink || '/productos'}
            className="mt-8 inline-flex min-h-11 items-center rounded-md bg-plum-700 px-5 text-sm font-semibold text-white"
          >
            {hero?.ctaLabel || 'Ver pijamas'}
          </Link>
        </div>
        <HeroSlideshow images={heroImages} />
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h2 className="font-display text-3xl">Categorías</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/categorias/${category.slug}`}
              className="block rounded-md bg-white p-4 shadow-card motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
            >
              <h3 className="font-display text-xl">{category.title}</h3>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h2 className="mb-6 font-display text-3xl">{home.featuredTitle}</h2>
        <ProductGrid products={products} currency={settings.currency} locale={settings.locale} />
      </section>
      {home.promo ? (
        <section className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-12 md:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl">{home.promo.title}</h2>
            <p className="mt-3 text-ink-600">{home.promo.text}</p>
            {home.promo.ctaLabel ? (
              <Link href={home.promo.ctaLink} className="mt-6 inline-flex min-h-11 items-center font-semibold text-plum-700">
                {home.promo.ctaLabel}
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
      {home.showTrustBlock && settings.trustItems.length > 0 ? (
        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:grid-cols-3 lg:px-8">
          {settings.trustItems.map((item) => (
            <article key={item.title} className="rounded-md bg-cream-100 p-5">
              <h2 className="font-display text-xl">{item.title}</h2>
              <p className="mt-2 text-sm text-ink-600">{item.text}</p>
            </article>
          ))}
        </section>
      ) : null}
      <JsonLd data={websiteJsonLd(settings, serverUrl)} />
    </>
  )
}
