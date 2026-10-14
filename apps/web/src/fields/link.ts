import type { Field } from 'payload'

/** Enlace interno (ruta) o externo. */
export const linkField = (name = 'link'): Field => ({
  name,
  label: 'Enlace',
  type: 'group',
  fields: [
    {
      name: 'type',
      label: 'Tipo',
      type: 'radio',
      defaultValue: 'internal',
      options: [
        { label: 'Página de la tienda', value: 'internal' },
        { label: 'Enlace externo', value: 'external' },
      ],
    },
    {
      name: 'url',
      label: 'Ruta o URL',
      type: 'text',
      required: true,
      admin: {
        description: 'Ruta interna (por ejemplo /productos) o URL completa si el enlace es externo.',
      },
    },
    {
      name: 'label',
      label: 'Texto',
      type: 'text',
      required: true,
    },
    {
      name: 'newTab',
      label: 'Abrir en una pestaña nueva',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
})
