import type { Metadata } from 'next'
import { Fraunces, Nunito_Sans } from 'next/font/google'
import React from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getNavigation, getSettings } from '@/lib/catalog/queries'
import { organizationJsonLd, JsonLd } from '@/lib/seo'

import '@/styles/globals.css'

const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const nunito = Nunito_Sans({ subsets: ['latin'], variable: '--font-nunito' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const verification = process.env.NEXT_PUBLIC_GSC_VERIFICATION
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
    title: {
      default: settings.siteName,
      template: `%s · ${settings.defaultTitleSuffix || settings.siteName}`,
    },
    description: settings.defaultDescription,
    verification: verification ? { google: verification } : undefined,
  }
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const [settings, navigation] = await Promise.all([getSettings(), getNavigation()])
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${fraunces.variable} ${nunito.variable}`}>
      <body>
        <SiteHeader
          siteName={settings.siteName}
          links={navigation.header}
          announcement={
            settings.announcementEnabled && settings.announcementText
              ? { text: settings.announcementText, href: settings.announcementLink }
              : null
          }
        />
        <main id="contenido">{children}</main>
        <SiteFooter settings={settings} navigation={navigation} />
        {settings.floatingButton && settings.whatsappEnabled ? (
          <a
            href={`https://wa.me/${settings.whatsappPhone}`}
            className="fixed right-4 bottom-4 inline-flex min-h-11 items-center rounded-full bg-sage-600 px-4 text-sm font-semibold text-white motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:hover:-translate-y-0.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        ) : null}
        <JsonLd data={organizationJsonLd(settings, serverUrl)} />
      </body>
    </html>
  )
}
