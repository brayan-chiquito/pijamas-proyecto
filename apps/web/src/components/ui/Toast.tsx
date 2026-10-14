'use client'

import { useState } from 'react'

export function ToastDemo() {
  const [message, setMessage] = useState<string | null>(null)

  return (
    <div>
      <button
        type="button"
        className="inline-flex min-h-11 items-center rounded-md bg-plum-700 px-5 text-sm font-semibold text-white"
        onClick={() => setMessage('El pedido se preparó. Revisa WhatsApp.')}
      >
        Mostrar aviso
      </button>
      {message ? (
        <p role="status" className="mt-4 rounded-md bg-cream-100 px-4 py-3 text-sm">
          {message}
        </p>
      ) : null}
    </div>
  )
}
