import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { slugFromTitle, slugTextField } from '@/fields/slug'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'
import { storePreviewUrl } from '@/lib/preview'

export const Collections: CollectionConfig = {
  slug: 'collections',
  labels: { singular: 'Colección', plural: 'Colecciones' },
  admin: {
    useAsTitle: 'title',
    group: 'Catálogo',
    description:
      'Selecciones curadas (Novedades, Invierno…). Abre el ojo para ver la colección en la tienda al guardar.',
    livePreview: {
      url: ({ data }) => storePreviewUrl(`/colecciones/${data?.slug || ''}`),
    },
  },
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: {
    beforeValidate: [slugFromTitle('coleccion')],
    afterChange: [
      ({ doc }) => {
        const target = tagsForCollection('collections', doc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        const target = tagsForCollection('collections', doc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Nombre', type: 'text', required: true },
    slugTextField(),
    { name: 'description', label: 'Descripción', type: 'textarea' },
    { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
  ],
}
