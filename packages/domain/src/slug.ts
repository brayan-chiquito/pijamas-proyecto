/** Rutas de la aplicación que no pueden usarse como slug de página institucional. */
export const RESERVED_SLUGS: ReadonlySet<string> = new Set([
  'productos',
  'categorias',
  'colecciones',
  'carrito',
  'finalizar-pedido',
  'buscar',
  'preguntas-frecuentes',
  'contacto',
  'admin',
  'api',
  'next',
  'dev',
  'sitemap.xml',
  'robots.txt',
])

/** Convierte "Pijama Largo de Algodón – Rosa" → "pijama-largo-de-algodon-rosa". */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isValidSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug) && slug.length <= 120
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug)
}
