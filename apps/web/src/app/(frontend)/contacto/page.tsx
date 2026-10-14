import { getSettings } from '@/lib/catalog/queries'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata() {
  const settings = await getSettings()
  return buildMetadata({
    title: 'Contacto',
    description: 'Escríbenos para resolver dudas sobre tu pedido.',
    path: '/contacto',
    settings,
  })
}

export default async function ContactPage() {
  const settings = await getSettings()
  const whatsapp = settings.whatsappEnabled
    ? `https://wa.me/${settings.whatsappPhone}`
    : null
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-4xl">Contacto</h1>
      <dl className="mt-6 space-y-3 text-sm">
        {settings.email ? (
          <div>
            <dt className="font-semibold">Correo</dt>
            <dd>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </dd>
          </div>
        ) : null}
        {settings.phone ? (
          <div>
            <dt className="font-semibold">Teléfono</dt>
            <dd>{settings.phone}</dd>
          </div>
        ) : null}
        {settings.address ? (
          <div>
            <dt className="font-semibold">Dirección</dt>
            <dd>{settings.address}</dd>
          </div>
        ) : null}
        {settings.schedule ? (
          <div>
            <dt className="font-semibold">Horario</dt>
            <dd>{settings.schedule}</dd>
          </div>
        ) : null}
      </dl>
      {whatsapp ? (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-11 items-center rounded-md bg-plum-700 px-5 text-sm font-semibold text-white">
          Escribir por WhatsApp
        </a>
      ) : null}
    </div>
  )
}
