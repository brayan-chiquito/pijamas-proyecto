import { CheckoutForm } from '@/components/store/CheckoutForm'
import { getSettings } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Finalizar pedido',
    description: 'Revisa tu pedido antes de enviarlo por WhatsApp.',
    path: '/finalizar-pedido',
    settings,
    noindex: true,
  })
}

export default async function CheckoutPage() {
  const settings = await getSettings()
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-4xl">Revisa tu pedido</h1>
      <CheckoutForm currency={settings.currency} locale={settings.locale} />
    </div>
  )
}
