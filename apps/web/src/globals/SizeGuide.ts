import type { GlobalConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

export const SizeGuide: GlobalConfig = {
  slug: 'size-guide',
  label: 'Guía de tallas',
  admin: { group: 'Contenido' },
  access: { read: anyone, update: staff },
  hooks: {
    afterChange: [
      () => {
        const target = tagsForCollection('size-guide')
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    { name: 'content', label: 'Contenido', type: 'richText' },
    { name: 'note', label: 'Nota', type: 'textarea' },
  ],
}
