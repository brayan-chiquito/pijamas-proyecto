# AGENTS.md — Reglas del proyecto para agentes de Cursor

## Antes de modificar archivos

1. Lee `docs/architecture.md`, `docs/requirements.md` y el ADR relevante en `docs/decisions/`. Las decisiones aceptadas no se cambian sin un ADR nuevo.
2. Inspecciona el código existente en el área que vas a tocar. No reescribas archivos completos si basta una edición.
3. Si una ambigüedad puede cambiar la arquitectura o el comportamiento comercial (precios, disponibilidad, mensaje de WhatsApp, SEO), detente y pregunta. El resto de decisiones de implementación, tómalas y documéntalas.

## Idioma

- Documentación, textos de la interfaz, etiquetas del panel y mensajes de validación: **español**.
- Código (identificadores, slugs de colección, nombres de archivo): **inglés**.
- Commits: Conventional Commits en inglés o español, consistentes dentro del repositorio (se usa español en el cuerpo si aporta claridad).

## Arquitectura (resumen operativo)

- Monorepo pnpm: `apps/web` (Next.js 16 + Payload 3) y `packages/domain` (`@pijamas/domain`, lógica pura con Zod).
- `packages/domain` no importa React, Next ni Payload.
- La tienda consulta Payload solo con la Local API en Server Components (`src/lib/catalog`), con `unstable_cache` y etiquetas (`src/lib/catalog/tags.ts`). Revalidación desde hooks con `revalidateTag(tag, { expire: 0 })` y `revalidatePath` (Next 16 exige el segundo argumento). No activar `cacheComponents` sin ADR. Nunca `fetch` a `/api` desde el servidor.
- Los componentes de `components/ui` no conocen Payload ni el carrito. Los de `components/store` reciben tipos de dominio mapeados en `lib/catalog/mappers.ts`.
- Precios en enteros (unidad menor). Formato solo en la capa de presentación con `formatPrice`.
- El mensaje y la URL de WhatsApp se construyen en `@pijamas/domain` y se invocan desde una Server Action que reconfirma precios en base de datos.

## Payload

- Cada colección/global vive en su archivo bajo `src/collections` o `src/globals`, con `labels` y `admin.description` en español.
- Control de acceso en `src/access`; lectura pública solo de publicados.
- Tras cambiar campos: `pnpm --filter web generate:types` y `pnpm --filter web payload migrate:create`. Versiona la migración.
- No uses `push` de esquema en producción.
- Hooks `afterChange`/`afterDelete` revalidan etiquetas (`revalidateTag`) — mantén la lista de etiquetas en `src/lib/catalog/tags.ts`.

## Frontend

- Tailwind 4 con tokens en `src/styles/tokens.css`. Prohibido usar colores fuera de tokens o valores arbitrarios salvo justificación en comentario.
- Mobile-first. Estados cargando/vacío/error/éxito obligatorios en cada vista con datos.
- Animaciones solo con `transform`/`opacity`, envueltas en `motion-safe:`.
- Accesibilidad: HTML semántico, un h1 por página, foco visible, `alt` real, controles de 44 px.
- Imágenes con `next/image`, `sizes` explícito, `priority` solo en LCP.
- Metadata con `generateMetadata`; JSON-LD con helpers de `src/lib/seo`. No emitas datos (reseñas, valoraciones, fechas) que no existan.

## Calidad

- Antes de dar una tarea por terminada: `pnpm check` (typecheck + lint + test) en verde. Si tocaste Payload, también `pnpm test:integration`. Si tocaste flujos de tienda, `pnpm test:e2e` del flujo afectado.
- No marques pruebas con `.skip` sin comentario que explique por qué y cuándo se retira.
- No afirmes haber ejecutado algo que no ejecutaste. Si no pudiste ejecutar (por ejemplo, sin base de datos), dilo explícitamente.
- Errores: añade contexto al relanzar; nunca `throw err` sin mensaje; nunca tragues errores en silencio.
- Validación en los límites (Server Actions, `searchParams`, campos de Payload) con Zod o validadores de Payload; no dentro de la lógica de dominio.

## Seguridad

- Secretos solo en variables de entorno; `apps/web/.env.example` es el contrato. Nunca escribas valores reales en el repositorio.
- No expongas `payload-types` de usuarios ni campos sensibles en respuestas públicas.
- Enlaces externos con `rel="noopener noreferrer"`.

## Documentación

- Si cambias una decisión, actualiza el ADR o crea uno nuevo.
- Si añades una variable de entorno, actualiza `.env.example` y `docs/deployment.md`.
- Al terminar una fase, actualiza `prompts/README.md` (estado) y deja un resumen de decisiones, cambios y pendientes en la respuesta.

## Archivos que no se editan a mano

- `apps/web/src/payload-types.ts` (generado)
- `apps/web/src/app/(payload)/admin/importMap.js` (generado)
- `design/*.pen` (editar solo con la extensión pen.dev)
- `pnpm-lock.yaml` (solo mediante pnpm)
