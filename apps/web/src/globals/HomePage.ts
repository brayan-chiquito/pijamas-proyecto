import type { GlobalConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Página de inicio',
  admin: {
    group: 'Contenido',
    description: 'Hero, categorías y productos destacados de la portada.',
    livePreview: {
      url: () => process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    },
  },
  versions: { drafts: { autosave: { interval: 2000 } } },
  access: { read: anyone, update: staff },
  hooks: {
    afterChange: [
      () => {
        const target = tagsForCollection('home-page')
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    {
      name: 'hero',
      label: 'Hero',
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'Hasta tres fotos. Si hay más de una, la portada las va mostrando cada pocos segundos. El texto visible es el de la primera.',
      },
      fields: [
        { name: 'eyebrow', label: 'Antetítulo', type: 'text' },
        { name: 'title', label: 'Título', type: 'text', required: true },
        { name: 'text', label: 'Texto', type: 'textarea' },
        { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
        { name: 'ctaLabel', label: 'Texto del botón', type: 'text' },
        { name: 'ctaLink', label: 'Enlace del botón', type: 'text' },
      ],
    },
    {
      name: 'featuredCategories',
      label: 'Categorías destacadas',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'featuredTitle',
      label: 'Título de destacados',
      type: 'text',
      defaultValue: 'Elegidos para descansar',
    },
    {
      name: 'featuredProductsMode',
      label: 'Cómo elegir destacados',
      type: 'select',
      defaultValue: 'featuredFlag',
      options: [
        { label: 'Productos marcados como destacados', value: 'featuredFlag' },
        { label: 'Selección manual', value: 'manual' },
        { label: 'Una colección', value: 'collection' },
      ],
    },
    {
      name: 'featuredProducts',
      label: 'Productos',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { condition: (data) => data?.featuredProductsMode === 'manual' },
    },
    {
      name: 'featuredCollection',
      label: 'Colección',
      type: 'relationship',
      relationTo: 'collections',
      admin: { condition: (data) => data?.featuredProductsMode === 'collection' },
    },
    { name: 'showTrustBlock', label: 'Mostrar bloque de confianza', type: 'checkbox', defaultValue: true },
    {
      name: 'promoEnabled',
      label: 'Mostrar bloque promocional',
      type: 'checkbox',
      defaultValue: false,
    },
    { name: 'promoTitle', label: 'Título promocional', type: 'text' },
    { name: 'promoText', label: 'Texto promocional', type: 'textarea' },
    { name: 'promoCtaLabel', label: 'Botón promocional', type: 'text' },
    { name: 'promoCtaLink', label: 'Enlace promocional', type: 'text' },
    { name: 'promoImage', label: 'Imagen promocional', type: 'upload', relationTo: 'media' },
  ],
}
