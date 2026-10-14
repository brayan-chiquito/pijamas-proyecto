# ADR-005: Monorepo mínimo con pnpm workspaces

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

Payload vive dentro de Next.js, así que no hay backend separado. El brief pide evaluar un monorepo y evitar paquetes vacíos.

## Decisión

pnpm workspaces con dos paquetes: `apps/web` (Next.js + Payload) y `packages/domain` (lógica de negocio pura con Zod, sin React/Next/Payload). Sin Turborepo ni Nx.

## Justificación

- La lógica de carrito, precios, disponibilidad y mensaje de WhatsApp es testeable en milisegundos y reutilizable (p. ej. futura colección de pedidos, app móvil o worker).
- Dos paquetes no justifican una herramienta de orquestación; `pnpm -r` y filtros bastan.
- pnpm es el gestor preferido por Payload y se habilita con `corepack` sin instalación global.

## Consecuencias

- Se añadirá un paquete solo cuando tenga consumidor real (p. ej. `packages/ui` únicamente si aparece una segunda app).
- Configuración compartida (TypeScript, ESLint, Prettier) en la raíz, no en paquetes `config-*`.
