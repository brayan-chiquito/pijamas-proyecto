# Arquitectura y selección tecnológica

Fecha de la evaluación: 2026-10-12. Las versiones y precios marcados como **verificado** se consultaron ese día en documentación oficial o en el registro de npm. Lo marcado como **estimación** es un cálculo propio con supuestos explícitos.

## 1. Resumen ejecutivo

Tienda online de pijamas con catálogo de 30 a 200 productos, administrada por una persona no técnica y con cierre de venta por WhatsApp (sin pasarela de pagos en la primera versión).

Arquitectura recomendada:

| Capa | Decisión | Motivo principal |
| --- | --- | --- |
| Framework web | **Next.js 16.4** (App Router, React 19.3) | Renderizado en servidor e ISR para SEO, `next/image`, metadata API, sitemap/robots nativos |
| CMS y panel administrativo | **Payload CMS 3.90** embebido en la misma app Next.js | Panel completo, autenticación, control de acceso, borradores, vista previa en vivo, subida de imágenes con punto focal, 100 % gratuito (MIT) |
| Base de datos | **PostgreSQL** (Neon en producción, Docker en local) | Relacional, migraciones gestionadas por Payload, plan gratuito permanente en Neon |
| Almacenamiento de imágenes | **Vercel Blob** (adaptador oficial) con alternativa documentada a Cloudflare R2 vía S3 | Un proveedor menos que administrar; adaptador intercambiable |
| Alojamiento | **Vercel Pro** (20 USD/mes) con `Dockerfile` listo para migrar a Railway/VPS | Mejor integración con Next.js y mínima operación; Hobby no permite uso comercial |
| Estilos y UI | **Tailwind CSS 4.3** + componentes propios + primitivas accesibles de `radix-ui` | Sin dependencia de un kit visual externo, control total del sistema de diseño |
| Lógica de negocio compartida | Paquete `@pijamas/domain` (TypeScript puro + Zod 4) | Carrito, totales, mensaje de WhatsApp y validaciones testeables sin framework |
| Pruebas | Vitest 5 (unitarias/integración), Playwright 1.64 (flujos críticos) | Estándar del ecosistema, soporte en Cursor |
| Diseño previo | pen.dev (antes Pencil.dev), uso acotado a pantallas clave | Gratuito, extensión para Cursor con MCP; ver `docs/ux-ui.md` |

Separación de contenido y código: todo el contenido comercial (productos, precios, fotografías, textos, menús, políticas, número de WhatsApp, SEO) vive en la base de datos y se edita desde `/admin`. El código solo cambia para funcionalidades nuevas.

## 2. Comparativa de frameworks de renderizado

| Criterio | Next.js 16 | Astro 5/6 | Remix / React Router 7 | SvelteKit |
| --- | --- | --- | --- | --- |
| SEO / indexación | SSR, ISR, SSG, metadata API, sitemap y robots nativos | Excelente (HTML estático por defecto, islas) | SSR completo | SSR/SSG |
| Imágenes | `next/image` con optimización integrada en Vercel | `astro:assets` | Requiere servicio externo | Requiere plugin |
| Panel administrativo integrado | **Payload se instala dentro de la app** | Requiere CMS externo | Requiere CMS externo | Requiere CMS externo |
| Interactividad (carrito, variantes) | React Server + Client Components | Islas; más fricción con estado compartido | React | Svelte |
| Soporte en Cursor / documentación | Muy amplio; Next 16 incluye skills y docs para agentes | Amplio | Medio | Medio |
| Riesgo de dependencia | Alto acoplamiento con Vercel, mitigado con `output: 'standalone'` + Dockerfile | Bajo | Bajo | Bajo |

Decisión: **Next.js**. El factor decisivo no es popularidad sino que Payload 3 elimina la necesidad de un segundo sistema (CMS SaaS o backend separado) y reutiliza autenticación, tipos y base de datos. Astro sería la mejor opción para un catálogo puramente estático sin panel propio, pero obligaría a sumar un CMS externo y a resolver carrito/variantes con islas.

## 3. Comparativa de CMS y plataformas de administración

| Opción | Costo (verificado) | Ventajas | Desventajas / límites |
| --- | --- | --- | --- |
| **Payload CMS 3** (autoalojado dentro de Next.js) | 0 USD, licencia MIT, sin cuotas de usuarios ni API | Panel generado desde la configuración TypeScript, borradores y versiones, vista previa en vivo con Server Components, subida de archivos con punto focal y recorte, control de acceso granular, plugin SEO oficial, campos condicionales, datos en tu propia base de datos | Hay que operar base de datos y almacenamiento; el panel es técnico-neutral pero menos "guiado" que Shopify |
| Sanity | Gratis: 20 usuarios, 10 000 documentos, 250 000 peticiones API/mes, 100 GB assets (topes duros). Growth 15 USD/usuario/mes | Cero operación, editor en tiempo real, CDN de imágenes | Dependencia de proveedor, datos fuera de tu infraestructura, segundo sistema que mantener, topes duros en plan gratuito |
| Strapi | Comunidad gratis autoalojada; Cloud desde 18–35 USD/mes según fuente | Maduro, plugins | Servidor Node siempre encendido (no serverless), app separada del frontend |
| Decap CMS (git-based) | 0 USD | Sin base de datos | Modelado pobre para variantes y existencias, edición vía commits, experiencia confusa para no técnicos |
| Shopify | Desde ~29–39 USD/mes (estimación; no verificado) + comisiones | Todo incluido | Sobredimensionado para cierre por WhatsApp, costo recurrente mayor, personalización limitada del flujo |
| Medusa / Saleor | 0 USD autoalojado | Comercio completo | Complejidad operativa excesiva para 30–200 productos |

Decisión: **Payload CMS 3**. Cubre todos los requisitos de autonomía administrativa del brief (sección 2) con una sola aplicación y sin costo de licencia. Sanity es la alternativa si se prefiere no operar base de datos; la migración sería posible porque el frontend consume tipos propios (`@pijamas/domain`) y no el SDK del CMS directamente.

## 4. Base de datos

| Opción | Plan gratuito (verificado 2026-10) | Observaciones |
| --- | --- | --- |
| **Neon (Postgres)** | Permanente, sin tarjeta: 100 proyectos, 1 GB almacenamiento/proyecto, 100 CU-horas/proyecto/mes, autoscaling hasta 2 CU, 10 ramas, 5 GB egreso. Al superar un límite mensual el cómputo se suspende hasta el mes siguiente | Escala a cero tras 5 min; con ISR el tráfico a la base de datos es bajo. Plan Launch de pago por uso (0,106 USD/CU-hora, 0,35 USD/GB-mes) |
| Supabase (Postgres) | Gratis con pausa de proyectos inactivos | Riesgo de pausa en tienda con poco tráfico |
| Cloudflare D1 (SQLite) | Gratis | Requiere Workers y OpenNext; la plantilla oficial de Payload para Cloudflare sigue en Next 15 y exige Workers de pago por tamaño de bundle |
| MongoDB Atlas | M0 gratis 512 MB | Payload lo soporta, pero Postgres encaja mejor con variantes, existencias y consultas de catálogo |

Decisión: **PostgreSQL**. Local: contenedor Docker (`docker-compose.yml`). Producción: Neon Free, con upgrade a Launch si se agotan las CU-horas (estimación: una tienda de este tamaño con ISR usa muy por debajo de 100 CU-horas/mes).

Riesgo documentado: si Neon suspende el cómputo por límite mensual, la tienda pública sigue sirviendo páginas cacheadas pero el panel deja de funcionar hasta el siguiente mes o hasta pagar. Mitigación: alerta de uso en Neon y copia de seguridad semanal (ver `docs/deployment.md`).

## 5. Almacenamiento de imágenes

| Opción | Costo verificado | Encaje |
| --- | --- | --- |
| **Vercel Blob** | Pro: 0,023 USD/GB-mes almacenamiento, 0,40 USD por millón de operaciones simples, 5 USD por millón de avanzadas; transferencia incluida en Flat Rate CDN (1 TB/mes). Hobby: 1 GB incluido | Adaptador oficial `@payloadcms/storage-vercel-blob`; cero configuración adicional |
| Cloudflare R2 | 10 GB gratis, egreso gratuito (verificado en documentación pública de Cloudflare en años anteriores; confirmar antes de contratar) | Adaptador `@payloadcms/storage-s3`; independiente del hosting |
| Cloudinary | Plan gratuito con créditos | Transformaciones potentes pero otro proveedor más |

Decisión: **Vercel Blob** mientras el hosting sea Vercel. Estimación para 200 productos × 6 imágenes × 600 KB ≈ 0,7 GB → menos de 0,05 USD/mes. Las transformaciones las hace `next/image` (5 000 incluidas en Hobby; en Pro consumen del crédito). Si se migra de hosting, cambiar al adaptador S3 apuntando a R2 y copiar los archivos.

## 6. Alojamiento

Hallazgo crítico (verificado): **Vercel Hobby prohíbe el uso comercial** ("Any method of requesting or processing payment", "Advertising the sale of a product or service"). Una tienda, aunque cierre por WhatsApp, es uso comercial. Por tanto, la opción gratuita de Vercel no es válida.

| Opción | Costo verificado/estimado | Operación | Encaje con Next 16 + Payload |
| --- | --- | --- | --- |
| **Vercel Pro** | 20 USD/mes (incluye 20 USD de crédito de uso, 1 asiento, Flat Rate CDN 1 TB) — verificado | Mínima | Óptimo (plantilla oficial de Payload para Vercel usa Neon + Blob) |
| Cloudflare Workers Paid | 5 USD/mes (estimación, plan Workers Paid) | Baja-media | Requiere OpenNext; bundle de Payload supera 3 MiB del plan gratuito; plantilla oficial en Next 15 |
| Railway / Render (contenedor) | ~5–10 USD/mes (estimación) | Media | Funciona con `output: 'standalone'`; sin optimización de imágenes integrada (usa `sharp` en el contenedor) |
| VPS (Hetzner CX22 ~4,5 EUR/mes) + Coolify/Dokploy | ~5 USD/mes (estimación) | Alta (actualizaciones, TLS, copias) | Funciona; máxima independencia |

Decisión: **Vercel Pro** para el lanzamiento por simplicidad operativa y encaje con Next.js. Para evitar dependencia, la app se construye con `output: 'standalone'` y se entrega un `Dockerfile`, de modo que la migración a contenedor sea un cambio de proveedor y no una reescritura.

## 7. Integración con WhatsApp

| Opción | Costo | Evaluación |
| --- | --- | --- |
| **Enlace click-to-chat `https://wa.me/<número>?text=<mensaje codificado>`** (verificado en el Centro de ayuda de WhatsApp) | 0 USD | Funciona en móvil y escritorio (WhatsApp Web/Desktop). El mensaje queda prellenado y el cliente debe pulsar enviar. Número en formato internacional sin `+`, espacios ni ceros iniciales |
| WhatsApp Business Platform (Cloud API) | Conversaciones de pago, requiere verificación de empresa | Innecesario para la primera versión |
| Widgets de terceros | Suscripción | Innecesario |

Decisión: **click-to-chat**. El número, el texto de saludo y la activación del canal se configuran en el global `Configuración del sitio` del panel.

Limitación documentada: abrir WhatsApp **no confirma un pedido**. No hay registro de pedidos ni reserva de existencias. La gestión del pedido ocurre en la conversación. Ver `docs/requirements.md`, RF-CART-08.

## 8. Analítica y medición

- Google Search Console (gratis): indexación, Core Web Vitals, informes de datos estructurados (listados de comerciante y fragmentos de producto).
- Vercel Web Analytics y Speed Insights (incluidos en Pro con límites de eventos): sin cookies, medición real de Web Vitals.
- Opcional: Google Analytics 4 o Umami, activables por variable de entorno (`NEXT_PUBLIC_GA_ID`) sin tocar código de componentes.

## 9. Monorepo

Evaluación: Payload vive dentro de la app Next.js, así que no hay un backend separado que justifique varias aplicaciones. Sin embargo, aislar la lógica de negocio pura (carrito, totales, generación del mensaje de WhatsApp, formato de precios, validaciones Zod) en un paquete sin dependencias de React ni de Payload permite probarla en milisegundos y reutilizarla si en el futuro aparece otra superficie (por ejemplo, una app móvil o un worker de pedidos).

Decisión: **monorepo mínimo con pnpm workspaces**, sin Turborepo ni Nx (YAGNI con dos paquetes).

```
pijamas/
├── apps/
│   └── web/                 # Next.js 16 + Payload 3 (tienda pública + /admin)
├── packages/
│   └── domain/              # @pijamas/domain: tipos, Zod, carrito, WhatsApp, precios (sin React)
├── docs/                    # Documentación funcional y técnica
├── prompts/                 # Prompts por fase para Cursor
├── design/                  # Archivos .pen de pen.dev y guía de trabajo
├── AGENTS.md                # Reglas para agentes de Cursor
├── docker-compose.yml       # Postgres local
├── pnpm-workspace.yaml
├── package.json             # scripts raíz (lint, test, typecheck, build)
└── tsconfig.base.json
```

Detalle completo en `docs/project-structure.md`.

## 10. Flujo de datos

```
Editor ──> /admin (Payload UI) ──> Payload Local API ──> PostgreSQL
                                        │
                                        ├──> Vercel Blob (imágenes)
                                        └──> hook afterChange ──> revalidateTag / revalidatePath

Visitante ──> Next.js (RSC) ──> payload.find() (Local API, sin HTTP) ──> HTML cacheado (ISR por etiquetas)
            └──> Client Components: carrito (localStorage) ──> resumen ──> wa.me/<número>?text=...
```

- La tienda pública consulta Payload mediante la **Local API** dentro de Server Components (sin latencia HTTP ni exposición de endpoints).
- Caché: páginas de producto, categoría, colección e institucionales se generan estáticamente (`generateStaticParams`, `revalidate = 3600` como red de seguridad) y las consultas se envuelven en `unstable_cache` con etiquetas por colección (`products`, `product:<slug>`, `categories`, `globals`). Los hooks `afterChange`/`afterDelete` llaman a `revalidateTag(tag, { expire: 0 })` y `revalidatePath` para que el editor vea el cambio publicado en segundos sin despliegue. No se activa `cacheComponents` (`"use cache"`) en esta versión porque la plantilla oficial de Payload para Next 16 no lo usa y el panel no está validado con ese modo; se reevaluará en una fase posterior (ADR si se adopta).
- La REST API de Payload queda habilitada únicamente para el panel; las colecciones públicas permiten `read` solo de documentos publicados.

## 11. Decisiones registradas

Ver `docs/decisions/`:

- ADR-001 Next.js + Payload embebido
- ADR-002 PostgreSQL en Neon
- ADR-003 Vercel Pro y portabilidad con Dockerfile
- ADR-004 Cierre de venta por WhatsApp click-to-chat
- ADR-005 Monorepo mínimo con pnpm
- ADR-006 pen.dev para diseño acotado
- ADR-007 Modelo de variantes explícitas

## 12. Versiones fijadas (verificadas en npm el 2026-10-12)

| Paquete | Versión |
| --- | --- |
| next | 16.4.0 |
| react / react-dom | 19.3.0 |
| payload, @payloadcms/next, @payloadcms/db-postgres, @payloadcms/richtext-lexical, @payloadcms/plugin-seo, @payloadcms/storage-vercel-blob | 3.90.2 |
| tailwindcss, @tailwindcss/postcss | 4.3.3 |
| typescript | 5.9.3 (se evita TypeScript 7 hasta que Payload y Next lo soporten oficialmente) |
| zod | 4.6.7 |
| vitest | 5.0.4 |
| @playwright/test | 1.64.0 |
| sharp | 0.35.5 |
| zustand | 5.0.15 |
| radix-ui | 1.8.1 |
| lucide-react | 1.55.0 |

Nota de seguridad: Next.js anunció una actualización de seguridad fuera de ciclo para el 2026-10-14. Actualizar a la versión parcheada en cuanto se publique (`pnpm up next@latest`).
