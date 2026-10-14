import { RichText } from '@/components/richtext/RichText'
import { getFaqs, getSettings } from '@/lib/catalog/queries'
import { buildMetadata, faqJsonLd, JsonLd } from '@/lib/seo'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Preguntas frecuentes',
    description: 'Envíos, cambios y compras por WhatsApp.',
    path: '/preguntas-frecuentes',
    settings,
  })
}

export default async function FaqPage() {
  const faqs = await getFaqs()
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Preguntas frecuentes</h1>
      <div className="mt-8 space-y-3">
        {faqs.map((faq) => (
          <details key={faq.id} className="rounded-md bg-white p-4 shadow-card">
            <summary className="min-h-11 cursor-pointer font-semibold">{faq.question}</summary>
            <RichText data={faq.answer} />
          </details>
        ))}
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </div>
  )
}
