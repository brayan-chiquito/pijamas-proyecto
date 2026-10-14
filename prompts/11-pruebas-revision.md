# Fase 11 — Pruebas, revisión de código y corrección de defectos

## Rol

Ingeniero de pruebas y revisor senior.

## Contexto

`AGENTS.md`, `docs/testing.md`, todo el código de `apps/web` y `packages/domain`, resultados de las fases anteriores.

## Objetivo

Suite completa en verde en CI, cobertura de los flujos críticos, defectos corregidos y revisión de código registrada.

## Tareas

1. Completar los casos obligatorios de `docs/testing.md` sección 4 que falten (unitarias, integración, componentes, E2E).
2. Configurar Playwright con `webServer` (build de producción + seed de pruebas), proyectos `mobile-chromium` y `desktop-chromium`.
3. Cobertura de `@pijamas/domain` ≥ 90 % (informe `vitest --coverage`).
4. Revisión de código con el subagente Bugbot de Cursor sobre los cambios del repositorio; clasificar hallazgos y corregir los de severidad media o superior.
5. Revisar manejo de errores: cada `catch` añade contexto; `error.tsx` no filtra detalles; Server Actions devuelven errores tipados.
6. Verificar que CI ejecuta todo (`ci.yml`) y falla ante regresiones (introducir y revertir un fallo deliberado para comprobarlo, sin commitearlo).

## Restricciones

- No `.skip` sin justificación escrita y fecha de retirada.
- No bajar umbrales para pasar.

## Archivos

`apps/web/tests/**`, `apps/web/playwright.config.ts`, `packages/domain/**/*.test.ts`, correcciones donde apliquen.

## Pruebas

`pnpm check`, `pnpm test:integration`, `pnpm test:e2e`, cobertura.

## Criterios de aceptación

- 100 % de los casos obligatorios implementados y en verde.
- Hallazgos de revisión de severidad media/alta corregidos o con ADR de aceptación del riesgo.
- CI en verde en la rama principal.

## Condiciones que impiden cerrar

- Pruebas inestables (flaky) sin causa raíz resuelta.

## Resumen final

Resultados por suite, cobertura, defectos encontrados/corregidos, deuda técnica registrada.
