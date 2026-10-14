import {
  availabilityLabel,
  getAvailability,
  getEffectivePrice,
  getPriceRange,
  getPurchasableUnits,
  type Availability,
} from '@pijamas/domain'

import type { Category, Collection, Media, Product, Tag } from '@/payload-types'

import type { ProductDetail, ProductSummary, StoreImage, StoreVariant } from './types'

export function mediaImage(
  media: number | Media | null | undefined,
  altFallback = '',
  size?: 'thumbnail' | 'card' | 'gallery' | 'og',
): StoreImage | null {
  if (!media || typeof media === 'number') return null
  const sized = size ? media.sizes?.[size] : undefined
  const url = sized?.url || media.url
  if (!url) return null
  return {
    url,
    alt: media.alt || altFallback,
    width: sized?.width ?? media.width ?? null,
    height: sized?.height ?? media.height ?? null,
  }
}

function relationSlug(value: number | { slug: string } | null | undefined): string | null {
  if (!value || typeof value === 'number') return null
  return value.slug
}

function relationTitle(value: number | { title: string }): string {
  if (typeof value === 'number') return ''
  return value.title
}

function optionValues(product: Product, matcher: RegExp): string[] {
  const option = product.options?.find((item) => matcher.test(item.name))
  return option?.values?.map((item) => item.value).filter(Boolean) ?? []
}

function variantLabel(options: { name: string; value: string }[]): string {
  return options.map((option) => option.value).join(' · ')
}

export function toSummary(product: Product, threshold: number): ProductSummary | null {
  if (typeof product.category === 'number') return null
  const range = getPriceRange(product, product.variants)
  const effective = getEffectivePrice(product)
  const images = (product.images ?? [])
    .map((item) => {
      const image = mediaImage(item.image, item.altOverride || product.title, 'card')
      if (image && item.altOverride) image.alt = item.altOverride
      return image
    })
    .filter((image): image is StoreImage => image !== null)

  return {
    id: String(product.id),
    slug: product.slug,
    title: product.title,
    shortDescription: product.shortDescription ?? null,
    price: range.min,
    compareAtPrice: range.isRange ? null : effective.compareAtPrice,
    priceMax: range.isRange ? range.max : null,
    availability: getAvailability(product, threshold),
    image: images[0] ?? null,
    hoverImage: images[1] ?? null,
    categorySlug: product.category.slug,
    categoryTitle: product.category.title,
    collectionSlugs: (product.collections ?? [])
      .map((item) => relationSlug(item))
      .filter((slug): slug is string => Boolean(slug)),
    tagSlugs: (product.tags ?? [])
      .map((item) => relationSlug(item as number | Tag))
      .filter((slug): slug is string => Boolean(slug)),
    sizes: optionValues(product, /talla|size/i),
    colors: optionValues(product, /color/i),
    featured: Boolean(product.featured),
    publishedAt: product.publishedAt ?? null,
  }
}

export function toDetail(
  product: Product,
  threshold: number,
  related: Product[],
): ProductDetail | null {
  const summary = toSummary(product, threshold)
  if (!summary) return null

  const variants: StoreVariant[] = (product.variants ?? []).map((variant, index) => {
    const options = (variant.selectedOptions ?? []).map((option) => ({
      name: option.name,
      value: option.value,
    }))
    const price = getEffectivePrice(product, variant)
    const image = mediaImage(variant.image, product.title, 'gallery')
    return {
      id: variant.id || `variant-${index}`,
      label: variantLabel(options),
      options,
      sku: variant.sku ?? null,
      stock: variant.stock,
      price: price.price,
      compareAtPrice: price.compareAtPrice,
      availability: getAvailability(product, threshold, variant),
      imageUrl: image?.url ?? null,
    }
  })

  const images = (product.images ?? [])
    .map((item) => {
      const image = mediaImage(item.image, item.altOverride || product.title, 'gallery')
      if (image && item.altOverride) image.alt = item.altOverride
      return image
    })
    .filter((image): image is StoreImage => image !== null)

  return {
    ...summary,
    description: product.description ?? null,
    materials: product.materials ?? null,
    care: product.care ?? null,
    images,
    options: (product.options ?? []).map((option) => ({
      name: option.name,
      values: option.values?.map((item) => item.value) ?? [],
    })),
    variants,
    inventoryMode: product.inventoryMode,
    stock: product.stock ?? null,
    available: Boolean(product.available),
    related: related
      .map((item) => toSummary(item, threshold))
      .filter((item): item is ProductSummary => item !== null),
    metaTitle: product.meta?.title ?? null,
    metaDescription: product.meta?.description ?? null,
    updatedAt: product.updatedAt,
  }
}

export function variantPurchasableUnits(product: ProductDetail, variantId: string | null): number | null {
  if (product.inventoryMode === 'variants') {
    const variant = product.variants.find((item) => item.id === variantId)
    return variant ? variant.stock : 0
  }
  return getPurchasableUnits({
    inventoryMode: product.inventoryMode,
    available: product.available,
    stock: product.stock,
  })
}

export function availabilityText(availability: Availability, units?: number | null): string {
  return availabilityLabel(availability, units)
}

export function categoryTitleOf(value: number | Category | Collection): string {
  return relationTitle(value)
}
