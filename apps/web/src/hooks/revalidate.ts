import { catalogTags } from '@/lib/catalog/tags'

type Doc = { slug?: string | null }

/**
 * Revalida la caché de la tienda. Fuera de Next (CLI de migraciones o seed) no hay
 * almacén de caché: se ignora el error para no bloquear esas tareas.
 */
export async function revalidateStoreTags(tags: string[], paths: string[] = []): Promise<void> {
  try {
    const { revalidatePath, revalidateTag } = await import('next/cache')
    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 })
    }
    for (const path of paths) {
      revalidatePath(path)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido'
    if (!message.includes('static generation store missing')) {
      console.warn(`No se pudo revalidar la caché de la tienda: ${message}`)
    }
  }
}

export function tagsForCollection(
  collection: string,
  doc?: Doc | null,
  previous?: Doc | null,
): { tags: string[]; paths: string[] } {
  const tags = new Set<string>([catalogTags.settings])
  const paths = new Set<string>(['/'])

  const addSlug = (prefix: string, slug?: string | null) => {
    if (!slug) return
    paths.add(`${prefix}/${slug}`)
  }

  switch (collection) {
    case 'products':
      tags.add(catalogTags.products)
      if (doc?.slug) tags.add(catalogTags.product(doc.slug))
      if (previous?.slug && previous.slug !== doc?.slug) tags.add(catalogTags.product(previous.slug))
      addSlug('/productos', doc?.slug)
      addSlug('/productos', previous?.slug)
      paths.add('/productos')
      break
    case 'categories':
      tags.add(catalogTags.categories)
      tags.add(catalogTags.products)
      addSlug('/categorias', doc?.slug)
      paths.add('/productos')
      break
    case 'collections':
      tags.add(catalogTags.collections)
      addSlug('/colecciones', doc?.slug)
      break
    case 'pages':
      tags.add(catalogTags.pages)
      addSlug('', doc?.slug)
      break
    case 'faqs':
      tags.add(catalogTags.faqs)
      paths.add('/preguntas-frecuentes')
      break
    case 'site-settings':
      tags.add(catalogTags.settings)
      break
    case 'navigation':
      tags.add(catalogTags.navigation)
      break
    case 'home-page':
      tags.add(catalogTags.home)
      break
    case 'size-guide':
      tags.add(catalogTags.sizeGuide)
      break
    default:
      break
  }

  return { tags: [...tags], paths: [...paths] }
}
