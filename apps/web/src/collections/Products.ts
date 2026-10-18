import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'

import { publishedOrStaff, staff } from '@/access'
import { slugFromTitle, slugTextField } from '@/fields/slug'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'
import { setPublishedAt } from '@/hooks/setPublishedAt'
import { storePreviewUrl } from '@/lib/preview'

const validateProduct: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) return data

  if (typeof data.salePrice === 'number' && typeof data.price === 'number' && data.salePrice >= data.price) {
    throw new Error('El precio promocional debe ser menor que el precio regular')
  }

  if (data._status === 'published') {
    const images = Array.isArray(data.images) ? data.images : []
    if (images.length === 0) {
      throw new Error('Publica el producto con al menos una imagen')
    }
  }

  if (data.inventoryMode !== 'variants') return data

  const options = Array.isArray(data.options) ? data.options : []
  const variants = Array.isArray(data.variants) ? data.variants : []
  const seen = new Set<string>()

  for (const variant of variants) {
    const selected = Array.isArray(variant?.selectedOptions) ? variant.selectedOptions : []
    const key = selected
      .map((option: { name?: string; value?: string }) => `${option.name}=${option.value}`)
      .sort()
      .join('|')
    if (!key) {
      throw new Error('Cada variante debe indicar sus opciones, por ejemplo talla y color')
    }
    if (seen.has(key)) {
      throw new Error(`La combinación “${key.replaceAll('|', ', ')}” está repetida`)
    }
    seen.add(key)

    for (const option of selected) {
      const definition = options.find(
        (item: { name?: string }) => item?.name?.toLowerCase() === String(option.name).toLowerCase(),
      )
      const values = Array.isArray(definition?.values)
        ? definition.values.map((item: { value?: string }) => item.value)
        : []
      if (!definition || !values.includes(option.value)) {
        throw new Error(
          `La opción “${option.name}: ${option.value}” no existe en las opciones del producto`,
        )
      }
    }

    if (
      typeof variant.salePrice === 'number' &&
      typeof variant.price === 'number' &&
      variant.salePrice >= variant.price
    ) {
      throw new Error('En una variante, el precio promocional debe ser menor que su precio')
    }
  }

  return data
}

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Producto', plural: 'Productos' },
  admin: {
    useAsTitle: 'title',
    group: 'Catálogo',
    description:
      'Fichas de producto. Usa el icono del ojo (vista previa) para ver la tienda al lado mientras editas; el borrador se guarda solo cada poco.',
    defaultColumns: ['title', 'price', 'inventoryMode', '_status', 'updatedAt'],
    livePreview: {
      url: ({ data }) => storePreviewUrl(`/productos/${data?.slug || ''}`),
    },
  },
  versions: {
    drafts: {
      autosave: { interval: 375 },
    },
  },
  access: {
    read: publishedOrStaff,
    create: staff,
    update: staff,
    delete: staff,
  },
  hooks: {
    beforeValidate: [slugFromTitle('producto'), validateProduct],
    beforeChange: [setPublishedAt],
    afterChange: [
      ({ doc, previousDoc }) => {
        const target = tagsForCollection('products', doc, previousDoc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        const target = tagsForCollection('products', doc)
        void revalidateStoreTags(target.tags, target.paths)
      },
    ],
  },
  fields: [
    { name: 'title', label: 'Nombre', type: 'text', required: true },
    slugTextField(),
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Información',
          fields: [
            {
              name: 'shortDescription',
              label: 'Descripción corta',
              type: 'textarea',
              maxLength: 160,
              admin: { description: 'Aparece en las tarjetas y como descripción para buscadores si no hay otra.' },
            },
            {
              name: 'description',
              label: 'Descripción',
              type: 'richText',
            },
            {
              name: 'category',
              label: 'Categoría',
              type: 'relationship',
              relationTo: 'categories',
              required: true,
            },
            {
              name: 'collections',
              label: 'Colecciones',
              type: 'relationship',
              relationTo: 'collections',
              hasMany: true,
            },
            {
              name: 'tags',
              label: 'Etiquetas',
              type: 'relationship',
              relationTo: 'tags',
              hasMany: true,
            },
            {
              name: 'featured',
              label: 'Destacado en inicio',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'relatedProducts',
              label: 'Productos relacionados',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              maxRows: 4,
              admin: { description: 'Si lo dejas vacío, la tienda muestra productos de la misma categoría.' },
            },
          ],
        },
        {
          label: 'Precio y existencias',
          fields: [
            {
              name: 'price',
              label: 'Precio',
              type: 'number',
              required: true,
              min: 0,
              admin: {
                description:
                  'Entero en la unidad menor de la moneda configurada. En pesos colombianos, escribe 59900 para $ 59.900.',
              },
            },
            {
              name: 'salePrice',
              label: 'Precio promocional',
              type: 'number',
              min: 0,
              admin: { description: 'Opcional. Debe ser menor que el precio regular.' },
            },
            {
              name: 'inventoryMode',
              label: 'Control de existencias',
              type: 'select',
              required: true,
              defaultValue: 'simple',
              options: [
                { label: 'Solo disponible o agotado', value: 'none' },
                { label: 'Existencias del producto', value: 'simple' },
                { label: 'Existencias por variante', value: 'variants' },
              ],
            },
            {
              name: 'available',
              label: 'Disponible',
              type: 'checkbox',
              defaultValue: true,
              admin: { condition: (data) => data?.inventoryMode === 'none' },
            },
            {
              name: 'stock',
              label: 'Unidades',
              type: 'number',
              min: 0,
              defaultValue: 0,
              admin: { condition: (data) => data?.inventoryMode === 'simple' },
            },
            {
              name: 'options',
              label: 'Opciones',
              type: 'array',
              admin: {
                description: 'Por ejemplo Talla: S, M, L y Color: Rosa, Gris.',
                condition: (data) => data?.inventoryMode === 'variants',
              },
              fields: [
                { name: 'name', label: 'Nombre', type: 'text', required: true },
                {
                  name: 'values',
                  label: 'Valores',
                  type: 'array',
                  minRows: 1,
                  fields: [{ name: 'value', label: 'Valor', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'variants',
              label: 'Variantes',
              type: 'array',
              admin: { condition: (data) => data?.inventoryMode === 'variants' },
              fields: [
                {
                  name: 'selectedOptions',
                  label: 'Combinación',
                  type: 'array',
                  fields: [
                    { name: 'name', label: 'Opción', type: 'text', required: true },
                    { name: 'value', label: 'Valor', type: 'text', required: true },
                  ],
                },
                { name: 'sku', label: 'SKU', type: 'text' },
                { name: 'stock', label: 'Unidades', type: 'number', min: 0, required: true, defaultValue: 0 },
                {
                  name: 'price',
                  label: 'Precio propio',
                  type: 'number',
                  min: 0,
                  admin: { description: 'Déjalo vacío para usar el precio del producto.' },
                },
                { name: 'salePrice', label: 'Precio promocional propio', type: 'number', min: 0 },
                { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
        {
          label: 'Imágenes',
          fields: [
            {
              name: 'images',
              label: 'Galería',
              type: 'array',
              minRows: 0,
              admin: { description: 'La primera imagen es la principal. Arrastra para reordenar.' },
              fields: [
                { name: 'image', label: 'Imagen', type: 'upload', relationTo: 'media', required: true },
                {
                  name: 'altOverride',
                  label: 'Texto alternativo en este producto',
                  type: 'text',
                  admin: { description: 'Opcional. Si lo dejas vacío se usa el de la imagen.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Detalles',
          fields: [
            {
              name: 'materials',
              label: 'Materiales',
              type: 'textarea',
            },
            {
              name: 'care',
              label: 'Cuidados',
              type: 'richText',
            },
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      label: 'Fecha de publicación',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
}
