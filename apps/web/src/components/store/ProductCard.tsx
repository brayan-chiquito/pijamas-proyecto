import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { Price } from '@/components/ui/Price'
import type { ProductSummary } from '@/lib/catalog/types'

export function ProductCard({
  product,
  currency,
  locale,
}: {
  product: ProductSummary
  currency: string
  locale: string
}) {
  return (
    <article className="group">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-cream-100 shadow-card motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover:-translate-y-0.5">
          {product.image ? (
            <Image
              src={product.image.url}
              alt={product.image.alt}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className={`object-cover ${product.hoverImage ? 'motion-safe:transition-opacity motion-safe:duration-200 group-hover:opacity-0' : ''}`}
            />
          ) : null}
          {product.hoverImage ? (
            <Image
              src={product.hoverImage.url}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover opacity-0 motion-safe:transition-opacity motion-safe:duration-200 group-hover:opacity-100"
            />
          ) : null}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.compareAtPrice ? <Badge tone="sale">Oferta</Badge> : null}
            {product.availability === 'out_of_stock' ? <Badge tone="soldout">Agotado</Badge> : null}
          </div>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug">{product.title}</h3>
        <Price
          amount={product.price}
          compareAt={product.compareAtPrice}
          amountMax={product.priceMax}
          currency={currency}
          locale={locale}
        />
      </Link>
    </article>
  )
}

export function ProductGrid({
  products,
  currency,
  locale,
}: {
  products: ProductSummary[]
  currency: string
  locale: string
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg bg-cream-100 px-6 py-16 text-center">
        <h2 className="font-display text-2xl">No hay productos con esos filtros</h2>
        <p className="mt-2 text-ink-600">Prueba con otra talla, color o precio.</p>
        <Link href="/productos" className="mt-6 inline-flex min-h-11 items-center font-semibold text-plum-700">
          Quitar filtros
        </Link>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} currency={currency} locale={locale} />
      ))}
    </div>
  )
}
