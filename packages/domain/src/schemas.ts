import { z } from 'zod'

import { MAX_CART_LINES, MAX_LINE_QUANTITY } from './cart'
import { normalizeWhatsAppPhone } from './whatsapp'

/** Teléfono de WhatsApp: acepta formato humano y devuelve solo dígitos. */
export const whatsAppPhoneSchema = z
  .string()
  .trim()
  .min(1, { error: 'El número de WhatsApp es obligatorio' })
  .transform((value, ctx) => {
    try {
      return normalizeWhatsAppPhone(value)
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        message: error instanceof Error ? error.message : 'Número de WhatsApp inválido',
      })
      return z.NEVER
    }
  })

const optionalTrimmed = (max: number, label: string) =>
  z
    .string()
    .trim()
    .max(max, { error: `${label} no puede superar ${max} caracteres` })
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null))

/** Formulario de la página de resumen antes de abrir WhatsApp. */
export const checkoutFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Escribe tu nombre (mínimo 2 caracteres)' })
    .max(80, { error: 'El nombre no puede superar 80 caracteres' }),
  city: optionalTrimmed(80, 'La ciudad'),
  note: optionalTrimmed(500, 'La nota'),
})

export type CheckoutFormInput = z.input<typeof checkoutFormSchema>
export type CheckoutForm = z.output<typeof checkoutFormSchema>

/** Línea de carrito tal como la envía el cliente al servidor para reconfirmar. */
export const cartLineInputSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1).nullable(),
  quantity: z.number().int().min(1).max(MAX_LINE_QUANTITY),
  /** Precio que el cliente tenía guardado, para detectar un cambio en el servidor. */
  unitPrice: z.number().int().nonnegative().optional(),
})

export const cartLinesInputSchema = z
  .array(cartLineInputSchema)
  .min(1, { error: 'El carrito está vacío' })
  .max(MAX_CART_LINES, { error: `Máximo ${MAX_CART_LINES} productos distintos` })

export type CartLineInput = z.infer<typeof cartLineInputSchema>

/** Orden del catálogo. */
export const CATALOG_SORT_OPTIONS = ['novedades', 'precio-asc', 'precio-desc', 'nombre'] as const
export type CatalogSort = (typeof CATALOG_SORT_OPTIONS)[number]
export const catalogSortSchema = z.enum(CATALOG_SORT_OPTIONS)

export const CATALOG_PAGE_SIZE = 24

export interface CatalogFilters {
  page: number
  sort: CatalogSort
  categories: string[]
  collections: string[]
  sizes: string[]
  colors: string[]
  tags: string[]
  priceMin: number | null
  priceMax: number | null
  onlyAvailable: boolean
  query: string | null
}

export type RawSearchParams = Record<string, string | string[] | undefined>

const slugList = z.array(z.string().regex(/^[a-z0-9-]+$/)).max(20)
const valueList = z.array(z.string().trim().min(1).max(40)).max(20)

function toArray(value: string | string[] | undefined): string[] {
  if (value === undefined) return []
  const values = Array.isArray(value) ? value : value.split(',')
  return values.map((item) => item.trim()).filter((item) => item.length > 0)
}

function parseOr<T>(schema: z.ZodType<T>, value: unknown, fallback: T): T {
  const result = schema.safeParse(value)
  return result.success ? result.data : fallback
}

const positiveInt = z.coerce.number().int().min(1).max(10_000)
const nonNegativeInt = z.coerce.number().int().min(0).max(1_000_000_000)

/**
 * Convierte `searchParams` en filtros tipados. Los valores inválidos se descartan en lugar de
 * provocar errores: una URL manipulada nunca debe romper la página.
 */
export function parseCatalogSearchParams(raw: RawSearchParams): CatalogFilters {
  const first = (key: string): string | undefined => {
    const value = raw[key]
    return Array.isArray(value) ? value[0] : value
  }

  const priceMin = first('precio_min') === undefined ? null : parseOr(nonNegativeInt, first('precio_min'), null)
  const priceMax = first('precio_max') === undefined ? null : parseOr(nonNegativeInt, first('precio_max'), null)
  const query = first('q')?.trim().slice(0, 80) || null

  return {
    page: parseOr(positiveInt, first('page') ?? '1', 1),
    sort: parseOr(catalogSortSchema, first('orden') ?? 'novedades', 'novedades'),
    categories: parseOr(slugList, toArray(raw['categoria']), []),
    collections: parseOr(slugList, toArray(raw['coleccion']), []),
    sizes: parseOr(valueList, toArray(raw['talla']), []),
    colors: parseOr(valueList, toArray(raw['color']), []),
    tags: parseOr(slugList, toArray(raw['etiqueta']), []),
    priceMin,
    priceMax: priceMax !== null && priceMin !== null && priceMax < priceMin ? null : priceMax,
    onlyAvailable: first('disponible') === '1' || first('disponible') === 'true',
    query,
  }
}

/** true si la URL lleva filtros u orden que no deben indexarse (ver docs/seo.md). */
export function hasNonIndexableFilters(filters: CatalogFilters): boolean {
  return (
    filters.sort !== 'novedades' ||
    filters.categories.length > 0 ||
    filters.collections.length > 0 ||
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.tags.length > 0 ||
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.onlyAvailable ||
    filters.query !== null
  )
}
