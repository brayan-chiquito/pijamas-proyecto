import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { slugFromTitle, slugTextField } from '@/fields/slug'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    description: 'Textos institucionales: nosotros, envíos, privacidad y similares.',
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
        return `${base}/${data?.slug || ''}`
      },
    },
  },
  versions: {
    drafts: { autosave: { interval: 2000 } },
  },
  access: {
    read: publishedOrStaff,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: {
    beforeValidate: [slugFromTitle('pagina')],
    afterChange: [
      ({ doc }) => {
        const target = tagsForCollection('pages', doc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        const target = tagsForCollection('pages', doc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Título', type: 'text', required: true },
    slugTextField({ reserved: true }),
    { name: 'content', label: 'Contenido', type: 'richText', required: true },
  ],
}
