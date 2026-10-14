import type { Availability, InventoryMode } from '@pijamas/domain'

export interface StoreImage {
  url: string
  alt: string
  width: number | null
  height: number | null
}

export interface StoreVariant {
  id: string
  label: string
  options: { name: string; value: string }[]
  sku: string | null
  stock: number
  price: number
  compareAtPrice: number | null
  availability: Availability
  imageUrl: string | null
}

export interface ProductSummary {
  id: string
  slug: string
  title: string
  shortDescription: string | null
  price: number
  compareAtPrice: number | null
  priceMax: number | null
  availability: Availability
  image: StoreImage | null
  hoverImage: StoreImage | null
  categorySlug: string
  categoryTitle: string
  collectionSlugs: string[]
  tagSlugs: string[]
  sizes: string[]
  colors: string[]
  featured: boolean
  publishedAt: string | null
}

export interface ProductDetail extends ProductSummary {
  description: unknown
  materials: string | null
  care: unknown
  images: StoreImage[]
  options: { name: string; values: string[] }[]
  variants: StoreVariant[]
  inventoryMode: InventoryMode
  stock: number | null
  available: boolean
  related: ProductSummary[]
  metaTitle: string | null
  metaDescription: string | null
  updatedAt: string
}

export interface StoreCategory {
  id: string
  title: string
  slug: string
  description: string | null
  image: StoreImage | null
  metaTitle: string | null
  metaDescription: string | null
}

export interface StorePage {
  title: string
  slug: string
  content: unknown
  metaTitle: string | null
  metaDescription: string | null
  updatedAt: string
}

export interface StoreSettings {
  siteName: string
  tagline: string
  currency: string
  locale: string
  lowStockThreshold: number
  shippingNotice: string
  whatsappEnabled: boolean
  whatsappPhone: string
  whatsappGreeting: string
  floatingButton: boolean
  email: string | null
  phone: string | null
  address: string | null
  schedule: string | null
  socialLinks: { platform: string; url: string }[]
  announcementEnabled: boolean
  announcementText: string | null
  announcementLink: string | null
  trustItems: { title: string; text: string }[]
  defaultTitleSuffix: string
  defaultDescription: string
  logoUrl: string | null
  logoAlt: string
}

export interface StoreNavLink {
  label: string
  url: string
}

export interface StoreNavigation {
  header: StoreNavLink[]
  footerColumns: { title: string; links: StoreNavLink[] }[]
  footerText: string
}
