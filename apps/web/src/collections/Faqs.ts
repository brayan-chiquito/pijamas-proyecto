import type { CollectionConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Pregunta frecuente', plural: 'Preguntas frecuentes' },
  admin: {
    useAsTitle: 'question',
    group: 'Contenido',
    defaultColumns: ['question', 'order'],
  },
  defaultSort: 'order',
  access: {
    read: anyone,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: {
    afterChange: [
      () => {
        const target = tagsForCollection('faqs')
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
    afterDelete: [
      () => {
        const target = tagsForCollection('faqs')
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    { name: 'question', label: 'Pregunta', type: 'text', required: true },
    { name: 'answer', label: 'Respuesta', type: 'richText', required: true },
    { name: 'order', label: 'Orden', type: 'number', defaultValue: 0 },
  ],
}
