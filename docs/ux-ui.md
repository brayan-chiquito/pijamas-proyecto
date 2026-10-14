# Sistema visual, componentes y reglas de diseño

## 1. Identidad visual y dirección artística

Concepto: **"descanso bien vestido"**. La marca vende comodidad con intención estética: tejidos suaves, luz cálida de dormitorio, orden y calma. La interfaz debe sentirse como una tienda boutique, no como un marketplace: mucho aire, fotografía protagonista, tipografía serif suave para titulares y sans legible para todo lo demás.

Referencias analizadas (patrones, no copias): tiendas de ropa de dormir y loungewear de gama media-alta que comparten estos patrones efectivos:

- Fotografía de producto sobre fondos neutros cálidos y fotos de contexto (persona en casa) alternadas en la galería.
- Tarjetas de producto en ratio vertical 4:5 con cambio de imagen al pasar el cursor.
- Selector de talla con botones grandes y combinaciones agotadas visibles pero deshabilitadas.
- Panel de compra fijo en escritorio mientras se desplaza la descripción.
- Bloque de confianza (envíos, cambios, atención) justo debajo del hero o del botón de compra.
- Paletas de tonos empolvados con un acento oscuro para los botones principales.

## 2. Paleta de colores

Tokens definidos en `apps/web/src/styles/tokens.css` con `@theme` de Tailwind 4. Todos los pares texto/fondo indicados cumplen WCAG AA.

| Token | HEX | Uso |
| --- | --- | --- |
| `--color-cream-50` | `#FBF7F2` | Fondo de página |
| `--color-cream-100` | `#F4EDE3` | Superficies alternas, fondos de sección |
| `--color-cream-200` | `#E8DCCB` | Bordes, divisores, skeletons |
| `--color-ink-900` | `#2B2622` | Texto principal (contraste 14,0:1 sobre cream-50) |
| `--color-ink-600` | `#6B6159` | Texto secundario (5,7:1 sobre cream-50; 5,2:1 sobre cream-100) |
| `--color-ink-400` | `#9A8F86` | Placeholders, texto deshabilitado (solo decorativo, no para información) |
| `--color-plum-700` | `#5B3A57` | **Primario**: botones principales, enlaces activos, precio en promoción (9,6:1 con blanco; 7,7:1 sobre plum-100) |
| `--color-plum-800` | `#472B44` | Hover/active del primario |
| `--color-plum-100` | `#EFE3EC` | Fondo suave del primario (chips seleccionados, badges) |
| `--color-rose-300` | `#D9A3A8` | Acento: detalles, subrayados, iconos decorativos |
| `--color-rose-100` | `#F7E6E7` | Fondo de badges "Nuevo" |
| `--color-peach-400` | `#E39A6A` | Promociones ("Oferta"), siempre con texto ink-900 (6,5:1) |
| `--color-sage-600` | `#47704F` | Éxito, "Disponible" (5,3:1 sobre cream-50) |
| `--color-amber-700` | `#8F5A0E` | Advertencia, "Pocas unidades" (5,4:1 sobre cream-50) |
| `--color-red-600` | `#B4423A` | Error, "Agotado" (5,2:1 sobre cream-50) |
| `--color-blue-600` | `#3A6B9F` | Información (5,2:1 sobre cream-50) |
| `--color-white` | `#FFFFFF` | Tarjetas, campos |

Los ratios se calcularon con la fórmula de luminancia relativa de WCAG 2.x; el script de verificación se repite en la fase 10 sobre `tokens.css`.

Reglas: un solo color primario para acciones; el acento rosa nunca se usa como fondo de texto pequeño; los estados usan color + icono + texto (no solo color).

Modo oscuro: no incluido en la primera versión (decisión consciente; una tienda de ropa prioriza fidelidad de color de producto).

## 3. Tipografía

Cargada con `next/font/google` (self-hosted en build, sin peticiones a Google en runtime, `display: swap`).

| Rol | Fuente | Pesos | Uso |
| --- | --- | --- | --- |
| Display | **Fraunces** (variable, eje opsz y SOFT) | 400, 500, 600 | h1–h3, precios destacados, eyebrows en versalitas |
| Texto | **Nunito Sans** (variable) | 400, 500, 600, 700 | Cuerpo, UI, botones, formularios |

Escala (rem, base 16 px, móvil → escritorio con `clamp`):

| Token | Tamaño | Uso |
| --- | --- | --- |
| `text-display` | clamp(2.25rem, 5vw, 3.5rem) / 1.05 | h1 del hero |
| `text-h1` | clamp(1.875rem, 3.5vw, 2.5rem) / 1.15 | Título de página y producto |
| `text-h2` | clamp(1.5rem, 2.5vw, 2rem) / 1.2 | Secciones |
| `text-h3` | 1.25rem / 1.3 | Subtítulos, nombre en tarjeta grande |
| `text-body-lg` | 1.125rem / 1.6 | Descripción de producto |
| `text-body` | 1rem / 1.6 | Texto base |
| `text-small` | 0.875rem / 1.5 | Metadatos, ayudas |
| `text-caption` | 0.75rem / 1.4, tracking 0.08em, mayúsculas | Eyebrows, badges |

Longitud de línea máxima para texto corrido: `max-w-prose` (65–72 caracteres).

## 4. Espaciado, tamaños, bordes y sombras

- Espaciado: escala de Tailwind (4 px). Ritmo vertical de secciones: `py-16` móvil, `py-24` escritorio. Gutter de contenedor: `px-4` móvil, `px-6` tablet, `px-8` escritorio; `max-w-7xl` (1280 px).
- Grid de catálogo: gap `4` móvil, `6` escritorio.
- Radios: `--radius-sm` 6 px (chips, inputs), `--radius-md` 12 px (tarjetas, botones), `--radius-lg` 20 px (hero, paneles), `--radius-full` para avatares y puntos de color.
- Sombras (suaves, cálidas): `--shadow-card` `0 1px 2px rgb(43 38 34 / 0.04), 0 8px 24px -12px rgb(43 38 34 / 0.12)`; `--shadow-overlay` `0 24px 48px -16px rgb(43 38 34 / 0.25)`.
- Bordes: 1 px `cream-200`; foco: anillo 2 px `plum-700` con offset 2 px (visible siempre con `:focus-visible`).
- Alturas táctiles mínimas: 44 px en botones y controles.

## 5. Componentes reutilizables (`apps/web/src/components/ui`)

| Componente | Variantes / estados | Notas de accesibilidad |
| --- | --- | --- |
| `Button` | `primary`, `secondary` (borde plum), `ghost`, `link`; tamaños `sm`, `md`, `lg`; `loading` (spinner + `aria-busy`), `disabled` | Botón nativo; icono opcional con `aria-hidden` |
| `Badge` | `new`, `sale`, `soldout`, `lowstock`, `neutral` | Texto siempre presente |
| `Price` | normal, con promoción (tachado + actual + porcentaje), rango | `<del>` y `<ins>` semánticos con `aria-label` completo |
| `ProductCard` | default, con segunda imagen al hover, agotado | Enlace único que envuelve imagen y título |
| `ProductGallery` | miniaturas/carrusel, zoom | Botones prev/next con etiquetas, `aria-live` para la posición |
| `VariantSelector` | botones de opción (talla), muestras de color | `role="radiogroup"`, `aria-checked`, agotado con `aria-disabled` y leyenda |
| `QuantityInput` | − / número / + | `inputmode="numeric"`, límites anunciados |
| `Input`, `Textarea`, `Select`, `Checkbox` | normal, error (mensaje bajo el campo con `aria-describedby`), deshabilitado | Etiqueta visible siempre |
| `Sheet` (panel lateral) | derecha (carrito), izquierda (filtros móvil) | Radix Dialog: foco atrapado, Esc, `aria-modal` |
| `Dialog` | confirmaciones | Radix Dialog |
| `Accordion` | descripción, cuidados, FAQ | Radix Accordion |
| `Toast` | éxito, error, info | Región `aria-live="polite"`, auto-cierre 5 s, pausable |
| `Breadcrumbs` | — | `<nav aria-label="Migas de pan">`, `aria-current="page"` |
| `Skeleton` | tarjeta, texto, imagen | `aria-hidden` |
| `EmptyState` | catálogo vacío, carrito vacío, 404 | Ilustración SVG propia + CTA |
| `Pagination` | — | `<nav aria-label="Paginación">`, enlaces reales (`?page=`) |
| `AnnouncementBar` | — | Cerrable, estado en `sessionStorage` |
| `WhatsAppButton` | flotante, inline | Enlace con `aria-label` explícito; `rel="noopener noreferrer"` |

Convención: los componentes de `ui/` no conocen Payload ni el carrito; los de `components/store/` componen `ui/` con datos.

## 6. Estados obligatorios

Toda vista con datos define explícitamente: **cargando** (skeleton, no spinner global), **vacío** (`EmptyState` con acción), **error** (`error.tsx` o mensaje inline con reintento), **éxito** (toast). Disponibilidad: `in_stock` (sin aviso o "Disponible"), `low_stock` ("Quedan N unidades"), `out_of_stock` ("Agotado", botón deshabilitado y CTA "Consultar por WhatsApp").

## 7. Animaciones y microinteracciones

Principio: la animación confirma una acción o guía la atención; nunca decora por sí sola.

| Interacción | Animación | Duración / easing |
| --- | --- | --- |
| Hover en tarjeta | Cambio a segunda imagen con `opacity`; elevación sutil (`translate-y-0.5`, sombra) | 200 ms, `ease-out` |
| Agregar al carrito | Contador de la cabecera con `scale` 1→1.2→1; toast entra desde abajo | 250 ms |
| Apertura de Sheet/Dialog | Deslizamiento + fade | 250 ms entrada / 200 ms salida |
| Acordeón | Altura con `grid-template-rows` 0fr→1fr | 200 ms |
| Hero (slides) | Fade cruzado y acercamiento leve de la foto activa (`scale` 1→1.04). Autoplay de hasta 6 s que no se pausa al pasar el cursor. Sin autoplay ni acercamiento con `prefers-reduced-motion` | 600 ms el fundido; el acercamiento dura el intervalo |
| Skeleton | Pulso suave | 1,5 s loop |
| Cambio de página | Sin transiciones de ruta en la primera versión (View Transitions de React 19.3 se evaluará después) | — |

Todas las animaciones se envuelven en `@media (prefers-reduced-motion: no-preference)`; con movimiento reducido se mantienen solo cambios de opacidad instantáneos. Nunca animar `width`/`height`/`top`/`left` (solo `transform` y `opacity`).

## 8. Diseño adaptable

Breakpoints Tailwind: `sm` 640, `md` 768, `lg` 1024, `xl` 1280. Mobile-first.

- Móvil: menú en Sheet, búsqueda expandible, filtros en Sheet, grid 2 columnas, panel de compra en flujo con botón "Agregar" fijo en la parte inferior al hacer scroll.
- Tablet: grid 3 columnas, filtros en Sheet.
- Escritorio: filtros laterales, grid 4 columnas, galería con miniaturas, panel de compra `sticky top-24`.

## 9. Accesibilidad y legibilidad

- HTML semántico: `header`, `nav`, `main`, `section` con encabezado, `footer`; un único h1 por página.
- Skip link al contenido principal.
- Todas las imágenes con `alt` significativo (obligatorio en el panel); decorativas con `alt=""`.
- Formularios con etiquetas visibles, errores asociados y foco al primer error.
- Contraste verificado en la tabla de colores; iconos siempre acompañados de texto o `aria-label`.
- Tamaño de texto mínimo 14 px; zoom 200 % sin pérdida de contenido.
- Pruebas automáticas con axe (Playwright) y revisión manual con teclado y lector de pantalla (NVDA) en las 4 pantallas clave.

## 10. Fotografía e imágenes

- Producto: fondo neutro cálido o contexto doméstico; ratio 4:5 para catálogo, 1:1 aceptable; mínimo 1600 px en el lado mayor.
- Payload genera tamaños `thumbnail`, `card`, `gallery`, `og`; `next/image` sirve AVIF/WebP con `sizes` específicos por componente.
- Textos alternativos descriptivos: "Pijama largo de algodón rosa con botones, vista frontal", no "IMG_0234".

## 11. Evaluación de pen.dev (antes Pencil.dev)

### 11.1 Qué es (verificado el 2026-10-12 en docs.pencil.dev)

- Herramienta de diseño en lienzo que funciona como **extensión de VS Code/Cursor**, app de escritorio y CLI. Los diseños se guardan en archivos `.pen` versionables en el repositorio.
- Instalación: Extensiones de Cursor → buscar "pen.dev" → Instalar → crear/abrir un archivo `.pen`. Si se abre como texto: paleta de comandos → `pen.dev: Toggle Design Mode`.
- Integración con agentes vía **MCP**: en Ajustes (⚙️) → MCP se habilita el cliente (Cursor); el servidor `pencil` aparece en la lista de MCP de Cursor. Herramientas públicas: `get_style`, `read_skill`, `get_app_state`, `execute` (`browser` y `spawn_agents` son condicionales).
- Flujo documentado Design → Code y Code → Design a través del agente conectado; exportación HTML desde el panel de propiedades; "Import from Browser" para convertir una página renderizada en capas.
- Precio: la página oficial indica que **actualmente es gratuito**; listados de terceros describen límites del plan gratuito (5 "agent days"/mes, 25 generaciones de imagen) y planes de pago "próximamente". Tratar los límites como no verificados.
- Advertencias de la documentación: no editar `.pen` manualmente; mantener los `.pen` dentro del workspace; las funciones de agente requieren autenticación (`pen login` o `PEN_CLI_KEY`).

### 11.2 Decisión: **sí, de forma acotada** — cerrada sin lienzo el 2026-10-12

El lienzo no se produjo. La interfaz ya estaba construida y el servidor MCP de pen.dev no está disponible; ver la actualización de `docs/decisions/006-pen-dev-diseno.md`.

Aporta valor porque:

1. Permite validar visualmente las 5 pantallas clave (inicio, catálogo, producto, carrito/resumen, página institucional) y el sistema de tokens **antes** de escribir componentes, reduciendo iteraciones costosas sobre código.
2. Los archivos `.pen` quedan versionados junto al código, sin herramienta externa ni licencias.
3. El puente MCP permite que Cursor lea estilos (`get_style`) y estado del documento (`get_app_state`) para generar componentes coherentes con el diseño.

No aporta valor (y no se usa) para: el panel administrativo (Payload ya lo genera), estados de error/vacío secundarios, páginas de texto. Tampoco sustituye a `docs/ux-ui.md` como fuente de verdad de tokens.

Riesgos: producto joven con documentación que cambia; dependencia de cuenta para funciones de IA; límites del plan gratuito no verificados. Mitigación: el flujo está diseñado para que, si pen.dev no está disponible, la fase 4 pueda completarse con la alternativa de la sección 11.5.

### 11.3 Organización del diseño (`design/`)

```
design/
├── README.md                 # Esta guía resumida y pasos de instalación
├── pijamas.pen               # Documento único (se crea desde Cursor con la extensión)
└── exports/                  # Capturas PNG de referencia por pantalla (opcional, para revisión)
```

Dentro de `pijamas.pen` (páginas del lienzo):

1. `00 Tokens`: paleta, tipografía, espaciado, radios, sombras (debe coincidir con la sección 2–4 de este documento).
2. `01 Componentes`: Button, Badge, Price, ProductCard, VariantSelector, QuantityInput, Input, Sheet, Toast, Breadcrumbs.
3. `02 Inicio` (móvil 390 px y escritorio 1440 px).
4. `03 Catálogo` (móvil y escritorio, con filtros abiertos y estado vacío).
5. `04 Producto` (móvil y escritorio, variante agotada visible).
6. `05 Carrito y resumen` (Sheet del carrito, `/carrito`, `/finalizar-pedido`).
7. `06 Institucional` (página de texto y FAQ).

### 11.4 Flujo de trabajo pen.dev ↔ Cursor

1. Instalar la extensión y crear `design/pijamas.pen`; habilitar MCP en los ajustes de pen.dev y confirmar que `pencil` aparece en la lista de MCP de Cursor.
2. Con el `.pen` abierto, ejecutar `prompts/04-diseno-ux-ui.md`: Cursor usa `get_app_state()` para confirmar el documento activo y crea la página de tokens a partir de `docs/ux-ui.md`.
3. Diseñar/ajustar pantallas (manual o con el agente). Revisar en el lienzo; exportar PNG a `design/exports/` para registro.
4. Al implementar (fase 5 y 6), Cursor consulta `get_style` y el `.pen` para trasladar medidas, colores y jerarquías a componentes Tailwind. La fuente de verdad de los valores numéricos sigue siendo `tokens.css`; si el diseño y los tokens difieren, se actualiza primero `docs/ux-ui.md` y luego ambos.
5. Verificación de fidelidad: captura de la implementación (Playwright) comparada visualmente con la exportación del diseño; desviaciones > 8 px en espaciados o cualquier color fuera de tokens se corrigen.

### 11.5 Alternativa si pen.dev no está disponible

Ruta `/dev/ui` (solo en desarrollo) que renderiza todos los componentes con sus variantes y estados ("galería viva"). Las decisiones visuales se toman directamente sobre esa página con capturas de Playwright. Esta ruta se implementa en cualquier caso porque también sirve para pruebas visuales y accesibilidad.
