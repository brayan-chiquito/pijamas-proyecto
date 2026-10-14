import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl">No encontramos esa página</h1>
      <p className="mt-3 text-ink-600">Puede que el producto ya no esté publicado.</p>
      <Link href="/productos" className="mt-6 inline-flex min-h-11 items-center font-semibold text-plum-700">
        Ir al catálogo
      </Link>
    </div>
  )
}
