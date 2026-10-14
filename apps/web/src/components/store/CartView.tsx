'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatPrice } from '@pijamas/domain'

import { revalidateCart } from '@/actions/order'
import { useCart, useCartTotals } from '@/lib/cart/store'

export function CartView({ currency, locale }: { currency: string; locale: string }) {
  const lines = useCart((state) => state.lines)
  const hydrated = useCart((state) => state.hydrated)
  const update = useCart((state) => state.update)
  const remove = useCart((state) => state.remove)
  const replace = useCart((state) => state.replace)
  const totals = useCartTotals()
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (!hydrated) return
    const current = useCart.getState().lines
    if (current.length === 0) return
    let cancelled = false
    revalidateCart(
      current.map((line) => ({
        productId: line.productId,
        variantId: line.variantId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
      })),
    )
      .then((results) => {
        if (cancelled) return
        const changed = results.some((result) => result.status !== 'ok')
        if (!changed) return
        const next = current.flatMap((line) => {
          const result = results.find((item) => item.id === line.id)
          return result?.line ? [result.line] : result ? [] : [line]
        })
        replace(next)
        setNotice('Actualizamos el carrito: algún precio, cantidad o disponibilidad cambió.')
      })
      .catch((error: unknown) => {
        console.error('No se pudo revalidar el carrito', error)
      })
    return () => {
      cancelled = true
    }
  }, [hydrated, replace])

  if (!hydrated) return <p className="mt-6 text-ink-600">Cargando carrito…</p>
  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-lg bg-cream-100 px-6 py-16 text-center">
        <h2 className="font-display text-2xl">Tu carrito está vacío</h2>
        <Link href="/productos" className="mt-6 inline-flex min-h-11 items-center font-semibold text-plum-700">
          Ver pijamas
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li key={line.id} className="flex items-center justify-between gap-4 rounded-md bg-white p-4 shadow-card">
            <div>
              <p className="font-semibold">{line.title}</p>
              {line.variantLabel ? <p className="text-sm text-ink-600">{line.variantLabel}</p> : null}
              <p className="text-sm">{formatPrice(line.unitPrice, currency, locale)}</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                aria-label={`Cantidad de ${line.title}`}
                type="number"
                min={1}
                max={line.maxQuantity ?? 99}
                value={line.quantity}
                onChange={(event) => update(line.id, Number(event.target.value))}
                className="min-h-11 w-16 rounded-sm border border-cream-200 px-2"
              />
              <button type="button" className="min-h-11 text-sm text-red-600" onClick={() => remove(line.id)}>
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <aside className="h-fit rounded-md bg-cream-100 p-5">
        {notice ? (
          <p role="status" className="mb-3 text-sm text-amber-700">
            {notice}
          </p>
        ) : null}
        <p className="text-sm text-ink-600">Total estimado</p>
        <p className="font-display text-3xl">{formatPrice(totals.subtotal, currency, locale)}</p>
        <Link href="/finalizar-pedido" className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-plum-700 text-sm font-semibold text-white">
          Finalizar pedido
        </Link>
      </aside>
    </div>
  )
}
