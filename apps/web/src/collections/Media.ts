import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Imágenes' },
  admin: {
    group: 'Sistema',
    description: 'Fotografías de productos y del sitio. El texto alternativo es obligatorio.',
  },
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: staff,
  },
  upload: {
    mimeTypes: IMAGE_TYPES,
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 375, position: 'centre' },
      { name: 'card', width: 640, height: 800, position: 'centre' },
      { name: 'gallery', width: 1200, height: undefined, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre', crop: 'center' },
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe la imagen para quien no pueda verla. Ejemplo: “Pijama largo de algodón rosa, vista frontal”.',
      },
    },
    {
      name: 'caption',
      label: 'Pie de foto',
      type: 'text',
    },
  ],
}
