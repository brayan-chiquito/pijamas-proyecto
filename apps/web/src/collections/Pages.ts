import type { CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { slugFromTitle, slugTextField } from '@/fields/slug'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'
import { storePreviewUrl } from '@/lib/preview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Página', plural: 'Páginas' },
  admin: {
    useAsTitle: 'title',
    group: 'Contenido',
    description:
      'Textos institucionales: nosotros, envíos, privacidad y similares. Abre la vista previa (ojo) para ver el resultado al editar.',
    livePreview: {
      url: ({ data }) => storePreviewUrl(`/${data?.slug || ''}`),
    },
  },
  versions: {
    drafts: { autosave: { interval: 375 } },
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
