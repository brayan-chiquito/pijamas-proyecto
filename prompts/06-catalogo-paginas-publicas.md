# Fase 6 — Desarrollo del catálogo y las páginas públicas

## Rol

Desarrollador Full Stack senior (Next.js App Router + Payload Local API).

## Contexto

`AGENTS.md`, `docs/navigation.md`, `docs/data-model.md`, `docs/ux-ui.md`, `docs/seo.md` (secciones 1, 2 y 9 para canonicals/noindex de filtros), código de `components/ui` y colecciones de Payload existentes.

## Objetivo

Tienda pública navegable con datos reales del panel: inicio, catálogo con filtros, categorías, colecciones, producto, búsqueda, páginas institucionales, FAQ, contacto, 404 y estados vacíos.

## Tareas

1. `lib/catalog/`: consultas tipadas con `"use cache"` + `cacheTag` (`queries.ts`), mapeadores a tipos de dominio (`mappers.ts`), etiquetas (`tags.ts`), parseo de `searchParams` con Zod.
2. Componentes `components/store/`: ProductCard, ProductGrid, ProductGallery, VariantSelector, PriceBlock, AvailabilityBadge, Filters (desktop lateral y Sheet móvil), SortSelect, Breadcrumbs de catálogo, RelatedProducts, SizeGuideSheet.
3. Páginas: `/`, `/productos`, `/productos/[slug]`, `/categorias/[slug]`, `/colecciones/[slug]`, `/buscar`, `/[slug]`, `/preguntas-frecuentes`, `/contacto`, `not-found.tsx`, `error.tsx`, `loading.tsx` con skeletons.
4. Serializador Lexical → React (`components/richtext`) con encabezados, listas, enlaces seguros, imágenes.
5. Vista previa: `draftMode()` y rutas `/next/preview`, `/next/exit-preview`.
6. Paginación con enlaces reales; filtros reflejados en la URL.

## Restricciones

- Datos solo vía Local API en Server Components; nunca `fetch` a `/api` desde el servidor.
- `next/image` con `sizes`; `priority` solo en LCP.
- Un h1 por página; migas de pan en producto y categoría.
- Variantes agotadas visibles y deshabilitadas; botón agregar deshabilitado si no hay disponibilidad.
- Slugs reservados protegidos en `/[slug]`.

## Archivos

`apps/web/src/app/(frontend)/**`, `apps/web/src/components/store/**`, `apps/web/src/components/richtext/**`, `apps/web/src/lib/catalog/**`, `apps/web/src/app/next/**`.

## Pruebas

- Unitarias: mapeadores y parseo de `searchParams`.
- Integración: consultas de catálogo contra Postgres con seed (filtro por talla, orden por precio, exclusión de borradores).
- E2E: navegación inicio → categoría → producto; filtros; 404; vista previa de borrador con cookie.

## Criterios de aceptación

- Con el seed cargado, todas las páginas renderizan sin errores de consola.
- Filtros y orden funcionan combinados y se reflejan en la URL.
- Estado vacío en catálogo sin resultados y en búsqueda.
- Borradores invisibles sin cookie de vista previa.
- `pnpm check` en verde; `next build` sin advertencias de rutas dinámicas sin caché.

## Condiciones que impiden cerrar

- Alguna página con consulta a base de datos no cacheada en la ruta crítica.
- Variantes seleccionables cuando están agotadas.

## Resumen final

Rutas implementadas, estrategia de caché por ruta, pendientes de contenido para la propietaria.
