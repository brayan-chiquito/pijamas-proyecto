/** URL absoluta que activa el modo borrador y abre la ruta de la tienda. */
export function storePreviewUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}/next/preview?path=${encodeURIComponent(normalized)}`
}
