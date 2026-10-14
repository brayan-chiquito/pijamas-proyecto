import { readFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function photoBuffer(url: string | null | undefined): Promise<Buffer | null> {
  if (!url) return null
  const filename = decodeURIComponent(url.split('/').pop() ?? '')
  if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) return null
  try {
    const bytes = await readFile(path.join(process.cwd(), 'media', filename))
    return sharp(bytes).resize(630, 630, { fit: 'cover' }).png().toBuffer()
  } catch (error) {
    console.error(`No se pudo preparar la foto para Open Graph: ${filename}`, error)
    return null
  }
}

/** Tarjeta de 1200×630 para compartir, con la foto principal si existe. */
export async function renderSocialImage(input: {
  eyebrow: string
  title: string
  photoUrl?: string | null
}): Promise<Buffer> {
  const photo = await photoBuffer(input.photoUrl)
  const svg = `<svg width="570" height="630" xmlns="http://www.w3.org/2000/svg">
    <text x="48" y="270" fill="#5b3a57" font-size="28" font-family="Georgia, serif">${escapeXml(input.eyebrow)}</text>
    <text x="48" y="350" fill="#2b2622" font-size="52" font-family="Georgia, serif">${escapeXml(input.title.slice(0, 42))}</text>
  </svg>`
  const layers: { input: Buffer; left: number; top: number }[] = [{ input: Buffer.from(svg), left: 630, top: 0 }]
  if (photo) layers.unshift({ input: photo, left: 0, top: 0 })

  return sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#fbf7f2' },
  })
    .composite(layers)
    .png()
    .toBuffer()
}
