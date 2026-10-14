import { NextResponse } from 'next/server'

import { getHome, getSettings } from '@/lib/catalog/queries'
import { renderSocialImage } from '@/lib/seo/social-image'

export async function GET() {
  const [settings, home] = await Promise.all([getSettings(), getHome()])
  const hero = home.hero[0]
  const photoUrl = hero?.image && typeof hero.image !== 'number' ? hero.image.url : null
  const png = await renderSocialImage({
    eyebrow: 'Tienda',
    title: settings.siteName || 'Casa Pijama',
    photoUrl,
  })
  return new NextResponse(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
