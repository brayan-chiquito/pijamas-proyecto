import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { getPayloadClient } from '@/lib/payload'

export async function GET(request: Request): Promise<Response> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Debes iniciar sesión para ver el borrador.', { status: 401 })
  }
  const path = new URL(request.url).searchParams.get('path') || '/'
  const draft = await draftMode()
  draft.enable()
  redirect(path.startsWith('/') ? path : '/')
}
