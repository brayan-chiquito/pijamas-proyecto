import { notFound } from 'next/navigation'

import { ProductGrid } from '@/components/store/ProductCard'
import { Accordion } from '@/components/ui/Accordion'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Price } from '@/components/ui/Price'
import { Sheet } from '@/components/ui/Sheet'
import { ToastDemo } from '@/components/ui/Toast'
import type { ProductSummary } from '@/lib/catalog/types'

const sample: ProductSummary = {
  id: 'dev-sample',
  slug: 'pijama-de-muestra',
  title: 'Pijama de muestra',
  shortDescription: null,
  price: 74900,
  compareAtPrice: 89900,
  priceMax: null,
  availability: 'in_stock',
  image: null,
  hoverImage: null,
  categorySlug: 'mujer',
  categoryTitle: 'Mujer',
  collectionSlugs: [],
  tagSlugs: [],
  sizes: ['M'],
  colors: ['Rosa'],
  featured: true,
  publishedAt: null,
}

export default function DevUiPage() {
  if (process.env.NODE_ENV === 'production') notFound()

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 lg:px-8">
      <header>
        <h1 className="font-display text-4xl">Galería de interfaz</h1>
        <p className="mt-2 max-w-prose text-ink-600">
          Componentes y estados de la tienda. Esta página solo existe en desarrollo.
        </p>
      </header>

      <section>
        <h2 className="font-display text-2xl">Botones</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button">Primario</Button>
          <Button type="button" variant="secondary">
            Secundario
          </Button>
          <Button type="button" variant="ghost">
            Fantasma
          </Button>
          <Button type="button" disabled>
            Deshabilitado
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Etiquetas</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge tone="new">Nuevo</Badge>
          <Badge tone="sale">Oferta</Badge>
          <Badge tone="soldout">Agotado</Badge>
          <Badge tone="lowstock">Pocas unidades</Badge>
          <Badge tone="neutral">Neutral</Badge>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Precios</h2>
        <div className="mt-4 space-y-2">
          <Price amount={74900} currency="COP" locale="es-CO" />
          <Price amount={74900} compareAt={89900} currency="COP" locale="es-CO" />
          <Price amount={54900} amountMax={74900} currency="COP" locale="es-CO" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Diálogo y panel</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Dialog trigger="Abrir diálogo" title="Aviso de ejemplo">
            Este diálogo se cierra con el botón o con Escape.
          </Dialog>
          <Sheet trigger="Abrir panel" title="Detalle">
            El panel entra desde la derecha, como un resumen del carrito.
          </Sheet>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Acordeón</h2>
        <div className="mt-4">
          <Accordion
            items={[
              { id: 'envios', title: '¿Cuánto tarda el envío?', text: 'Entre dos y cinco días hábiles en la ciudad.' },
              { id: 'cambios', title: '¿Puedo cambiar una talla?', text: 'Sí, si el pijama no se ha usado.' },
            ]}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Aviso</h2>
        <div className="mt-4">
          <ToastDemo />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Catálogo vacío</h2>
        <div className="mt-4">
          <ProductGrid products={[]} currency="COP" locale="es-CO" />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Tarjeta en oferta</h2>
        <div className="mt-4 max-w-xs">
          <ProductGrid products={[sample]} currency="COP" locale="es-CO" />
        </div>
      </section>
    </div>
  )
}
