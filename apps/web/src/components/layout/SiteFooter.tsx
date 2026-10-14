import Link from 'next/link'

import type { StoreNavigation, StoreSettings } from '@/lib/catalog/types'

export function SiteFooter({
  settings,
  navigation,
}: {
  settings: StoreSettings
  navigation: StoreNavigation
}) {
  return (
    <footer className="mt-16 border-t border-cream-200 bg-cream-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4 lg:px-8">
        <div>
          <p className="font-display text-2xl">{settings.siteName}</p>
          <p className="mt-2 text-sm text-ink-600">{settings.tagline}</p>
          {settings.email ? (
            <a className="mt-3 block text-sm" href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          ) : null}
        </div>
        {navigation.footerColumns.map((column) => (
          <div key={column.title}>
            <p className="text-sm font-semibold">{column.title}</p>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className="text-sm text-ink-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="text-sm font-semibold">Redes</p>
          <ul className="mt-3 space-y-2">
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a href={link.url} className="text-sm text-ink-600" target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="px-4 pb-8 text-center text-xs text-ink-600">
        {navigation.footerText || settings.siteName}
      </p>
    </footer>
  )
}
