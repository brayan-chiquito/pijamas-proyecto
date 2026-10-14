'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

import { useCartItemCount } from '@/lib/cart/store'
import type { StoreNavLink } from '@/lib/catalog/types'

export function SiteHeader({
  siteName,
  links,
  announcement,
}: {
  siteName: string
  links: StoreNavLink[]
  announcement: { text: string; href: string | null } | null
}) {
  const [open, setOpen] = useState(true)
  const [menu, setMenu] = useState(false)
  const itemCount = useCartItemCount()

  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
        Saltar al contenido
      </a>
      {announcement && open ? (
        <div className="bg-plum-700 px-4 py-2 text-center text-sm text-white">
          {announcement.href ? (
            <Link href={announcement.href} className="underline">
              {announcement.text}
            </Link>
          ) : (
            announcement.text
          )}
          <button type="button" className="ml-3 min-h-11 underline" onClick={() => setOpen(false)}>
            Cerrar
          </button>
        </div>
      ) : null}
      <header className="sticky top-0 z-20 border-b border-cream-200 bg-cream-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 lg:px-8">
          <button type="button" className="min-h-11 lg:hidden" onClick={() => setMenu((value) => !value)}>
            Menú
          </button>
          <Link href="/" className="font-display text-2xl">
            {siteName}
          </Link>
          <nav aria-label="Principal" className="hidden gap-6 lg:flex">
            {links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className="text-sm font-medium motion-safe:transition-opacity motion-safe:duration-200 motion-safe:hover:opacity-70"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link href="/carrito" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
            <ShoppingBag aria-hidden className="size-5" />
            Carrito
            <span key={itemCount} className={`rounded-full bg-plum-100 px-2 ${itemCount > 0 ? 'cart-count-pop' : ''}`}>
              {itemCount}
            </span>
          </Link>
        </div>
        {menu ? (
          <nav aria-label="Móvil" className="flex flex-col border-t border-cream-200 px-4 py-2 lg:hidden">
            {links.map((link) => (
              <Link key={link.url} href={link.url} className="min-h-11 py-2" onClick={() => setMenu(false)}>
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>
    </>
  )
}
