# Estimación de costos

Fecha: 2026-10-12. Precios en USD sin impuestos. **V** = verificado en la página oficial del proveedor ese día; **E** = estimación con supuestos.

## 1. Supuestos

- Catálogo: 30–200 productos, 4–6 imágenes cada uno (≤ 1 GB total de imágenes originales + derivados).
- Tráfico: 3 000–15 000 visitas/mes, 5–8 páginas por visita → ≤ 120 000 páginas/mes, la mayoría servidas desde caché.
- Un solo desarrollador desplegando; 1–3 editores (no cuentan como asientos en Vercel; Payload no cobra asientos).
- Sin pasarela de pagos ni API de WhatsApp Business.

## 2. Costo inicial (una sola vez)

| Concepto | Costo | Tipo |
| --- | --- | --- |
| Software (Next.js, Payload, Tailwind, pen.dev) | 0 | V |
| Dominio `.com` o `.co` | 10–40 /año (según TLD y registrador) | E |
| Fotografía de producto | Variable; no técnico | — |
| Desarrollo | Según acuerdo; fuera de este documento | — |

## 3. Costo recurrente: escenario recomendado

| Servicio | Plan | Costo mensual | Tipo | Notas |
| --- | --- | --- | --- | --- |
| Vercel | Pro | 20 | V | Incluye 20 USD de crédito de uso, Flat Rate CDN (1 M peticiones, 1 TB), Web Analytics y Speed Insights con límites |
| Neon | Free | 0 | V | 1 GB almacenamiento, 100 CU-horas/proyecto/mes, 5 GB egreso. Estimación de uso: < 30 CU-horas/mes con ISR |
| Vercel Blob | Dentro del crédito Pro | ≈ 0,05 | E | 1 GB × 0,023 + operaciones mínimas |
| Optimización de imágenes | Dentro del crédito Pro | 0–2 | E | Transformaciones se cachean; 200 productos × ~6 imágenes × ~4 tamaños ≈ 5 000 transformaciones únicas |
| Dominio | — | ≈ 1–3 | E | Prorrateo anual |
| Google Search Console, Analytics | — | 0 | V | |
| pen.dev | Free | 0 | V | "pen.dev is currently free" en la página oficial |
| **Total** | | **≈ 21–25 USD/mes** | | |

Riesgo de sobrecosto: si el crédito de 20 USD de Vercel se agota (tráfico muy superior al supuesto), la facturación es bajo demanda. Con los supuestos anteriores el consumo estimado es < 5 USD/mes de crédito.

## 4. Escenario de bajo costo (contenedor)

| Servicio | Costo mensual | Tipo | Notas |
| --- | --- | --- | --- |
| Railway Hobby o Render Starter | 5–7 + uso | E | Contenedor siempre activo; sin CDN de imágenes integrado (sirve `sharp` local) |
| Neon Free | 0 | V | |
| Cloudflare R2 | 0 | E | 10 GB gratis según documentación pública de Cloudflare; confirmar vigencia |
| Dominio | 1–3 | E | |
| **Total** | **≈ 6–10 USD/mes** | | Más tiempo de operación del desarrollador |

## 5. Escenario VPS

Hetzner CX22 (~4,5 EUR/mes, E) + Coolify/Dokploy + Postgres en el mismo servidor + R2. ≈ 5–6 USD/mes, con responsabilidad total de actualizaciones, TLS, copias y monitorización. Recomendado solo con desarrollador disponible de forma continua.

## 6. Cuándo cambia el escenario

- Neon Free → Launch (pago por uso, ~5–15 USD/mes E): si el panel se usa intensamente o el almacenamiento supera 1 GB.
- Vercel Pro → más asientos (20 USD/asiento): solo si hay más de un desarrollador desplegando (los editores del panel no cuentan).
- Añadir pasarela de pagos: comisiones por transacción del proveedor (fuera de alcance).
- WhatsApp Business Platform: costo por conversación; innecesario mientras el volumen sea gestionable manualmente.

## 7. Comparación con alternativas descartadas

| Alternativa | Costo mensual | Motivo de descarte |
| --- | --- | --- |
| Shopify Basic | ≈ 29–39 (E) + comisiones | Sobredimensionado; checkout propio innecesario; menor control de SEO y diseño |
| Sanity Growth + Vercel Pro | 15/asiento + 20 | Segundo proveedor; el plan Free de Sanity sería suficiente, pero no aporta frente a Payload |
| Strapi Cloud + Vercel Pro | 18–35 + 20 | Backend separado; más costo y operación |
