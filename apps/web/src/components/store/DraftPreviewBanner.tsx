/** Aviso visible solo con el modo borrador activo (vista previa del panel). */
export function DraftPreviewBanner() {
  return (
    <div
      role="status"
      className="border-b border-amber-700/20 bg-amber-700 px-4 py-2 text-center text-sm text-white"
    >
      Estás viendo un borrador. Los visitantes de la tienda aún no ven estos cambios.{' '}
      <a href="/next/exit-preview" className="underline underline-offset-2">
        Salir de la vista previa
      </a>
    </div>
  )
}
