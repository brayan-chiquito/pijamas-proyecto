# Fase 8 — Panel administrativo y persistencia de datos

## Rol

Desarrollador backend senior especializado en Payload CMS y modelado de datos.

## Contexto

`AGENTS.md`, `docs/data-model.md`, `docs/security.md` (secciones 2–4), `docs/requirements.md` (RF-ADM, RF-CAT), `docs/decisions/007-modelo-variantes.md`, `docs/decisions/008-precios-enteros.md`, `apps/web/src/payload.config.ts`.

## Objetivo

Colecciones, globals, control de acceso, validaciones, hooks de revalidación, vista previa en vivo, plugin SEO, redirecciones y seed, con el panel íntegramente en español y comprensible para una persona no técnica.

## Tareas

1. Colecciones: `users` (roles), `media` (alt obligatorio, tamaños, MIME, 8 MB, focal point), `categories`, `collections`, `tags`, `products` (pestañas, `inventoryMode` condicional, options/variants con validación de combinaciones, imágenes ordenables, SEO, drafts con autosave, `publishedAt`), `pages` (drafts, slugs reservados), `faqs`.
2. Globals: `site-settings`, `navigation`, `home-page` (drafts + live preview), `size-guide`.
3. Campos reutilizables: `slugField` (autogenerado desde título, editable, único), `linkField`, campo de precio con descripción y vista previa formateada (componente de campo personalizado).
4. Control de acceso en `src/access` según la tabla de `docs/security.md`.
5. Hooks: `revalidateAfterChange`/`revalidateAfterDelete` por colección y global; `setPublishedAt`; aviso/redirección al cambiar slug publicado.
6. Plugins: `@payloadcms/plugin-seo` (con `generateTitle`/`generateDescription`), `@payloadcms/plugin-redirects`; `proxy.ts` que aplica redirecciones con caché.
7. Live preview configurado en productos, páginas y `home-page` (`admin.livePreview.url`).
8. Traducción del panel a español (`i18n` de Payload) y `labels`/`admin.description` en todos los campos.
9. Seed idempotente (`src/seed`) con imágenes de ejemplo generadas localmente.
10. Migraciones generadas y versionadas; `generate:types`.

## Restricciones

- Lectura pública solo de publicados; GraphQL deshabilitado.
- Validaciones en servidor con mensajes en español.
- No almacenar secretos en globals.
- Precios enteros (ADR-008).

## Archivos

`apps/web/src/collections/**`, `apps/web/src/globals/**`, `apps/web/src/fields/**`, `apps/web/src/access/**`, `apps/web/src/hooks/**`, `apps/web/src/seed/**`, `apps/web/src/migrations/**`, `apps/web/src/payload.config.ts`, `apps/web/src/proxy.ts`, `apps/web/src/payload-types.ts` (generado).

## Pruebas

Integración (Vitest + Local API con `overrideAccess: false`): acceso anónimo/editor/admin, validaciones (`salePrice`, slug duplicado, publicar sin imágenes, combinación de variante inválida), hooks de revalidación (mock de `revalidateTag`), seed idempotente.

## Criterios de aceptación

- Todos los requisitos RF-ADM y RF-CAT con prioridad M implementados.
- Panel en español, cada campo con etiqueta y descripción útil.
- Live preview funcional en producto y página de inicio.
- `pnpm test:integration` en verde; migración aplicable desde base vacía.

## Condiciones que impiden cerrar

- Algún borrador accesible sin autenticación.
- Editor capaz de cambiar roles o crear usuarios.
- Campos sin etiqueta en español.

## Resumen final

Lista de colecciones/globals, decisiones de UX del panel, instrucciones breves para la guía de administración (`docs/admin-guide.md`).
