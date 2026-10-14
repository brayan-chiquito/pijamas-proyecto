import type { GlobalConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

const linkFields = [
  { name: 'label', label: 'Texto', type: 'text' as const, required: true },
  {
    name: 'url',
    label: 'Ruta o URL',
    type: 'text' as const,
    required: true,
    admin: { description: 'Ruta interna (/productos) o URL completa.' },
  },
]

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navegación',
  admin: { group: 'Sitio' },
  access: { read: anyone, update: staff },
  hooks: {
    afterChange: [
      () => {
        const target = tagsForCollection('navigation')
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    {
      name: 'header',
      label: 'Menú principal',
      type: 'array',
      fields: linkFields,
    },
    {
      name: 'footerColumns',
      label: 'Columnas del pie',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'title', label: 'Título', type: 'text', required: true },
        { name: 'links', label: 'Enlaces', type: 'array', fields: linkFields },
      ],
    },
    { name: 'footerText', label: 'Texto del pie', type: 'textarea' },
  ],
}
