import { NextResponse } from 'next/server'

import { getProduct, getSettings } from '@/lib/catalog/queries'
import { renderSocialImage } from '@/lib/seo/social-image'

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params
  const [product, settings] = await Promise.all([getProduct(slug), getSettings()])
  if (!product) return new NextResponse('Producto no encontrado', { status: 404 })
  const png = await renderSocialImage({
    eyebrow: settings.siteName,
    title: product.title,
    photoUrl: product.images[0]?.url,
  })
  return new NextResponse(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
