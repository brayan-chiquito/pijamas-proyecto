import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { slugFromTitle, slugTextField } from '@/fields/slug'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: {
    useAsTitle: 'title',
    group: 'Catálogo',
    description: 'Agrupación principal del catálogo, por ejemplo Mujer, Hombre o Infantil.',
    defaultColumns: ['title', 'slug', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: {
    beforeValidate: [slugFromTitle('categoria')],
    afterChange: [
      ({ doc, previousDoc }) => {
        const target = tagsForCollection('categories', doc, previousDoc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        const target = tagsForCollection('categories', doc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Nombre', type: 'text', required: true },
    slugTextField(),
    {
      name: 'description',
      label: 'Descripción',
      type: 'textarea',
      admin: { description: 'Texto introductorio de la página de categoría. Ayuda al posicionamiento.' },
    },
    {
      name: 'image',
      label: 'Imagen',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      label: 'Orden',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Número menor aparece primero en menús y filtros.' },
    },
  ],
}
