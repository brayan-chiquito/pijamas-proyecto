import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { slugFromTitle, slugTextField } from '@/fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: { singular: 'Etiqueta', plural: 'Etiquetas' },
  admin: {
    useAsTitle: 'title',
    group: 'Catálogo',
    description: 'Atributos filtrables: material, tipo de manga o estación.',
  },
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: {
    beforeValidate: [slugFromTitle('etiqueta')],
  },
  fields: [
    { name: 'title', label: 'Nombre', type: 'text', required: true },
    slugTextField(),
    {
      name: 'group',
      label: 'Grupo',
      type: 'select',
      required: true,
      defaultValue: 'otro',
      options: [
        { label: 'Material', value: 'material' },
        { label: 'Manga', value: 'manga' },
        { label: 'Estación', value: 'estacion' },
        { label: 'Otro', value: 'otro' },
      ],
    },
  ],
}
