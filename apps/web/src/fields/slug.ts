import { isReservedSlug, isValidSlug, slugify } from '@pijamas/domain'
import type { CollectionBeforeValidateHook, TextField } from 'payload'

export function slugFromTitle(fallback = 'elemento'): CollectionBeforeValidateHook {
  return ({ data }) => {
    if (!data) return data
    const title = typeof data.title === 'string' ? data.title : ''
    if ((!data.slug || data.slug === '') && title) {
      data.slug = slugify(title) || fallback
    }
    return data
  }
}

export function slugTextField(options?: { reserved?: boolean }): TextField {
  return {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    admin: {
      position: 'sidebar',
      description:
        'Se genera a partir del título. Si lo cambias en un contenido ya publicado, crea una redirección para no perder la URL anterior.',
    },
    validate: (value) => {
      if (typeof value !== 'string' || !isValidSlug(value)) {
        return 'Usa solo minúsculas, números y guiones, sin empezar ni terminar en guion'
      }
      if (options?.reserved && isReservedSlug(value)) {
        return 'Ese slug está reservado por la tienda. Elige otro.'
      }
      return true
    },
  }
}
