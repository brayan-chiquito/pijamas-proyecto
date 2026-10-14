# Fase 12 — Preparación del despliegue, documentación y mantenimiento

## Rol

Ingeniero DevOps y redactor técnico.

## Contexto

`AGENTS.md`, `docs/deployment.md`, `docs/costs.md`, `docs/security.md` (sección 9), `README.md`, `apps/web/.env.example`, `apps/web/Dockerfile`.

## Objetivo

Producción desplegada (o lista para desplegar con datos de la propietaria), copias de seguridad automatizadas, documentación final y guía de administración.

## Tareas

1. Verificar `.env.example` contra las variables usadas en el código (`grep process.env`).
2. Workflow `backup.yml` (pg_dump semanal a almacenamiento privado) y script `export:media`.
3. Probar restauración en base vacía y documentar tiempos.
4. Construir y ejecutar el `Dockerfile` localmente (ruta de portabilidad).
5. Despliegue en Vercel Pro con Neon y Blob (si se dispone de cuentas); si no, dejar la lista de pasos verificada y marcar lo pendiente.
6. Redactar `docs/admin-guide.md` para la propietaria: iniciar sesión, crear producto con variantes, subir fotos y escribir `alt`, publicar/despublicar, editar inicio, menús, políticas, FAQ, configurar WhatsApp, actualizar existencias tras una venta, buenas prácticas de fotos y SEO, qué hacer si algo falla.
7. Actualizar `README.md`, `prompts/README.md` (estados) y `docs/deployment.md` con lo aprendido.
8. Lista de verificación de lanzamiento (`docs/deployment.md` sección 8) completada y firmada en la respuesta.

## Restricciones

- No ejecutar `seed` completo en producción (solo usuario admin).
- No incluir secretos en documentación.

## Archivos

`.github/workflows/backup.yml`, `apps/web/scripts/export-media.ts`, `docs/admin-guide.md`, `README.md`, `docs/deployment.md`, `prompts/README.md`.

## Pruebas

Restauración probada; `docker build` y `docker run` con `/` y `/admin` respondiendo 200; despliegue de vista previa en Vercel con `/admin` accesible.

## Criterios de aceptación

- Guía de administración comprensible por una persona no técnica (capturas o pasos numerados).
- Copia de seguridad ejecutada con éxito al menos una vez.
- Lista de lanzamiento completa o con pendientes explícitos atribuidos a la propietaria.

## Condiciones que impiden cerrar

- Variables usadas en código ausentes en `.env.example`.
- Restauración no probada.

## Resumen final

URL de producción o estado del despliegue, pendientes de la propietaria, calendario de mantenimiento, costos reales del primer mes si existen.
