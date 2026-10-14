# Fase 10 — Seguridad, accesibilidad y optimización del rendimiento

## Rol

Ingeniero senior de calidad web (seguridad aplicada, WCAG, Core Web Vitals).

## Contexto

`AGENTS.md`, `docs/security.md`, `docs/ux-ui.md` (sección 9), `docs/requirements.md` (RNF-PERF, RNF-A11Y, RNF-SEC), `apps/web/next.config.ts`.

## Objetivo

Cumplir los criterios de aceptación de seguridad, accesibilidad y rendimiento con evidencia reproducible.

## Tareas

### Seguridad

1. Cabeceras en `next.config.ts` (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` diferenciado para `/admin`).
2. CSP con nonce en `Report-Only`; documentar las fuentes permitidas (fuentes self-hosted, analítica configurada, Blob para imágenes).
3. Pruebas automatizadas de la lista de `docs/security.md` sección 10 (acceso anónimo, editor, borradores, subida de MIME no permitido).
4. `pnpm audit --prod --audit-level=high` en CI; actualizar dependencias con avisos (incluida la actualización de seguridad de Next.js anunciada para 2026-10-14).
5. Comprobar que ningún nombre de variable secreta aparece en `.next/static`.

### Accesibilidad

6. `@axe-core/playwright` en inicio, catálogo, producto, carrito, resumen; corregir violaciones.
7. Revisión por teclado de Sheet, Dialog, VariantSelector, Accordion, Pagination; foco visible y orden lógico.
8. `prefers-reduced-motion` verificado (emulación en Playwright).
9. Sesión manual con NVDA documentada (hallazgos y correcciones).

### Rendimiento

10. Lighthouse CI (`lighthouserc.json`) sobre build de producción con seed: inicio, categoría, producto; umbral 90 móvil.
11. Revisar `sizes` de imágenes, `priority` del LCP, fuentes con `display: swap` y preload, JS del cliente (`next build` first load ≤ 170 KB en producto), eliminar dependencias de cliente innecesarias.
12. Confirmar caché por etiquetas: una página cacheada no consulta la base de datos (logs de Payload en nivel debug durante la prueba).

## Restricciones

- No desactivar reglas de axe para "pasar"; corregir la causa.
- CSP primero en Report-Only; pasar a enforcement solo sin reportes en una semana de uso.

## Archivos

`apps/web/next.config.ts`, `apps/web/src/proxy.ts` (nonce), `apps/web/tests/e2e/a11y.spec.ts`, `apps/web/tests/integration/security.spec.ts`, `lighthouserc.json`, `.github/workflows/ci.yml`.

## Pruebas

Las descritas en tareas; todas automatizadas salvo NVDA.

## Criterios de aceptación

- Lista de `docs/security.md` sección 10 completa.
- axe sin violaciones críticas/serias en las 5 páginas.
- Lighthouse móvil ≥ 90 en las 3 páginas (adjuntar informe).
- First load JS de producto ≤ 170 KB.

## Condiciones que impiden cerrar

- Cualquier criterio con evidencia faltante o umbral no alcanzado sin plan aprobado.

## Resumen final

Tabla de métricas antes/después, hallazgos de accesibilidad corregidos, fuentes de la CSP, dependencias actualizadas.
