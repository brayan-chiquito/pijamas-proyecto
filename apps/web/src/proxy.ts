import { NextResponse, type NextRequest } from 'next/server'

function contentSecurityPolicy(nonce: string) {
  const isDev = process.env.NODE_ENV === 'development'
  const analytics = process.env.NEXT_PUBLIC_GA_ID
    ? ' https://www.googletagmanager.com https://www.google-analytics.com'
    : ''
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}${analytics}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data:",
    "font-src 'self'",
    `connect-src 'self'${analytics}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ')
}

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const policy = contentSecurityPolicy(nonce)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set('Content-Security-Policy-Report-Only', policy)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy-Report-Only', policy)
  return response
}

export const config = {
  matcher: ['/((?!admin|api|_next/static|_next/image|favicon.ico).*)'],
}
