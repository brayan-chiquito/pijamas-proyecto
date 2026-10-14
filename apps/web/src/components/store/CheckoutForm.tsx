'use client'

import { useState } from 'react'
import { formatPrice } from '@pijamas/domain'

import { prepareWhatsAppOrder } from '@/actions/order'
import { useCart, useCartTotals } from '@/lib/cart/store'

export function CheckoutForm({ currency, locale }: { currency: string; locale: string }) {
  const lines = useCart((state) => state.lines)
  const clear = useCart((state) => state.clear)
  const totals = useCartTotals()
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    try {
      const result = await prepareWhatsAppOrder(
        {
          name: String(formData.get('name') ?? ''),
          city: String(formData.get('city') ?? ''),
          note: String(formData.get('note') ?? ''),
        },
        lines.map((line) => ({
          productId: line.productId,
          variantId: line.variantId,
          quantity: line.quantity,
        })),
      )
      if (!result.ok) {
        setError(result.error)
        return
      }
      setUrl(result.url)
      window.open(result.url, '_blank', 'noopener,noreferrer')
    } catch (cause) {
      console.error('No se pudo preparar el pedido de WhatsApp', cause)
      setError('No pudimos preparar el pedido. Inténtalo de nuevo.')
    } finally {
      setPending(false)
    }
  }

  if (lines.length === 0 && !url) {
    return <p className="mt-6">El carrito está vacío.</p>
  }

  if (url) {
    return (
      <div className="mt-8 rounded-lg bg-cream-100 p-6">
        <h2 className="font-display text-2xl">Pedido preparado</h2>
        <p className="mt-3 max-w-prose text-ink-600">
          Se abrió WhatsApp con tu pedido listo para enviar. La disponibilidad y el total se confirman en la conversación.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-md bg-plum-700 px-5 text-sm font-semibold text-white">
            Abrir WhatsApp de nuevo
          </a>
          <button type="button" className="min-h-11 px-4 text-sm" onClick={() => clear()}>
            Vaciar carrito
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={onSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
      <div className="space-y-4">
        <label className="block text-sm font-semibold">
          Nombre
          <input name="name" required minLength={2} className="mt-1 min-h-11 w-full rounded-sm border border-cream-200 px-3" />
        </label>
        <label className="block text-sm font-semibold">
          Ciudad o zona
          <input name="city" className="mt-1 min-h-11 w-full rounded-sm border border-cream-200 px-3" />
        </label>
        <label className="block text-sm font-semibold">
          Nota
          <textarea name="note" maxLength={500} className="mt-1 min-h-24 w-full rounded-sm border border-cream-200 px-3 py-2" />
        </label>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <p className="text-sm text-ink-600">
          Al continuar se abrirá WhatsApp con tu pedido listo para enviar. La disponibilidad y el total se confirman en la conversación.
        </p>
        <button type="submit" disabled={pending} className="min-h-11 rounded-md bg-plum-700 px-5 text-sm font-semibold text-white disabled:opacity-50">
          {pending ? 'Preparando…' : 'Enviar pedido por WhatsApp'}
        </button>
      </div>
      <aside className="h-fit rounded-md bg-cream-100 p-5">
        <ul className="space-y-2 text-sm">
          {lines.map((line) => (
            <li key={line.id}>
              {line.quantity} × {line.title}
              {line.variantLabel ? ` (${line.variantLabel})` : ''}
            </li>
          ))}
        </ul>
        <p className="mt-4 font-display text-2xl">{formatPrice(totals.subtotal, currency, locale)}</p>
      </aside>
    </form>
  )
}
