# ADR-001: Next.js 16 con Payload CMS 3 embebido

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

La tienda necesita SEO sólido, un panel administrativo completo para una persona no técnica, catálogo con variantes y existencias, y un costo recurrente bajo. El brief exige separar el contenido comercial del código y evitar despliegues para cambios de catálogo.

## Decisión

Una sola aplicación Next.js 16 (App Router) que incluye Payload CMS 3 en `app/(payload)`. La tienda consume datos mediante la Local API de Payload en Server Components. El panel vive en `/admin`.

## Alternativas consideradas

- **Astro + CMS externo (Sanity/Decap)**: mejor rendimiento base, pero obliga a un segundo sistema y complica carrito/variantes.
- **Next.js + Sanity**: cero operación de base de datos, pero datos fuera de la infraestructura propia, dependencia de proveedor y segunda herramienta.
- **Shopify**: todo incluido, pero costo recurrente mayor y flujo de checkout propio innecesario.
- **Backend separado (Strapi/Medusa)**: dos despliegues, más superficie de mantenimiento.

## Consecuencias

- Positivas: un único despliegue, tipos TypeScript generados automáticamente, autenticación y control de acceso resueltos, borradores y vista previa en vivo, 0 USD de licencia.
- Negativas: la app depende de Postgres en runtime (no es puramente estática); el bundle del servidor es mayor; se asume la curva de aprendizaje de Payload.
- Mitigación: ISR por etiquetas para que la tienda no consulte la base de datos en la ruta crítica; `output: 'standalone'` para portabilidad.
