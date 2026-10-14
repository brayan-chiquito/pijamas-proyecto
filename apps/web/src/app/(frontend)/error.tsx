'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-display text-4xl">Algo salió mal</h1>
      <p className="mt-3 text-ink-600">No pudimos cargar esta página. Inténtalo otra vez.</p>
      <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-md bg-plum-700 px-5 text-sm font-semibold text-white">
        Reintentar
      </button>
    </div>
  )
}
