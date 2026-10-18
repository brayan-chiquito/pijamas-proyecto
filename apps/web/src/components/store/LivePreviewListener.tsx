'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

/**
 * Cuando el panel abre la vista previa, cada autosave/publicación
 * refresca esta página para mostrar el borrador sin salir del admin.
 */
export function LivePreviewListener() {
  const router = useRouter()
  const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <RefreshRouteOnSave
      refresh={() => {
        router.refresh()
      }}
      serverURL={serverURL}
    />
  )
}
