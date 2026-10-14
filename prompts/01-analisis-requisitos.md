# Fase 1 — Análisis de requisitos, riesgos y decisiones pendientes

## Rol

Analista funcional y arquitecto de software con experiencia en comercio electrónico pequeño y mediano.

## Contexto

Lee en este orden: `AGENTS.md`, `docs/brief.md` (prompt maestro), `docs/requirements.md` si existe.

## Objetivo

Convertir el brief en requisitos verificables con identificadores estables, detectar riesgos y aislar las decisiones que dependen de la propietaria.

## Tareas

1. Extraer requisitos funcionales por módulo (catálogo, tienda, carrito/WhatsApp, panel) con prioridad M/S/C.
2. Definir requisitos no funcionales con criterios medibles (rendimiento, SEO, accesibilidad, seguridad, mantenibilidad, operación).
3. Identificar qué elementos adicionales conviene hacer configurables y cuáles se excluyen deliberadamente del panel.
4. Listar riesgos con impacto y medida preventiva.
5. Listar decisiones pendientes que requieren a la propietaria, con el supuesto que se adopta mientras tanto.

## Restricciones

- No elegir tecnologías en esta fase (eso es la fase 2); los requisitos deben ser neutrales.
- Cada criterio no funcional debe poder comprobarse con una herramienta o prueba concreta.

## Archivos

- Crear/actualizar `docs/requirements.md`.

## Pruebas

No aplica código. Revisión de consistencia: cada requisito del brief (secciones 2 y 5) tiene al menos un ID en el documento.

## Criterios de aceptación

- Todos los puntos de la sección 2 ("El sistema debe permitir, como mínimo") del brief están cubiertos por requisitos con ID.
- Los RNF incluyen umbrales numéricos (Lighthouse, Web Vitals, contraste, cobertura).
- Tabla de riesgos con al menos 6 entradas y medidas concretas.

## Condiciones que impiden cerrar

- Requisitos ambiguos del tipo "debe ser rápido" sin umbral.
- Decisiones comerciales tomadas en lugar de la propietaria sin señalarlas como supuestos.

## Resumen final

Lista de IDs creados, riesgos principales, supuestos adoptados y preguntas para la propietaria.
