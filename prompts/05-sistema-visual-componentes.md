# Fase 5 — Implementación del sistema visual y los componentes compartidos

## Rol

Desarrollador frontend senior especializado en React, Tailwind y accesibilidad.

## Contexto

`AGENTS.md`, `docs/ux-ui.md`, `design/README.md` (y `design/pijamas.pen` si existe, consultando `get_style`), `docs/project-structure.md`.

## Objetivo

Tokens en Tailwind 4, fuentes, layout base y la biblioteca `components/ui` con todas las variantes y estados, visibles en `/dev/ui`.

## Tareas

1. `src/styles/tokens.css` con `@theme` (colores, radios, sombras, fuentes) y `globals.css` (base, foco visible, `prefers-reduced-motion`).
2. Fuentes con `next/font/google` (Fraunces, Nunito Sans) expuestas como variables CSS.
3. Componentes `ui/`: Button, Badge, Price, Input, Textarea, Select, Checkbox, QuantityInput, Sheet, Dialog, Accordion, Toast, Breadcrumbs, Skeleton, EmptyState, Pagination, Container, Section, VisuallyHidden.
4. Layout: `Header` (logo, nav, búsqueda, carrito con contador), `Footer`, `AnnouncementBar`, `SkipLink`, `WhatsAppButton`.
5. Ruta `/dev/ui` (solo `NODE_ENV !== 'production'`, devuelve 404 en producción) con todas las variantes y estados.
6. Pruebas de componentes con Testing Library para QuantityInput, Price, Button (loading/disabled), Accordion (teclado).

## Restricciones

- Solo tokens; sin valores arbitrarios de color.
- Primitivas accesibles de `radix-ui` para Sheet, Dialog, Accordion, Toast.
- Animaciones con `motion-safe:` y solo `transform`/`opacity`.
- Botones y controles de 44 px mínimo.
- `components/ui` sin dependencias de Payload ni del carrito.

## Archivos

`apps/web/src/styles/*`, `apps/web/src/components/ui/*`, `apps/web/src/components/layout/*`, `apps/web/src/app/(frontend)/dev/ui/page.tsx`, pruebas `*.test.tsx`.

## Pruebas

`pnpm check`; captura de `/dev/ui` en 390 y 1440 px con Playwright; axe sobre `/dev/ui` sin violaciones críticas/serias.

## Criterios de aceptación

- Todos los componentes de la tabla de `docs/ux-ui.md` sección 5 implementados con sus estados.
- Contraste verificado por script sobre `tokens.css` (reutilizar la fórmula WCAG).
- Navegación por teclado completa en Sheet, Dialog, Accordion.

## Condiciones que impiden cerrar

- Algún componente sin estado de error/deshabilitado/cargando cuando aplica.
- Colores fuera de tokens.

## Resumen final

Lista de componentes, props públicas, decisiones de accesibilidad, diferencias respecto al diseño.
