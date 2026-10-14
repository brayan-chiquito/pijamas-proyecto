# Requisitos funcionales y no funcionales

Convenciones: cada requisito tiene un identificador estable para citarlo en prompts, pruebas y commits. Prioridad: **M** (imprescindible para lanzar), **S** (deseable en la primera versión), **C** (posterior).

## 1. Alcance de la primera versión

Incluye: tienda pública en español, catálogo administrable, carrito, cierre de pedido por WhatsApp, páginas institucionales, SEO técnico, panel administrativo protegido.

Excluye (documentado como evolución): pasarela de pagos, cuentas de cliente, registro de pedidos en base de datos, reseñas, multidivisa, multiidioma, envío automático de correos.

## 2. Actores

- **Visitante**: navega, filtra, agrega al carrito, envía el pedido por WhatsApp.
- **Administrador** (propietaria de la tienda): gestiona todo el contenido desde `/admin`. Puede crear otros usuarios.
- **Editor**: gestiona catálogo y contenido, no usuarios ni configuración sensible.
- **Desarrollador**: despliegues, cambios estructurales, variables de entorno.

## 3. Requisitos funcionales

### 3.1 Catálogo (RF-CAT)

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-CAT-01 | Crear, editar, publicar, despublicar y eliminar productos desde el panel, con borradores que no se muestran en la tienda | M |
| RF-CAT-02 | Producto con: nombre, slug editable, descripción corta, descripción larga (texto enriquecido), precio, precio promocional opcional, categoría, colecciones, etiquetas, galería de imágenes ordenable con imagen principal, textos alternativos, materiales y cuidados, producto destacado | M |
| RF-CAT-03 | Variantes por talla y/o color con existencias por variante, SKU opcional, precio opcional por variante e imagen asociada opcional | M |
| RF-CAT-04 | Productos sin variantes con control de existencias simple o modo "disponible/agotado" sin contar unidades | M |
| RF-CAT-05 | Estado de disponibilidad derivado: disponible, pocas unidades (umbral configurable), agotado | M |
| RF-CAT-06 | Categorías con nombre, slug, descripción, imagen y metadatos SEO; orden manual | M |
| RF-CAT-07 | Colecciones curadas (p. ej. "Novedades", "Invierno") con los mismos campos que categoría y productos asociados | S |
| RF-CAT-08 | Etiquetas/atributos filtrables (material, manga, estación) | S |
| RF-CAT-09 | Productos relacionados seleccionables manualmente; si no se definen, se muestran de la misma categoría | S |
| RF-CAT-10 | Vista previa en vivo de la página de producto desde el panel antes de publicar | S |

### 3.2 Tienda pública (RF-WEB)

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-WEB-01 | Página de inicio con hero/banners administrables, categorías destacadas, productos destacados, bloque promocional, bloque de confianza (envíos, cambios, atención) | M |
| RF-WEB-02 | Catálogo `/productos` con filtros por categoría, talla, color, rango de precio y disponibilidad; ordenamiento por novedad, precio ascendente/descendente; paginación | M |
| RF-WEB-03 | Páginas de categoría `/categorias/[slug]` y colección `/colecciones/[slug]` con contenido propio indexable | M |
| RF-WEB-04 | Página de producto `/productos/[slug]` con galería con zoom, precio y precio tachado si hay promoción, selector de variantes con disponibilidad por combinación, descripción, materiales y cuidados, guía de tallas, productos relacionados, migas de pan | M |
| RF-WEB-05 | Búsqueda por texto en nombre y descripción corta (`/buscar?q=`) | S |
| RF-WEB-06 | Páginas institucionales editables: nosotros, contacto, preguntas frecuentes, envíos y devoluciones, términos, privacidad | M |
| RF-WEB-07 | Menús de cabecera y pie, enlaces a redes sociales y datos de contacto administrables | M |
| RF-WEB-08 | Barra de anuncio opcional en la cabecera (texto y enlace administrables) | S |
| RF-WEB-09 | Página 404 y estados vacíos (catálogo sin resultados, carrito vacío) diseñados | M |
| RF-WEB-10 | Botón flotante de WhatsApp opcional (activable desde el panel) | S |

### 3.3 Carrito y pedido por WhatsApp (RF-CART)

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-CART-01 | Agregar producto/variante al carrito con cantidad; el carrito persiste en el navegador (localStorage) | M |
| RF-CART-02 | Modificar cantidades y eliminar líneas; subtotal por línea y total general consistentes con los precios vigentes (precio promocional cuando aplica) | M |
| RF-CART-03 | Validar al abrir el carrito y antes de enviar que los productos siguen publicados y disponibles; avisar si cambió el precio o se agotó | M |
| RF-CART-04 | Página de resumen `/finalizar-pedido` con nombre del cliente (obligatorio), ciudad/zona (opcional), nota (opcional) y lista de productos, variantes, cantidades y total | M |
| RF-CART-05 | Generar mensaje de WhatsApp legible con saludo, líneas de producto (nombre, variante, cantidad, precio unitario, subtotal), total estimado, datos del cliente y enlace a cada producto | M |
| RF-CART-06 | El número de WhatsApp de destino y el texto de saludo se configuran en el panel | M |
| RF-CART-07 | El enlace `wa.me` funciona en móvil y escritorio; el mensaje está correctamente codificado (saltos de línea `%0A`, `&`, `#`, `+`) | M |
| RF-CART-08 | La interfaz deja claro que el pedido se confirma en la conversación de WhatsApp; no se muestra "pedido confirmado" ni se reservan existencias | M |
| RF-CART-09 | Tras abrir WhatsApp, ofrecer vaciar el carrito o conservarlo | S |

### 3.4 Panel administrativo (RF-ADM)

| ID | Requisito | Prioridad |
| --- | --- | --- |
| RF-ADM-01 | Autenticación con correo y contraseña, sesión con cookie HTTP-only, cierre de sesión, recuperación de contraseña por correo si hay proveedor SMTP configurado | M |
| RF-ADM-02 | Roles administrador y editor con permisos diferenciados (ver `docs/security.md`) | M |
| RF-ADM-03 | Validaciones con mensajes comprensibles en español (precio ≥ 0, promocional < precio, slug único, alt obligatorio en imágenes) | M |
| RF-ADM-04 | Global "Configuración del sitio": nombre, logotipo, descripción, WhatsApp (número, saludo, activación, botón flotante), correo, teléfono, dirección, redes sociales, moneda, SEO por defecto, imagen Open Graph por defecto | M |
| RF-ADM-05 | Global "Navegación": menú principal, columnas del pie, enlaces legales | M |
| RF-ADM-06 | Global "Página de inicio": banners del hero, categorías destacadas, productos/colección destacados, bloque promocional, bloque de confianza | M |
| RF-ADM-07 | Preguntas frecuentes como colección con orden manual | M |
| RF-ADM-08 | Metadatos SEO por producto, categoría, colección y página (título, descripción, imagen) con vista previa de fragmento | M |
| RF-ADM-09 | Redirecciones administrables al cambiar un slug publicado (evitar 404 en URLs indexadas) | S |
| RF-ADM-10 | Interfaz del panel en español | S |

## 4. Requisitos no funcionales

### 4.1 Rendimiento (RNF-PERF)

| ID | Criterio verificable |
| --- | --- |
| RNF-PERF-01 | Lighthouse móvil (Performance) ≥ 90 en inicio, categoría y producto, medido en build de producción |
| RNF-PERF-02 | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 en el percentil 75 (medición real con Speed Insights/Search Console tras el lanzamiento) |
| RNF-PERF-03 | Imágenes servidas en AVIF/WebP con `sizes` correctos; imagen LCP con `priority`; resto con carga diferida |
| RNF-PERF-04 | JavaScript del cliente en la página de producto ≤ 170 KB comprimido (first load JS reportado por `next build`) |
| RNF-PERF-05 | Páginas públicas servidas desde caché (ISR por etiquetas); ninguna consulta a base de datos en la ruta crítica de una página cacheada |

### 4.2 SEO (RNF-SEO)

Ver `docs/seo.md`. Criterio de aceptación global: Rich Results Test sin errores en producto, categoría e inicio; sitemap válido; sin páginas duplicadas indexables por parámetros de filtro.

### 4.3 Accesibilidad (RNF-A11Y)

| ID | Criterio verificable |
| --- | --- |
| RNF-A11Y-01 | WCAG 2.2 nivel AA en contraste de texto (≥ 4,5:1) y componentes (≥ 3:1) |
| RNF-A11Y-02 | Navegación completa por teclado; foco visible; orden lógico; `skip link` |
| RNF-A11Y-03 | Selectores de variante y controles de cantidad con etiquetas accesibles y estado anunciado |
| RNF-A11Y-04 | `prefers-reduced-motion` respetado en todas las animaciones |
| RNF-A11Y-05 | axe-core sin violaciones críticas o serias en pruebas Playwright de inicio, catálogo, producto y carrito |

### 4.4 Seguridad (RNF-SEC)

Ver `docs/security.md`. Resumen: rutas `/admin` y API protegidas por autenticación y control de acceso; validación en cliente y servidor; secretos solo en variables de entorno; cabeceras de seguridad; sin exposición de datos de usuarios.

### 4.5 Mantenibilidad (RNF-MNT)

| ID | Criterio |
| --- | --- |
| RNF-MNT-01 | `pnpm typecheck`, `pnpm lint`, `pnpm test` pasan en CI antes de desplegar |
| RNF-MNT-02 | Lógica de carrito, precios y mensaje de WhatsApp en `@pijamas/domain` con cobertura ≥ 90 % de líneas |
| RNF-MNT-03 | Tipos de Payload generados automáticamente (`payload generate:types`) y consumidos por el frontend |
| RNF-MNT-04 | Documentación de instalación, despliegue y mantenimiento actualizada en cada fase |

### 4.6 Operación (RNF-OPS)

| ID | Criterio |
| --- | --- |
| RNF-OPS-01 | Copia de seguridad semanal automatizable de base de datos (`pg_dump`) y procedimiento de restauración documentado y probado |
| RNF-OPS-02 | Registro de errores del servidor sin datos personales ni secretos |
| RNF-OPS-03 | Variables de entorno documentadas en `.env.example` |

## 5. Elementos adicionales configurables (sin complicar el panel)

Se incluyen porque son cambios frecuentes en una tienda pequeña:

- Umbral de "pocas unidades".
- Texto de disponibilidad y de tiempos de envío mostrado en la página de producto.
- Guía de tallas como contenido enriquecido global, reutilizado en todos los productos.
- Activación del botón flotante de WhatsApp y de la barra de anuncio.
- Textos del bloque de confianza (envíos, cambios, atención).

Se excluyen deliberadamente del panel (requieren desarrollador): paleta de colores, tipografías, estructura de layout, reglas de SEO técnico, integración de analítica.

## 6. Riesgos y medidas preventivas

| Riesgo | Impacto | Medida |
| --- | --- | --- |
| Confundir apertura de WhatsApp con pedido confirmado | Expectativas erróneas del cliente | Texto explícito en resumen y tras el clic (RF-CART-08); sin lenguaje de "confirmación" |
| Existencias desactualizadas al vender por WhatsApp | Venta de agotados | Validación de disponibilidad antes de enviar (RF-CART-03); la administradora actualiza existencias tras cada venta; umbral de pocas unidades |
| Neon suspende cómputo por límite mensual | Panel inoperativo | Alertas de uso; ISR mantiene la tienda; plan de pago por uso documentado |
| Costo de Vercel Pro percibido alto | Abandono del hosting | Dockerfile y guía de migración a Railway/VPS |
| Imágenes pesadas subidas por la administradora | LCP alto | Payload genera tamaños optimizados con `sharp`; `next/image` sirve AVIF/WebP; guía de buenas prácticas en el panel |
| Cambio de slug de producto indexado | 404 en buscadores | Plugin de redirecciones (RF-ADM-09) y aviso en el campo slug |
| Vulnerabilidades en dependencias | Seguridad | `pnpm audit` en CI; actualizar Next tras el aviso de seguridad del 2026-10-14 |
| Panel técnico para persona no técnica | Baja adopción | Etiquetas y descripciones en español en cada campo, grupos y pestañas, documentación de uso `docs/admin-guide.md` |

## 7. Decisiones pendientes que requieren a la propietaria

Ninguna bloquea el inicio del desarrollo. Se parametrizan y se cargan al configurar el sitio:

1. Nombre comercial, logotipo y número de WhatsApp.
2. Moneda y país (afecta formato de precio y `priceCurrency` en datos estructurados). Supuesto inicial: COP, es-CO; se cambia en el global de configuración.
3. Política de envíos, cambios y devoluciones (textos).
4. Dominio.
5. Si se desea ocultar el precio en productos "a consultar" (no incluido; se asume precio siempre visible).
