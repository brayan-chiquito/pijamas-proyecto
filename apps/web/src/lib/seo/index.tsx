import type { Metadata } from 'next'

import { toDecimalString, type Availability } from '@pijamas/domain'

import type { ProductDetail, StoreSettings } from '@/lib/catalog/types'

const availabilityUrl: Record<Availability, string> = {
  in_stock: 'https://schema.org/InStock',
  low_stock: 'https://schema.org/LimitedAvailability',
  out_of_stock: 'https://schema.org/OutOfStock',
}

export function absoluteUrl(path: string, serverUrl: string): string {
  const base = serverUrl.replace(/\/$/, '')
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

export function buildMetadata(input: {
  title: string
  description?: string | null
  path: string
  settings: StoreSettings
  image?: string | null
  noindex?: boolean
}): Metadata {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const description = input.description || input.settings.defaultDescription
  const title = input.title
  const canonical = absoluteUrl(input.path, serverUrl)
  const image = input.image ? absoluteUrl(input.image, serverUrl) : undefined

  return {
    title,
    description,
    alternates: { canonical },
    robots: input.noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: input.settings.siteName,
      locale: input.settings.locale.replace('-', '_'),
      type: 'website',
      images: image ? [{ url: image, width: 1200, height: 630 }] : undefined,
    },
  }
}

export function titleWithSuffix(title: string, settings: StoreSettings): string {
  return `${title} · ${settings.defaultTitleSuffix || settings.siteName}`
}

export function productJsonLd(product: ProductDetail, settings: StoreSettings, serverUrl: string) {
  const url = absoluteUrl(`/productos/${product.slug}`, serverUrl)
  const images = product.images.map((image) => absoluteUrl(image.url, serverUrl))
  const offers =
    product.variants.length > 0
      ? product.variants.map((variant) => offerFor(variant.price, variant.availability, variant.sku, url, settings.currency))
      : [offerFor(product.price, product.availability, null, url, settings.currency)]

  const shared = {
    name: product.title,
    description: product.shortDescription || product.metaDescription || undefined,
    image: images,
    brand: { '@type': 'Brand', name: settings.siteName },
  }

  if (product.variants.length > 1) {
    const variesBy = new Set<string>()
    for (const variant of product.variants) {
      for (const option of variant.options) {
        if (/talla|size/i.test(option.name)) variesBy.add('https://schema.org/size')
        if (/color/i.test(option.name)) variesBy.add('https://schema.org/color')
      }
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'ProductGroup',
      ...shared,
      productGroupID: product.slug,
      variesBy: [...variesBy],
      hasVariant: product.variants.map((variant) => {
        const size = variant.options.find((option) => /talla|size/i.test(option.name))?.value
        const color = variant.options.find((option) => /color/i.test(option.name))?.value
        return {
          '@type': 'Product',
          name: `${product.title} (${variant.label})`,
          image: variant.imageUrl ? absoluteUrl(variant.imageUrl, serverUrl) : images[0],
          size,
          color,
          sku: variant.sku || undefined,
          offers: offerFor(variant.price, variant.availability, variant.sku, url, settings.currency),
        }
      }),
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    ...shared,
    sku: product.variants.find((variant) => variant.sku)?.sku,
    offers: offers.length === 1 ? offers[0] : offers,
  }
}

function offerFor(
  price: number,
  availability: Availability,
  sku: string | null,
  url: string,
  currency: string,
) {
  return {
    '@type': 'Offer',
    sku: sku || undefined,
    price: toDecimalString(price, currency),
    priceCurrency: currency,
    availability: availabilityUrl[availability],
    url,
    itemCondition: 'https://schema.org/NewCondition',
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
  serverUrl: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, serverUrl),
    })),
  }
}

export function organizationJsonLd(settings: StoreSettings, serverUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: serverUrl,
    logo: settings.logoUrl ? absoluteUrl(settings.logoUrl, serverUrl) : undefined,
    email: settings.email || undefined,
    telephone: settings.phone || undefined,
    sameAs: settings.socialLinks.map((link) => link.url),
  }
}

export function websiteJsonLd(settings: StoreSettings, serverUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.siteName,
    url: serverUrl,
    description: settings.defaultDescription,
    inLanguage: settings.locale,
  }
}

export function plainText(value: unknown): string {
  if (!value || typeof value !== 'object') return ''
  const node = value as { text?: unknown; children?: unknown[]; root?: unknown }
  if (node.root) return plainText(node.root)
  const own = typeof node.text === 'string' ? node.text : ''
  const nested = Array.isArray(node.children) ? node.children.map((child) => plainText(child)).join(' ') : ''
  return `${own} ${nested}`.replace(/\s+/g, ' ').trim()
}

export function faqJsonLd(items: { question: string; answer: unknown }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: plainText(item.answer) },
    })),
  }
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
