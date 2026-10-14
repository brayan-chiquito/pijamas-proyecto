# Fase 3 — Creación del monorepo y configuración inicial

## Rol

Desarrollador senior TypeScript responsable de tooling y DX.

## Contexto

`AGENTS.md`, `docs/architecture.md` (secciones 9 y 12), `docs/project-structure.md`, `docs/deployment.md` (variables), `docs/decisions/005-monorepo-pnpm.md`.

## Objetivo

Repositorio ejecutable con pnpm workspaces, `@pijamas/domain` con pruebas, `apps/web` con Next.js 16 y Payload 3 arrancando contra Postgres local, calidad (TypeScript estricto, ESLint, Prettier) y CI.

## Tareas

1. Habilitar pnpm vía `corepack`; crear `pnpm-workspace.yaml`, `package.json` raíz con scripts (`dev`, `build`, `typecheck`, `lint`, `format`, `test`, `check`, `db:up`, `db:down`), `.npmrc`, `.gitignore`, `.editorconfig`, `.prettierrc`, `eslint.config.mjs`, `tsconfig.base.json`.
2. Crear `packages/domain` con `money.ts`, `pricing.ts`, `availability.ts`, `cart.ts`, `whatsapp.ts`, `slug.ts`, `schemas.ts`, pruebas Vitest y `exports` del paquete.
3. Generar `apps/web` con `create-payload-app` (plantilla `blank`, Postgres) y adaptarla: mover a `src/`, fijar versiones de `docs/architecture.md`, añadir Tailwind 4, `@pijamas/domain` como dependencia `workspace:*`, `.env.example`.
4. `docker-compose.yml` con Postgres 17 (bases `pijamas` y `pijamas_test`).
5. `.github/workflows/ci.yml` según `docs/testing.md` sección 6.
6. `Dockerfile` multi-stage con `output: 'standalone'`.

## Restricciones

- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`.
- TypeScript 5.9 (no 7) hasta que Payload y Next lo soporten oficialmente.
- No crear paquetes sin consumidor real.
- No subir `.env`.

## Archivos

Los indicados en `docs/project-structure.md`. No tocar `docs/` salvo correcciones.

## Pruebas

- `pnpm install` sin advertencias de peer dependencies críticas.
- `pnpm typecheck`, `pnpm lint`, `pnpm test` en verde.
- `pnpm db:up && pnpm --filter web dev` arranca y `/admin` carga la pantalla de primer usuario.
- `docker build -f apps/web/Dockerfile .` construye (si Docker está disponible; si no, indicarlo).

## Criterios de aceptación

- Estructura idéntica a `docs/project-structure.md` (sin carpetas vacías).
- `@pijamas/domain` con cobertura ≥ 90 % en sus módulos.
- `payload-types.ts` generado y versionado.
- CI definido y válido (`actionlint` o revisión manual).

## Condiciones que impiden cerrar

- Cualquier comando de calidad en rojo.
- Dependencias con versiones distintas a las fijadas sin ADR que lo justifique.

## Resumen final

Comandos disponibles, versiones instaladas, diferencias respecto a la estructura prevista y motivo.
