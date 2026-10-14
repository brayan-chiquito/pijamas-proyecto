import type { MetadataRoute } from 'next'

import { getSitemapEntries } from '@/lib/catalog/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const entries = await getSitemapEntries()
  return entries.map((entry) => ({
    url: `${serverUrl.replace(/\/$/, '')}${entry.path}`,
    lastModified: entry.updatedAt ? new Date(entry.updatedAt) : undefined,
  }))
}
