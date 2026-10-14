# Fase 9 — Implementación de SEO técnico

## Rol

Especialista en SEO técnico con experiencia en Next.js y datos estructurados de comercio.

## Contexto

`AGENTS.md`, `docs/seo.md`, `docs/navigation.md`, `apps/web/src/lib/seo/**` si existe, páginas de `(frontend)`.

## Objetivo

Metadata única y correcta, canonicals, `noindex` donde corresponde, JSON-LD válido (listado de comerciante), sitemap, robots, Open Graph y redirecciones, sin marcado engañoso.

## Tareas

1. `lib/seo/metadata.ts`: helper `buildMetadata({ title, description, path, image, noindex })` que compone título con sufijo del sitio, canonical absoluta desde `NEXT_PUBLIC_SERVER_URL`, OG y Twitter.
2. `lib/seo/jsonld.ts`: `productJsonLd` (Product + Offer/ProductGroup según variantes, precio decimal con punto, `priceCurrency`, `availability` real, `brand`, `image[]`, sin `review`/`aggregateRating`/`priceValidUntil`), `breadcrumbJsonLd`, `organizationJsonLd`, `webSiteJsonLd`, `faqJsonLd`.
3. `generateMetadata` en todas las páginas; `robots: { index: false }` en carrito, resumen, búsqueda, filtros; canonical de filtros a la base; paginación indexable.
4. `sitemap.ts` y `robots.ts`.
5. `opengraph-image.tsx` para producto, categoría y colección (imagen principal con fallback a la OG por defecto).
6. Verificación de Search Console por variable `NEXT_PUBLIC_GSC_VERIFICATION`.
7. Confirmar que `/productos/no-existe` devuelve HTTP 404 (`notFound()`).

## Restricciones

- No emitir propiedades sin datos reales.
- `priceCurrency` y locale desde `site-settings`.
- Un único JSON-LD por tipo por página; inyectado con `<script type="application/ld+json">` desde Server Components.

## Archivos

`apps/web/src/lib/seo/**`, `apps/web/src/app/(frontend)/sitemap.ts`, `robots.ts`, `**/opengraph-image.tsx`, páginas afectadas.

## Pruebas

- Unitarias: `productJsonLd` con/sin variantes, con promoción, agotado; `buildMetadata` canonical y noindex.
- E2E: `<link rel="canonical">` y `<meta name="robots">` en catálogo filtrado y paginado; JSON-LD parseable en producto; `sitemap.xml` incluye productos publicados y excluye borradores; 404 real.
- Manual: Rich Results Test en 3 productos del seed (documentar resultado en la respuesta).

## Criterios de aceptación

- Lista de comprobación de `docs/seo.md` sección 12 completa salvo los puntos que requieren producción (Search Console).
- Sin errores en Rich Results Test (advertencias documentadas y justificadas).

## Condiciones que impiden cerrar

- Datos estructurados con precio o disponibilidad distintos a los visibles en la página.
- Páginas de filtro indexables.

## Resumen final

Tabla ruta → title/description/canonical/robots/JSON-LD; advertencias de Rich Results y su justificación.
