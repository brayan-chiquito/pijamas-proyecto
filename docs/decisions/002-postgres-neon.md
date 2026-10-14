# ADR-002: PostgreSQL con Neon en producción y Docker en local

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

Payload soporta MongoDB, PostgreSQL y SQLite. El catálogo tiene relaciones (categorías, colecciones, etiquetas, variantes) y se necesita un plan gratuito permanente sin pausas por inactividad.

## Decisión

PostgreSQL con `@payloadcms/db-postgres`. Producción en Neon (plan Free verificado: 1 GB, 100 CU-horas/mes, escala a cero). Local y CI con Postgres 17 en Docker. Migraciones versionadas generadas por Payload; nunca `push` de esquema en producción.

## Alternativas

- Supabase: pausa proyectos inactivos en el plan gratuito.
- Cloudflare D1 (SQLite): requiere OpenNext y Workers de pago por tamaño del bundle de Payload; plantilla oficial desactualizada.
- MongoDB Atlas M0: válido, pero el modelo relacional encaja mejor con filtros por variantes y consultas de catálogo.
- SQLite local + Turso: tercer proveedor y divergencia entre entornos.

## Consecuencias

- Mismo motor en todos los entornos → migraciones fiables.
- Riesgo: suspensión de cómputo si se agotan las CU-horas mensuales del plan Free. Mitigación: ISR, alertas de uso, upgrade a Launch (pago por uso) documentado.
- Copias de seguridad propias (`pg_dump` semanal) porque el historial del plan Free es de 6 horas.
