import { notFound } from 'next/navigation'

import { RichText } from '@/components/richtext/RichText'
import { getPage, getSettings } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'
import { isReservedSlug } from '@pijamas/domain'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [page, settings] = await Promise.all([getPage(slug), getSettings()])
  if (!page || isReservedSlug(slug)) return { title: 'Página no encontrada' }
  return buildMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription,
    path: `/${page.slug}`,
    settings,
  })
}

export default async function InstitutionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (isReservedSlug(slug)) notFound()
  const page = await getPage(slug)
  if (!page) notFound()
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">{page.title}</h1>
      <RichText data={page.content} />
    </article>
  )
}
