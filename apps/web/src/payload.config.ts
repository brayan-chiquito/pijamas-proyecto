import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Collections } from './collections/Collections'
import { Faqs } from './collections/Faqs'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Products } from './collections/Products'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { HomePage } from './globals/HomePage'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { SizeGuide } from './globals/SizeGuide'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const localDevOrigins =
  process.env.NODE_ENV === 'development' ? ['http://localhost:3001', 'http://127.0.0.1:3001'] : []

export default buildConfig({
  admin: {
    theme: 'light',
    user: Users.slug,
    // Evita avisos de hidratación en <html> (tema/dir). El de <style> se parchea en @payloadcms/next.
    suppressHydrationWarning: true,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· Tienda',
    },
    livePreview: {
      breakpoints: [
        { label: 'Móvil', name: 'mobile', width: 390, height: 844 },
        { label: 'Escritorio', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  i18n: {
    supportedLanguages: { es },
    fallbackLanguage: 'es',
  },
  collections: [Users, Media, Categories, Collections, Tags, Products, Pages, Faqs],
  globals: [SiteSettings, Navigation, HomePage, SizeGuide],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: process.env.PAYLOAD_DB_PUSH === 'true',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp,
  graphQL: {
    disable: true,
  },
  cors: [serverURL, ...localDevOrigins],
  csrf: [serverURL, ...localDevOrigins],
  plugins: [
    seoPlugin({
      collections: ['products', 'pages', 'categories', 'collections'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const title = typeof doc?.title === 'string' ? doc.title : ''
        return title
      },
      generateDescription: ({ doc }) => {
        if (typeof doc?.shortDescription === 'string') return doc.shortDescription
        if (typeof doc?.description === 'string') return doc.description.slice(0, 160)
        return ''
      },
    }),
    redirectsPlugin({
      collections: ['products', 'pages', 'categories', 'collections'],
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
