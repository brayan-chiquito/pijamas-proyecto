import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

import type { Category, Collection, Faq, HomePage, Media, Page, Product } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'

import { filterProducts } from './filter'
import { mediaImage, toDetail, toSummary } from './mappers'
import { catalogTags } from './tags'
import type {
  ProductDetail,
  ProductSummary,
  StoreCategory,
  StoreNavigation,
  StorePage,
  StoreSettings,
} from './types'

const PAGE_SIZE = 24

const fallbackSettings: StoreSettings = {
  siteName: 'Casa Pijama',
  tagline: 'Descanso bien vestido',
  currency: 'COP',
  locale: 'es-CO',
  lowStockThreshold: 3,
  shippingNotice: 'Envíos a todo el país. El plazo se confirma por WhatsApp.',
  whatsappEnabled: false,
  whatsappPhone: '',
  whatsappGreeting: 'Hola {{tienda}}, soy {{nombre}} y quiero hacer este pedido:',
  floatingButton: false,
  email: null,
  phone: null,
  address: null,
  schedule: null,
  socialLinks: [],
  announcementEnabled: false,
  announcementText: null,
  announcementLink: null,
  trustItems: [],
  defaultTitleSuffix: 'Casa Pijama',
  defaultDescription: 'Pijamas y ropa de descanso.',
  logoUrl: null,
  logoAlt: 'Casa Pijama',
}

function mapSettings(doc: {
  siteName?: string | null
  tagline?: string | null
  currency?: string | null
  locale?: string | null
  lowStockThreshold?: number | null
  shippingNotice?: string | null
  whatsappEnabled?: boolean | null
  whatsappPhone?: string | null
  whatsappGreeting?: string | null
  floatingButton?: boolean | null
  email?: string | null
  phone?: string | null
  address?: string | null
  schedule?: string | null
  socialLinks?: { platform: string; url: string }[] | null
  announcementEnabled?: boolean | null
  announcementText?: string | null
  announcementLink?: string | null
  trustItems?: { title: string; text: string }[] | null
  defaultTitleSuffix?: string | null
  defaultDescription?: string | null
  logo?: number | Media | null
}): StoreSettings {
  const logo = mediaImage(doc.logo, doc.siteName || fallbackSettings.siteName)
  return {
    siteName: doc.siteName || fallbackSettings.siteName,
    tagline: doc.tagline || fallbackSettings.tagline,
    currency: doc.currency || 'COP',
    locale: doc.locale || 'es-CO',
    lowStockThreshold: doc.lowStockThreshold || 3,
    shippingNotice: doc.shippingNotice || fallbackSettings.shippingNotice,
    whatsappEnabled: Boolean(doc.whatsappEnabled && doc.whatsappPhone),
    whatsappPhone: doc.whatsappPhone || '',
    whatsappGreeting: doc.whatsappGreeting || fallbackSettings.whatsappGreeting,
    floatingButton: Boolean(doc.floatingButton),
    email: doc.email ?? null,
    phone: doc.phone ?? null,
    address: doc.address ?? null,
    schedule: doc.schedule ?? null,
    socialLinks: doc.socialLinks ?? [],
    announcementEnabled: Boolean(doc.announcementEnabled && doc.announcementText),
    announcementText: doc.announcementText ?? null,
    announcementLink: doc.announcementLink ?? null,
    trustItems: doc.trustItems ?? [],
    defaultTitleSuffix: doc.defaultTitleSuffix || fallbackSettings.defaultTitleSuffix,
    defaultDescription: doc.defaultDescription || fallbackSettings.defaultDescription,
    logoUrl: logo?.url ?? null,
    logoAlt: logo?.alt || fallbackSettings.logoAlt,
  }
}

async function readSettings(): Promise<StoreSettings> {
  try {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'site-settings', depth: 1 })
    return mapSettings(doc)
  } catch (error) {
    console.error('No se pudo leer la configuración del sitio', error)
    return fallbackSettings
  }
}

export const getSettings = unstable_cache(readSettings, ['site-settings'], {
  tags: [catalogTags.settings],
})

async function readProducts(draft: boolean): Promise<Product[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 200,
    draft,
    overrideAccess: draft,
    pagination: false,
    where: draft ? undefined : { _status: { equals: 'published' } },
  })
  return result.docs
}

const getPublishedProducts = unstable_cache(
  async () => {
    const settings = await readSettings()
    const docs = await readProducts(false)
    return docs
      .map((doc) => toSummary(doc, settings.lowStockThreshold))
      .filter((item): item is ProductSummary => item !== null)
  },
  ['published-products'],
  { tags: [catalogTags.products, catalogTags.settings] },
)

export async function getCatalogProducts(): Promise<ProductSummary[]> {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return getPublishedProducts()
  const settings = await getSettings()
  const docs = await readProducts(true)
  return docs
    .map((doc) => toSummary(doc, settings.lowStockThreshold))
    .filter((item): item is ProductSummary => item !== null)
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const { isEnabled } = await draftMode()
  if (isEnabled) return loadProduct(slug, true)
  return getPublishedProduct(slug)
}

const getPublishedProduct = unstable_cache(
  async (slug: string) => loadProduct(slug, false),
  ['product'],
  { tags: [catalogTags.products, catalogTags.settings] },
)

async function loadProduct(slug: string, draft: boolean): Promise<ProductDetail | null> {
  const payload = await getPayloadClient()
  const settings = await readSettings()
  const result = await payload.find({
    collection: 'products',
    depth: 2,
    draft,
    overrideAccess: draft,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, ...(draft ? [] : [{ _status: { equals: 'published' } }])],
    },
  })
  const product = result.docs[0]
  if (!product || typeof product.category === 'number') return null

  const manual = (product.relatedProducts ?? []).filter(
    (item): item is Product => typeof item !== 'number',
  )
  let related = manual
  if (related.length === 0) {
    const sameCategory = await payload.find({
      collection: 'products',
      depth: 1,
      limit: 4,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { category: { equals: product.category.id } },
          { id: { not_equals: product.id } },
        ],
      },
    })
    related = sameCategory.docs
  }

  return toDetail(product, settings.lowStockThreshold, related.slice(0, 4))
}

function mapCategory(doc: Category | Collection): StoreCategory {
  const image = mediaImage(doc.image, doc.title, 'card')
  return {
    id: String(doc.id),
    title: doc.title,
    slug: doc.slug,
    description: doc.description ?? null,
    image,
    metaTitle: doc.meta?.title ?? null,
    metaDescription: doc.meta?.description ?? null,
  }
}

const getCategoriesCached = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'categories',
      depth: 1,
      limit: 100,
      sort: 'order',
      pagination: false,
    })
    return result.docs.map(mapCategory)
  },
  ['categories'],
  { tags: [catalogTags.categories] },
)

const getCollectionsCached = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'collections',
      depth: 1,
      limit: 100,
      pagination: false,
    })
    return result.docs.map(mapCategory)
  },
  ['collections'],
  { tags: [catalogTags.collections] },
)

export const getCategories = getCategoriesCached
export const getCollections = getCollectionsCached

export async function getCategory(slug: string): Promise<StoreCategory | null> {
  const categories = await getCategories()
  return categories.find((item) => item.slug === slug) ?? null
}

export async function getCollection(slug: string): Promise<StoreCategory | null> {
  const collections = await getCollections()
  return collections.find((item) => item.slug === slug) ?? null
}

export async function getHome() {
  const payload = await getPayloadClient()
  const { isEnabled } = await draftMode()
  const loader = async () => {
    const doc = await payload.findGlobal({
      slug: 'home-page',
      depth: 2,
      draft: isEnabled,
      overrideAccess: isEnabled,
    })
    return doc
  }
  const doc: HomePage = isEnabled
    ? await loader()
    : await unstable_cache(loader, ['home-page'], { tags: [catalogTags.home] })()

  const categories = await getCategories()
  const featuredIds = new Set((doc.featuredCategories ?? []).map((item) => String(typeof item === 'number' ? item : item.id)))
  return {
    hero: doc.hero ?? [],
    featuredTitle: doc.featuredTitle || 'Elegidos para descansar',
    featuredCategories: categories.filter((item) => featuredIds.has(item.id)),
    showTrustBlock: doc.showTrustBlock !== false,
    promo: doc.promoEnabled
      ? {
          title: doc.promoTitle || '',
          text: doc.promoText || '',
          ctaLabel: doc.promoCtaLabel || '',
          ctaLink: doc.promoCtaLink || '/productos',
          image: mediaImage(doc.promoImage, doc.promoTitle || ''),
        }
      : null,
    featuredMode: doc.featuredProductsMode || 'featuredFlag',
    featuredProducts: (doc.featuredProducts ?? []).filter((item): item is Product => typeof item !== 'number'),
    featuredCollectionSlug:
      doc.featuredCollection && typeof doc.featuredCollection !== 'number'
        ? doc.featuredCollection.slug
        : null,
  }
}

export async function getFeaturedProducts(): Promise<ProductSummary[]> {
  const [home, products, settings] = await Promise.all([
    getHome(),
    getCatalogProducts(),
    getSettings(),
  ])
  if (home.featuredMode === 'manual') {
    return home.featuredProducts
      .map((product) => toSummary(product, settings.lowStockThreshold))
      .filter((item): item is ProductSummary => item !== null)
  }
  if (home.featuredMode === 'collection' && home.featuredCollectionSlug) {
    return products
      .filter((product) => product.collectionSlugs.includes(home.featuredCollectionSlug as string))
      .slice(0, 8)
  }
  const flagged = products.filter((product) => product.featured)
  return (flagged.length > 0 ? flagged : products).slice(0, 8)
}

export const getNavigation = unstable_cache(
  async (): Promise<StoreNavigation> => {
    const payload = await getPayloadClient()
    const doc = await payload.findGlobal({ slug: 'navigation', depth: 0 })
    const header = doc.header ?? []
    return {
      header:
        header.length > 0
          ? header
          : [
              { label: 'Productos', url: '/productos' },
              { label: 'Preguntas', url: '/preguntas-frecuentes' },
              { label: 'Contacto', url: '/contacto' },
            ],
      footerColumns: (doc.footerColumns ?? []).map((column) => ({
        title: column.title,
        links: column.links ?? [],
      })),
      footerText: doc.footerText || '',
    }
  },
  ['navigation'],
  { tags: [catalogTags.navigation] },
)

export const getFaqs = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'faqs',
      sort: 'order',
      limit: 100,
      pagination: false,
    })
    return result.docs as Faq[]
  },
  ['faqs'],
  { tags: [catalogTags.faqs] },
)

export async function getPage(slug: string): Promise<StorePage | null> {
  const { isEnabled } = await draftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    depth: 0,
    draft: isEnabled,
    overrideAccess: isEnabled,
    limit: 1,
    where: {
      and: [{ slug: { equals: slug } }, ...(isEnabled ? [] : [{ _status: { equals: 'published' } }])],
    },
  })
  const page = result.docs[0] as Page | undefined
  if (!page) return null
  return {
    title: page.title,
    slug: page.slug,
    content: page.content,
    metaTitle: page.meta?.title ?? null,
    metaDescription: page.meta?.description ?? null,
    updatedAt: page.updatedAt,
  }
}

export async function getSitemapEntries(): Promise<{ path: string; updatedAt?: string }[]> {
  const [products, categories, collections, payload] = await Promise.all([
    getCatalogProducts(),
    getCategories(),
    getCollections(),
    getPayloadClient(),
  ])
  const pages = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 100,
    where: { _status: { equals: 'published' } },
  })
  return [
    { path: '/' },
    { path: '/productos' },
    { path: '/preguntas-frecuentes' },
    { path: '/contacto' },
    ...categories.map((item) => ({ path: `/categorias/${item.slug}` })),
    ...collections.map((item) => ({ path: `/colecciones/${item.slug}` })),
    ...products.map((item) => ({ path: `/productos/${item.slug}`, updatedAt: item.publishedAt ?? undefined })),
    ...pages.docs.map((page) => ({ path: `/${page.slug}`, updatedAt: page.updatedAt })),
  ]
}

export { filterProducts, PAGE_SIZE }
