# Fase 2 — Investigación tecnológica y definición de arquitectura

## Rol

Arquitecto de software senior Full Stack con criterio de costos y operación para negocios pequeños.

## Contexto

`AGENTS.md`, `docs/brief.md` (sección 3), `docs/requirements.md`.

## Objetivo

Comparar alternativas vigentes y fijar la arquitectura con justificación, versiones verificadas y costos distinguidos entre verificados y estimados.

## Tareas

1. Con acceso a Internet, verificar en documentación oficial y npm: versión estable de Next.js, Payload, Tailwind, TypeScript, Vitest, Playwright; planes y límites de Vercel (incluida la restricción de uso comercial del plan Hobby), Neon, Vercel Blob, Sanity; formato oficial de enlaces `wa.me`; requisitos de datos estructurados `Product` para listados de comerciante.
2. Comparar frameworks (Next.js, Astro, otros), CMS (Payload, Sanity, Strapi, Decap, Shopify), bases de datos, almacenamiento de imágenes, hosting (Vercel Pro, Cloudflare, contenedor, VPS), integración con WhatsApp y analítica.
3. Evaluar si conviene monorepo y qué paquetes tendrían consumidor real.
4. Redactar `docs/architecture.md`, los ADR en `docs/decisions/` y `docs/costs.md`.
5. Definir el modelo de datos (`docs/data-model.md`) y el mapa de navegación (`docs/navigation.md`).

## Restricciones

- No inventar precios, límites ni funcionalidades. Marcar **verificado** o **estimación** con fecha.
- No elegir por popularidad; justificar con los 10 criterios del brief.
- Fijar versiones exactas que existan en npm el día de la consulta.

## Archivos

`docs/architecture.md`, `docs/decisions/*.md`, `docs/costs.md`, `docs/data-model.md`, `docs/navigation.md`, `docs/project-structure.md`.

## Pruebas

`npm view <paquete> version` para cada dependencia fijada; comprobar que las versiones del documento coinciden.

## Criterios de aceptación

- Tabla comparativa por capa con ventajas, desventajas, límites y costo.
- Decisión final por capa con motivo.
- ADR para cada decisión estructural.
- Costos recurrentes en tres escenarios con supuestos explícitos.
- Modelo de datos con relaciones, reglas de validación y campos derivados.

## Condiciones que impiden cerrar

- Alguna cifra de precio o límite sin marca de verificación/estimación.
- Elegir un hosting gratuito cuyos términos prohíban uso comercial.

## Resumen final

Arquitectura elegida en una tabla, riesgos de dependencia de proveedor y plan de migración, versiones fijadas.
