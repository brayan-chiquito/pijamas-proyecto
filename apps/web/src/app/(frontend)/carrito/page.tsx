import { CartView } from '@/components/store/CartView'
import { getSettings } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata({ title: 'Carrito', description: 'Tu carrito', path: '/carrito', settings, noindex: true })
}

export default async function CartPage() {
  const settings = await getSettings()
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <h1 className="font-display text-4xl">Carrito</h1>
      <CartView currency={settings.currency} locale={settings.locale} />
    </div>
  )
}
