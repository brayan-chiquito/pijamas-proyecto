import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(dirname, '../..'),
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/media/**' }],
  },
  async headers() {
    // SAMEORIGIN (no DENY): el Live Preview del admin embebe la tienda en un iframe
    // del mismo origen. DENY hace que Chrome muestre error en el panel derecho.
    return [
      {
        source: '/:path*',
        headers: [...securityHeaders, { key: 'X-Frame-Options', value: 'SAMEORIGIN' }],
      },
    ]
  },
  turbopack: {
    root: path.resolve(dirname, '../..'),
  },
}

const payloadConfig = withPayload(nextConfig, { devBundleServerPackages: false })
const payloadHeaders = payloadConfig.headers

// Payload añade Critical-CH para el tema del panel. Chrome vuelve a pedir la página
// y Lighthouse lo cuenta como una redirección. El panel usa tema claro.
payloadConfig.headers = async () => {
  const entries = (await payloadHeaders?.()) ?? []
  return entries.map((entry) => ({
    ...entry,
    headers: (entry.headers ?? []).filter((header) => header.key !== 'Critical-CH' && header.key !== 'Accept-CH'),
  }))
}

export default payloadConfig
