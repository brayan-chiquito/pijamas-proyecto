import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

function richText(value: string) {
  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
          children: [{ type: 'text', text: value, version: 1 }],
        },
      ],
    },
  }
}

const photosDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'photos')

/** Fotos de muestra con licencia libre. En el panel se reemplazan desde Imágenes. */
const demoPhotos = [
  {
    file: 'pijama-rosa.jpg',
    alt: 'Mujer con pijama largo de seda rosa, vista frontal',
    productSlug: 'pijama-largo-algodon-rosa',
    source: 'https://unsplash.com/photos/bzfvE8uuf8c',
  },
  {
    file: 'conjunto-lila.jpg',
    alt: 'Mujer con conjunto de pijama de seda lila, vista frontal',
    productSlug: 'conjunto-corto-gris',
    source: 'https://unsplash.com/photos/S-D72M0_6tU',
  },
  {
    file: 'pijama-infantil.jpg',
    alt: 'Niño con pijama infantil de animalitos sentado en un sofá',
    productSlug: 'pijama-infantil-estampado',
    source: 'https://www.pexels.com/photo/8501444/',
  },
  {
    file: 'bata.jpg',
    alt: 'Mujer con bata clara de casa, de pie junto a una pared de madera',
    productSlug: 'bata-suave-de-casa',
    source: 'https://unsplash.com/photos/_wh6EULbphc',
  },
] as const

type DemoPhotoFile = { file: string; alt: string; source: string }

const extraShots: { slug: string; photo: DemoPhotoFile }[] = [
  {
    slug: 'bata-suave-de-casa',
    photo: {
      file: 'bata-detalle.jpg',
      alt: 'Mujer con bata blanca frente al espejo del baño',
      source: 'https://unsplash.com/photos/jyKa0Ynxvow',
    },
  },
  {
    slug: 'pijama-infantil-estampado',
    photo: {
      file: 'ninos-cama.jpg',
      alt: 'Niños con pijamas de animalitos recostados en la cama',
      source: 'https://www.pexels.com/photo/8501622/',
    },
  },
]

const extraProducts: {
  title: string
  slug: string
  price: number
  salePrice: number | null
  categorySlug: string
  shortDescription: string
  photos: DemoPhotoFile[]
}[] = [
  {
    title: 'Pijama estampado rojo',
    slug: 'pijama-estampado-rojo',
    price: 92900,
    salePrice: null,
    categorySlug: 'mujer',
    shortDescription: 'Pijama largo estampado en rojo, para quedarse en casa.',
    photos: [
      {
        file: 'pijama-rojo.jpg',
        alt: 'Mujer sentada con pijama largo rojo estampado',
        source: 'https://unsplash.com/photos/gW4EagjjI9Y',
      },
    ],
  },
  {
    title: 'Pijama de cuadros rosa',
    slug: 'pijama-cuadros-rosa',
    price: 75900,
    salePrice: null,
    categorySlug: 'mujer',
    shortDescription: 'Pijama de cuadros rosas, corte holgado.',
    photos: [
      {
        file: 'llamada.jpg',
        alt: 'Mujer con pijama de cuadros rosa sentada junto a la cama',
        source: 'https://unsplash.com/photos/qI1gOy9z3QI',
      },
    ],
  },
  {
    title: 'Pijama corto de satén',
    slug: 'pijama-corto-saten',
    price: 84900,
    salePrice: 79900,
    categorySlug: 'mujer',
    shortDescription: 'Pijama corto de satén para noches templadas.',
    photos: [
      {
        file: 'descanso.jpg',
        alt: 'Persona recostada con pijama corto de satén',
        source: 'https://unsplash.com/photos/jsley_wlVOA',
      },
    ],
  },
  {
    title: 'Pijama infantil de rayas',
    slug: 'pijama-infantil-rayas',
    price: 54900,
    salePrice: null,
    categorySlug: 'infantil',
    shortDescription: 'Pijama suave para niños, con una segunda foto para la galería.',
    photos: [
      {
        file: 'nino-dormido.jpg',
        alt: 'Niño dormido con pijama de rayas',
        source: 'https://www.pexels.com/photo/20238370/',
      },
      {
        file: 'nino-juegos.jpg',
        alt: 'Niño de espaldas con pijama estampado de animales',
        source: 'https://www.pexels.com/photo/12788194/',
      },
    ],
  },
]

function demoFileNames(): string[] {
  return [
    ...demoPhotos.map((photo) => photo.file),
    ...extraShots.map((shot) => shot.photo.file),
    ...extraProducts.flatMap((product) => product.photos.map((photo) => photo.file)),
  ]
}

async function upsertDemoPhoto(payload: Payload, photo: DemoPhotoFile) {
  const buffer = await readFile(path.join(photosDir, photo.file))
  const file = {
    data: buffer,
    mimetype: 'image/jpeg',
    name: photo.file,
    size: buffer.length,
  }
  const caption = `Imagen de muestra (${photo.source}). Puedes reemplazarla en Imágenes.`
  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: photo.file } },
    limit: 1,
  })
  const current = existing.docs[0]
  if (current) {
    return payload.update({
      collection: 'media',
      id: current.id,
      data: { alt: photo.alt, caption },
      file,
    })
  }
  return payload.create({
    collection: 'media',
    data: { alt: photo.alt, caption },
    file,
  })
}

function fileStem(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').replace(/-\d+$/, '')
}

function isReplaceableDemo(filename: string | null | undefined): boolean {
  if (!filename) return true
  if (filename.endsWith('.png')) return true
  const stem = fileStem(filename)
  return demoFileNames().some((file) => fileStem(file) === stem)
}

const heroSlideFiles = ['pijama-rosa.jpg', 'conjunto-lila.jpg', 'bata.jpg'] as const

async function assignDemoPhotos(payload: Payload) {
  const heroMedia = new Map<string, number>()
  for (const photo of demoPhotos) {
    const found = await payload.find({
      collection: 'products',
      where: { slug: { equals: photo.productSlug } },
      limit: 1,
      depth: 1,
      draft: false,
    })
    const product = found.docs[0]
    if (!product) continue
    const current = product.images?.[0]?.image
    const filename = current && typeof current !== 'number' ? current.filename : null
    if (current && !isReplaceableDemo(filename)) continue
    const media = await upsertDemoPhoto(payload, photo)
    const title =
      product.slug === 'pijama-largo-algodon-rosa' && product.title === 'Pijama largo de algodón rosa'
        ? 'Pijama largo de seda rosa'
        : product.slug === 'conjunto-corto-gris' && product.title === 'Conjunto corto gris'
          ? 'Conjunto de seda lila'
          : undefined
    await payload.update({
      collection: 'products',
      id: product.id,
      draft: false,
      data: { images: [{ image: media.id }], ...(title ? { title } : {}) },
    })
    heroMedia.set(photo.file, media.id)
    console.info(`Foto de muestra asignada: ${product.slug}`)
  }

  const heroIds = heroSlideFiles.flatMap((file) => {
    const id = heroMedia.get(file)
    return id ? [id] : []
  })
  if (heroIds.length === 0) return
  const home = await payload.findGlobal({ slug: 'home-page', depth: 0 })
  const first = home.hero?.[0]
  if (!first?.title) return
  let heroFilename: string | null = null
  if (typeof first.image === 'number') {
    const currentHero = await payload.findByID({ collection: 'media', id: first.image })
    heroFilename = currentHero.filename ?? null
  }
  if (first.image && !isReplaceableDemo(heroFilename)) return
  await payload.updateGlobal({
    slug: 'home-page',
    draft: false,
    data: {
      hero: heroIds.map((image) => ({
        eyebrow: first.eyebrow,
        title: first.title,
        text: first.text,
        ctaLabel: first.ctaLabel,
        ctaLink: first.ctaLink,
        image,
      })),
    },
  })
}

async function attachPhoto(payload: Payload, slug: string, photo: DemoPhotoFile) {
  const media = await upsertDemoPhoto(payload, photo)
  const found = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    draft: false,
  })
  const product = found.docs[0]
  if (!product) return
  const current = (product.images ?? [])
    .map((item) => item.image)
    .filter((image): image is Exclude<typeof image, number> => Boolean(image) && typeof image !== 'number')
  const filenames = current.map((image) => image.filename)
  if (filenames.some((name) => name && !isReplaceableDemo(name))) return
  if (filenames.some((name) => name && fileStem(name) === fileStem(photo.file))) return
  await payload.update({
    collection: 'products',
    id: product.id,
    draft: false,
    data: { images: [...current.map((image) => ({ image: image.id })), { image: media.id }] },
  })
  console.info(`Segunda foto asignada: ${slug}`)
}

async function ensureExtraCatalog(payload: Payload) {
  for (const shot of extraShots) {
    await attachPhoto(payload, shot.slug, shot.photo)
  }

  const categories = await payload.find({ collection: 'categories', limit: 20 })
  const categoryId = new Map(categories.docs.map((category) => [category.slug, category.id]))
  const collections = await payload.find({
    collection: 'collections',
    where: { slug: { equals: 'novedades' } },
    limit: 1,
  })
  const collectionId = collections.docs[0]?.id

  for (const spec of extraProducts) {
    const existing = await payload.find({
      collection: 'products',
      where: { slug: { equals: spec.slug } },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length === 0) {
      const category = categoryId.get(spec.categorySlug)
      if (!category || !collectionId) {
        throw new Error(`No se pudo crear ${spec.slug}: falta la categoría o la colección`)
      }
      const photos = []
      for (const photo of spec.photos) {
        photos.push(await upsertDemoPhoto(payload, photo))
      }
      await payload.create({
        collection: 'products',
        draft: false,
        data: {
          title: spec.title,
          slug: spec.slug,
          shortDescription: spec.shortDescription,
          description: richText(`${spec.title}. Hecho para noches tranquilas y mañanas lentas.`),
          category,
          collections: [collectionId],
          price: spec.price,
          salePrice: spec.salePrice,
          inventoryMode: 'variants',
          featured: true,
          options: [
            { name: 'Talla', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }] },
            { name: 'Color', values: [{ value: 'Rosa' }, { value: 'Gris' }] },
          ],
          variants: [
            { selectedOptions: [{ name: 'Talla', value: 'S' }, { name: 'Color', value: 'Rosa' }], stock: 4 },
            { selectedOptions: [{ name: 'Talla', value: 'M' }, { name: 'Color', value: 'Rosa' }], stock: 2 },
            { selectedOptions: [{ name: 'Talla', value: 'L' }, { name: 'Color', value: 'Gris' }], stock: 0 },
          ],
          images: photos.map((photo) => ({ image: photo.id })),
          materials: 'Algodón',
          _status: 'published',
        },
      })
      console.info(`Producto de muestra creado: ${spec.slug}`)
      continue
    }
    for (const photo of spec.photos) {
      await attachPhoto(payload, spec.slug, photo)
    }
  }
}

async function main() {
  const payload = await getPayload({ config })
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@pijamas.local'
  const password = process.env.SEED_ADMIN_PASSWORD || 'cambia-esta-clave'

  const existingUser = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
  })
  if (existingUser.docs.length === 0) {
    await payload.create({
      collection: 'users',
      data: { email, password, name: 'Administradora', role: 'admin' },
    })
    console.info(`Usuario admin creado: ${email}`)
  }

  const existing = await payload.find({ collection: 'categories', where: { slug: { equals: 'mujer' } }, limit: 1 })
  if (existing.docs.length > 0) {
    const [infantil, childProduct] = await Promise.all([
      payload.find({ collection: 'categories', where: { slug: { equals: 'infantil' } }, limit: 1 }),
      payload.find({
        collection: 'products',
        where: { slug: { equals: 'pijama-infantil-estampado' } },
        limit: 1,
        depth: 0,
      }),
    ])
    const category = infantil.docs[0]
    const product = childProduct.docs[0]
    if (category && product && product.category !== category.id) {
      await payload.update({
        collection: 'products',
        id: product.id,
        draft: false,
        data: { category: category.id },
      })
      console.info('Categoría del pijama infantil corregida.')
    }
    await assignDemoPhotos(payload)
    await ensureExtraCatalog(payload)
    console.info('El catálogo de demostración ya existe. No se duplica.')
    return
  }

  const mediaBySlug = new Map<string, number>()
  for (const photo of demoPhotos) {
    const created = await upsertDemoPhoto(payload, photo)
    mediaBySlug.set(photo.productSlug, created.id)
  }

  const categories = []
  for (const [title, slug, order] of [
    ['Mujer', 'mujer', 1],
    ['Hombre', 'hombre', 2],
    ['Infantil', 'infantil', 3],
  ] as const) {
    categories.push(
      await payload.create({
        collection: 'categories',
        data: { title, slug, order, description: `Pijamas para ${title.toLowerCase()}.` },
      }),
    )
  }

  const collection = await payload.create({
    collection: 'collections',
    data: { title: 'Novedades', slug: 'novedades', description: 'Lo último en llegar.' },
  })

  const products = [
    ['Pijama largo de seda rosa', 'pijama-largo-algodon-rosa', 89900, 74900, 0],
    ['Conjunto de seda lila', 'conjunto-corto-gris', 69900, null, 1],
    ['Pijama infantil estampado', 'pijama-infantil-estampado', 49900, null, 2],
    ['Bata suave de casa', 'bata-suave-de-casa', 119900, null, 1],
  ] as const

  const fallbackCategory = categories[0]
  if (!fallbackCategory) throw new Error('No se pudo crear la categoría de demostración')

  for (const [title, slug, price, salePrice, categoryIndex] of products) {
    const photoId = mediaBySlug.get(slug)
    if (!photoId) continue
    const category = categories[categoryIndex] ?? fallbackCategory
    await payload.create({
      collection: 'products',
      draft: false,
      data: {
        title,
        slug,
        shortDescription: `${title}, tela suave para descansar.`,
        description: richText(`${title}. Hecho para noches tranquilas y mañanas lentas.`),
        category: category.id,
        collections: [collection.id],
        price,
        salePrice,
        inventoryMode: 'variants',
        featured: true,
        options: [
          { name: 'Talla', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }] },
          { name: 'Color', values: [{ value: 'Rosa' }, { value: 'Gris' }] },
        ],
        variants: [
          { selectedOptions: [{ name: 'Talla', value: 'S' }, { name: 'Color', value: 'Rosa' }], stock: 4 },
          { selectedOptions: [{ name: 'Talla', value: 'M' }, { name: 'Color', value: 'Rosa' }], stock: 2 },
          { selectedOptions: [{ name: 'Talla', value: 'L' }, { name: 'Color', value: 'Gris' }], stock: 0 },
        ],
        images: [{ image: photoId }],
        materials: 'Algodón',
        _status: 'published',
      },
    })
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Casa Pijama',
      tagline: 'Descanso bien vestido',
      currency: 'COP',
      locale: 'es-CO',
      whatsappEnabled: true,
      whatsappPhone: '573001112233',
      floatingButton: true,
      email: 'hola@casapijama.local',
      defaultDescription: 'Pijamas de algodón para descansar mejor.',
      trustItems: [
        { title: 'Telas suaves', text: 'Algodón pensado para dormir.' },
        { title: 'Cambios fáciles', text: 'Cuéntanos por WhatsApp si necesitas otra talla.' },
        { title: 'Atención cercana', text: 'Te respondemos en el mismo chat.' },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      header: [
        { label: 'Productos', url: '/productos' },
        { label: 'Mujer', url: '/categorias/mujer' },
        { label: 'Preguntas', url: '/preguntas-frecuentes' },
        { label: 'Contacto', url: '/contacto' },
      ],
      footerColumns: [
        {
          title: 'Tienda',
          links: [
            { label: 'Catálogo', url: '/productos' },
            { label: 'Novedades', url: '/colecciones/novedades' },
          ],
        },
      ],
      footerText: 'Los pedidos se confirman por WhatsApp.',
    },
  })

  await payload.updateGlobal({
    slug: 'home-page',
    draft: false,
    data: {
      hero: ['pijama-largo-algodon-rosa', 'conjunto-corto-gris', 'bata-suave-de-casa'].flatMap((slug) => {
        const image = mediaBySlug.get(slug)
        if (!image) return []
        return [
          {
            eyebrow: 'Nueva temporada',
            title: 'Pijamas para quedarse en casa',
            text: 'Telas suaves, cortes cómodos y un pedido que se cierra por WhatsApp.',
            ctaLabel: 'Ver la colección',
            ctaLink: '/colecciones/novedades',
            image,
          },
        ]
      }),
      featuredProductsMode: 'featuredFlag',
      featuredTitle: 'Elegidos para descansar',
      showTrustBlock: true,
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'faqs',
    data: {
      question: '¿El pedido queda confirmado al abrir WhatsApp?',
      answer: richText('No. WhatsApp abre el mensaje preparado y la tienda confirma disponibilidad y total en la conversación.'),
      order: 1,
    },
  })

  await payload.create({
    collection: 'pages',
    draft: false,
    data: {
      title: 'Envíos y cambios',
      slug: 'envios-y-cambios',
      content: richText('Los envíos y los cambios se coordinan por WhatsApp después de revisar tu pedido.'),
      _status: 'published',
    },
  })

  await ensureExtraCatalog(payload)
  console.info('Datos de demostración creados.')
}

await main()
process.exit(0)
