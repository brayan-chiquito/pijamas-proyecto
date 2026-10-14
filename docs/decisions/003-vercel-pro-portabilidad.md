# ADR-003: Vercel Pro como hosting inicial con portabilidad por Dockerfile

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

Vercel ofrece la mejor integración con Next.js (ISR, `next/image`, Blob, Analytics), pero sus Fair Use Guidelines (verificadas) prohíben el uso comercial en el plan Hobby. Una tienda es uso comercial aunque el cierre sea por WhatsApp. Las alternativas gratuitas con uso comercial (Cloudflare Workers Free) no admiten el bundle de Payload sin trabajo adicional.

## Decisión

Desplegar en **Vercel Pro (20 USD/mes, verificado)**. Construir la aplicación con `output: 'standalone'` y mantener un `Dockerfile` funcional y probado en CI para poder migrar a un contenedor (Railway, Render, Coolify/VPS) sin cambios de código, sustituyendo solo el adaptador de almacenamiento (Blob → S3/R2).

## Alternativas

- Cloudflare Workers Paid (5 USD/mes): bundle > 3 MiB exige plan de pago; plantilla oficial de Payload en Next 15; más fricción con OpenNext.
- Railway/Render desde el inicio: más barato, pero sin optimización de imágenes en CDN y con operación adicional; se deja como ruta de salida.
- VPS: máximo control, máxima operación.

## Consecuencias

- Costo recurrente de ≈ 20 USD/mes asumido conscientemente a cambio de operación mínima.
- La integración Neon–Vercel simplifica ramas de base de datos por PR.
- El `Dockerfile` se construye en CI para garantizar que la ruta de salida funciona.
