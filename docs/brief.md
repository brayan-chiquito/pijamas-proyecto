# Prompt maestro: diseño y desarrollo de una tienda online de pijamas

## 1. Rol y objetivo del proyecto

Actúa como un **arquitecto de software y desarrollador senior Full Stack**, con experiencia en comercio electrónico, UX/UI, SEO técnico, accesibilidad, rendimiento web, seguridad y diseño de interfaces modernas.

Tu objetivo es planificar, diseñar y desarrollar una tienda online profesional para la venta de pijamas, con una experiencia visual atractiva, navegación intuitiva, catálogo administrable y una arquitectura preparada para crecer.

El proyecto se desarrollará utilizando **Cursor como entorno principal de trabajo**. Debes aprovechar sus capacidades de análisis, planificación, generación de código, revisión y ejecución de pruebas, evitando generar grandes cantidades de código sin una estrategia definida.

No te limites a implementar una página visualmente atractiva. Diseña una solución comercial funcional, fácil de administrar, rápida, segura, optimizada para buscadores y sostenible a largo plazo.

## 2. Requisito principal: autonomía administrativa

La persona propietaria de la tienda debe poder administrar la mayor parte del contenido y de la configuración comercial desde un panel administrativo intuitivo, sin modificar código ni depender del desarrollador para las tareas cotidianas.

El sistema debe permitir, como mínimo:

- Crear, editar, publicar, despublicar y eliminar productos.
- Modificar nombres, descripciones, precios, precios promocionales, fotografías y textos alternativos de imágenes.
- Gestionar categorías, colecciones, etiquetas y atributos de los productos.
- Administrar variantes como tallas, colores y disponibilidad, cuando correspondan.
- Reordenar fotografías y seleccionar imágenes principales.
- Gestionar existencias o disponibilidad de cada producto.
- Configurar banners, imágenes destacadas, promociones y contenido de la página de inicio.
- Editar textos institucionales, preguntas frecuentes, información de contacto y políticas comerciales.
- Administrar menús, enlaces de navegación y enlaces a redes sociales.
- Configurar metadatos SEO, títulos, descripciones, slugs y textos alternativos.
- Gestionar la información de envíos, cambios, devoluciones y condiciones de compra.
- Visualizar una vista previa de los cambios antes de publicarlos, cuando la arquitectura seleccionada lo permita.

Identifica qué otros elementos de la tienda conviene hacer configurables sin complicar innecesariamente el panel.

**Principio fundamental:** el contenido comercial debe estar separado de la lógica de la aplicación. Los cambios habituales de catálogo, fotografías, precios y textos no deben requerir despliegues ni modificaciones de código.

Los cambios estructurales, las nuevas funcionalidades y las modificaciones profundas del diseño podrán requerir intervención técnica.

## 3. Investigación y selección tecnológica

Antes de decidir la arquitectura, evalúa las alternativas tecnológicas vigentes y selecciona las más adecuadas para este proyecto.

Compara, cuando resulte pertinente:

- Frameworks orientados al renderizado y SEO, como Next.js, Astro y otras alternativas relevantes.
- CMS headless, plataformas de comercio electrónico y soluciones de administración visual.
- Bases de datos, almacenamiento de imágenes y servicios de alojamiento.
- Alternativas gratuitas, de bajo costo y de pago.
- Opciones de integración con WhatsApp para gestionar compras.
- Soluciones de analítica y medición del rendimiento.

Considera especialmente:

1. SEO orgánico y capacidad de indexación.
2. Rendimiento, Core Web Vitals y experiencia móvil.
3. Facilidad de administración por usuarios no técnicos.
4. Costo inicial y costo recurrente.
5. Seguridad y mantenimiento.
6. Escalabilidad para un catálogo aproximado de 30 a 200 productos.
7. Facilidad de desarrollo asistido por Cursor.
8. Flexibilidad para incorporar nuevas funcionalidades.
9. Dependencia de proveedores y posibilidades de migración.
10. Complejidad operativa para una tienda pequeña o mediana.

No selecciones tecnologías únicamente por popularidad. Presenta las ventajas, desventajas, limitaciones, costos estimados y razones de la decisión final.

Investiga documentación oficial actualizada cuando tengas acceso a Internet. Distingue los precios verificados de las estimaciones y no inventes funcionalidades, integraciones ni condiciones comerciales.

Al finalizar, establece una arquitectura recomendada y justifica por qué ofrece el mejor equilibrio entre calidad, costo, SEO, facilidad administrativa y mantenimiento.

## 4. Diseño UX/UI de nivel profesional

Diseña una experiencia de compra moderna, atractiva, coherente y orientada a la conversión.

La identidad visual debe transmitir comodidad, calidad, confianza y atractivo comercial, adaptándose a una marca especializada en pijamas.

Analiza referencias de tiendas de moda, ropa de dormir y marcas de comercio electrónico reconocidas. Utilízalas como inspiración para identificar patrones de diseño efectivos, sin copiar directamente sus interfaces ni sus elementos distintivos.

Define:

- Identidad visual y dirección artística.
- Paleta de colores con sus códigos HEX y usos recomendados.
- Tipografías y jerarquías visuales.
- Sistema de espaciado, tamaños, bordes y sombras.
- Componentes reutilizables.
- Estilos de botones, tarjetas, formularios, menús y notificaciones.
- Diseño adaptable a móviles, tabletas y escritorio.
- Estados de carga, error, éxito, disponibilidad y contenido vacío.
- Animaciones, microinteracciones y transiciones.
- Criterios de accesibilidad y legibilidad.

Prioriza fotografías de producto de alta calidad, presentación clara de precios, selección intuitiva de variantes y llamadas a la acción visibles.

Las animaciones deben aportar valor a la experiencia. Evita efectos excesivos que distraigan, reduzcan el rendimiento o dificulten la navegación. Respeta la preferencia del usuario por movimiento reducido.

### Evaluación de Pencil.dev

Antes de comenzar el diseño, evalúa si vale la pena utilizar la extensión o herramienta Pencil.dev para diseñar las interfaces antes de implementarlas con Cursor.

Si aporta valor real:

1. Explica por qué conviene utilizarla en este proyecto.
2. Consulta su documentación oficial vigente y verifica cómo se instala y configura.
3. Define cómo organizar las pantallas, componentes, estilos y recursos del diseño.
4. Establece el flujo de trabajo entre Pencil.dev y Cursor.
5. Define cómo trasladar fielmente el diseño a componentes funcionales.
6. Especifica cómo mantener consistencia visual y evitar diferencias entre diseño e implementación.
7. Crea los archivos de contexto y prompts necesarios para ejecutar el proceso.

Si no aporta suficiente valor, explica las razones y recomienda una alternativa.

No asumas comandos, extensiones, configuraciones o funcionalidades de Pencil.dev sin verificarlos.

## 5. Arquitectura funcional de la tienda

Define las páginas y funcionalidades necesarias para ofrecer una experiencia completa.

### Tienda pública

- Página de inicio con propuesta de valor, categorías, productos destacados y promociones.
- Catálogo con filtros, ordenamiento y navegación por categorías.
- Página individual de producto con galería de imágenes, descripción, precio, variantes y disponibilidad.
- Carrito de compras con cantidades, eliminación de productos y cálculo de subtotales.
- Proceso de compra claro, con la posibilidad de finalizar el pedido mediante WhatsApp si se selecciona esta modalidad.
- Páginas institucionales, contacto, preguntas frecuentes y políticas comerciales.
- Páginas de categorías y colecciones preparadas para posicionamiento orgánico.
- Páginas de error y estados vacíos correctamente diseñados.

### Compra por WhatsApp

Si se adopta WhatsApp como canal de cierre de ventas:

- El usuario debe poder agregar y quitar productos del carrito.
- Las cantidades, variantes y precios deben mostrarse claramente.
- El total debe calcularse de manera consistente.
- Antes de salir de la tienda, el usuario debe revisar el resumen del pedido.
- Se debe generar un mensaje de WhatsApp legible con los productos, variantes, cantidades y total estimado.
- El número de destino debe configurarse sin modificar código.
- La integración debe funcionar correctamente en dispositivos móviles y navegadores de escritorio.

No confundas la apertura de WhatsApp con la confirmación de una compra. Si no existe una integración de pagos y pedidos confirmados, documenta las limitaciones de este flujo.

### Panel administrativo

Diseña una interfaz independiente y protegida para gestionar el catálogo, el contenido y la configuración comercial.

Incluye autenticación, autorización, validación de datos, mensajes de error comprensibles y protección frente a operaciones no autorizadas.

No expongas credenciales, secretos ni permisos administrativos en el cliente.

## 6. SEO técnico y posicionamiento orgánico

Aplica las mejores prácticas vigentes de Google Search Central, sin prometer posiciones específicas en los resultados de búsqueda.

Establece una estrategia que contemple:

- Renderizado y disponibilidad de contenido indexable.
- URLs descriptivas, estables y canónicas.
- Títulos y metadescripciones únicos.
- Jerarquía correcta de encabezados.
- Datos estructurados apropiados, como Product, BreadcrumbList y Organization, según corresponda.
- Información consistente sobre precios, disponibilidad, variantes y condiciones comerciales.
- Sitemap XML y robots.txt correctamente configurados.
- Gestión de errores HTTP y páginas inexistentes.
- Enlaces internos entre productos, categorías y colecciones.
- Optimización de imágenes, formatos modernos, dimensiones adecuadas y textos alternativos útiles.
- Diseño mobile-first.
- Prevención de contenido duplicado.
- Indexación correcta de filtros, parámetros y páginas de búsqueda.
- Open Graph para compartir productos y páginas.
- Integración posible con Google Search Console y herramientas de analítica.
- Medición de Core Web Vitals y rendimiento real.

Investiga qué datos estructurados y prácticas son apropiados para el modelo comercial elegido. No implementes marcado engañoso ni atribuyas reseñas, disponibilidad, precios o valoraciones inexistentes.

Distingue entre requisitos técnicos, buenas prácticas y acciones comerciales que requieren contenido de calidad o trabajo posterior.

## 7. Rendimiento, seguridad y calidad

Define criterios verificables para:

- Optimización de imágenes y carga diferida cuando corresponda.
- Reducción de JavaScript innecesario.
- Renderizado eficiente y carga rápida del contenido principal.
- Accesibilidad conforme a criterios WCAG pertinentes.
- Validación de entradas en cliente y servidor.
- Protección de rutas administrativas.
- Gestión segura de sesiones y credenciales.
- Prevención de vulnerabilidades web comunes.
- Manejo consistente de errores.
- Pruebas unitarias, de integración y de los flujos críticos.
- Linting, formato y comprobaciones de tipos cuando sean aplicables.
- Gestión de variables de entorno.
- Copias de seguridad y recuperación de datos.
- Registro de errores sin exponer información sensible.
- Documentación de instalación, desarrollo y despliegue.

Establece objetivos de rendimiento medibles y criterios de aceptación realistas. No declares una funcionalidad terminada solo porque compila o porque su interfaz parece correcta.

## 8. Estructura del proyecto y monorepo

Evalúa si conviene utilizar un monorepo. Si es la mejor opción, define una estructura coherente que separe las aplicaciones, los componentes compartidos, las configuraciones y la documentación.

La estructura debe facilitar el desarrollo asistido por Cursor sin introducir complejidad innecesaria.

Documenta:

- Herramientas de gestión del monorepo y dependencias.
- Aplicación de tienda pública.
- Panel administrativo.
- Backend, si la arquitectura requiere uno separado.
- Paquetes compartidos.
- Modelos, contratos y validaciones reutilizables.
- Configuración de calidad y pruebas.
- Recursos gráficos.
- Migraciones y semillas de datos, si se utiliza una base de datos.
- Variables de entorno y archivos de ejemplo.
- Documentación técnica y funcional.

No crees aplicaciones o paquetes vacíos sin una finalidad concreta. La estructura debe corresponder a la arquitectura seleccionada.

## 9. Documentación y archivos que debes generar

Además del código, crea toda la documentación necesaria para que el proyecto pueda ejecutarse de forma ordenada con Cursor.

Como mínimo, considera:

- `README.md`: descripción general, requisitos, instalación, comandos y funcionamiento.
- `docs/requirements.md`: requisitos funcionales y no funcionales.
- `docs/architecture.md`: decisiones arquitectónicas y justificación tecnológica.
- `docs/ux-ui.md`: sistema visual, componentes y reglas de diseño.
- `docs/seo.md`: estrategia y lista de comprobación SEO.
- `docs/security.md`: controles y criterios de seguridad.
- `docs/testing.md`: estrategia y criterios de aceptación.
- `docs/deployment.md`: configuración de entornos, publicación y mantenimiento.
- `docs/decisions/`: decisiones arquitectónicas importantes, cuando sean necesarias.
- `AGENTS.md` o los archivos de reglas compatibles con la versión actual de Cursor: instrucciones generales y convenciones del proyecto.
- `prompts/`: prompts independientes y ordenados para ejecutar cada fase con Cursor.
- Archivos de contexto específicos para diseño, frontend, backend, SEO y pruebas, únicamente cuando aporten información útil que no esté duplicada.

Los nombres y ubicaciones definitivos deben ajustarse a la arquitectura y a las convenciones vigentes de las herramientas.

Los documentos deben contener instrucciones concretas, criterios verificables y decisiones tomadas. Evita generar documentación genérica, contradictoria o duplicada.

## 10. Sistema de prompts para Cursor

No intentes construir toda la aplicación en una única instrucción.

Diseña una secuencia de prompts independientes, cada uno con objetivos claros, contexto, entregables y condiciones para continuar.

Incluye como mínimo las siguientes fases:

1. Análisis de requisitos, riesgos y decisiones pendientes.
2. Investigación tecnológica y definición de arquitectura.
3. Creación del monorepo y configuración inicial.
4. Diseño UX/UI y configuración de Pencil.dev, si aplica.
5. Implementación del sistema visual y los componentes compartidos.
6. Desarrollo del catálogo y las páginas públicas.
7. Implementación del carrito y el flujo de compra por WhatsApp.
8. Desarrollo del panel administrativo y la persistencia de datos.
9. Implementación de SEO técnico.
10. Seguridad, accesibilidad y optimización del rendimiento.
11. Pruebas, revisión de código y corrección de defectos.
12. Preparación del despliegue, documentación y mantenimiento.

Puedes dividir estas fases en prompts más pequeños cuando reduzca riesgos o facilite la revisión.

Cada prompt debe especificar:

- Rol que debe asumir Cursor.
- Archivos de contexto que debe consultar.
- Objetivo de la fase.
- Tareas que debe realizar.
- Restricciones técnicas y de diseño.
- Archivos que debe crear o modificar.
- Pruebas que debe ejecutar.
- Criterios de aceptación.
- Condiciones que impiden dar la fase por terminada.
- Resumen de decisiones, cambios y pendientes al finalizar.

Cursor debe inspeccionar el repositorio y la documentación existente antes de modificar archivos. Debe respetar las decisiones aprobadas y solicitar aclaraciones cuando exista una ambigüedad que pueda cambiar significativamente la arquitectura o el comportamiento comercial.

## 11. Metodología de trabajo

Aplica principios KISS, DRY, YAGNI y SOLID cuando sean pertinentes. Evita abstraer prematuramente, duplicar lógica o introducir dependencias sin justificación.

Trabaja de forma incremental:

1. Analiza.
2. Planifica.
3. Implementa una unidad funcional.
4. Ejecuta pruebas.
5. Revisa resultados.
6. Corrige problemas.
7. Actualiza documentación.
8. Continúa con la siguiente fase.

No sustituyas archivos completos sin necesidad. No elimines código existente ni introduzcas cambios destructivos sin comprobar su impacto.

No ocultes errores ni afirmes que ejecutaste pruebas, validaciones o despliegues que realmente no se realizaron.

Cuando una decisión dependa de información que todavía no se conoce, documenta la incertidumbre, presenta alternativas y solicita únicamente las aclaraciones imprescindibles.

## 12. Entregables finales

Antes de comenzar la implementación completa, entrega:

1. Resumen ejecutivo de la solución.
2. Comparativa tecnológica y arquitectura recomendada.
3. Justificación de la decisión sobre Pencil.dev.
4. Requisitos funcionales y no funcionales.
5. Mapa de navegación y definición de las pantallas.
6. Estructura completa propuesta del monorepo.
7. Modelo de datos y relaciones principales.
8. Estrategia de administración y almacenamiento de contenido.
9. Estrategia SEO, rendimiento, accesibilidad y seguridad.
10. Estimación de costos iniciales y recurrentes, con sus supuestos.
11. Lista de riesgos y medidas preventivas.
12. Documentación y prompts necesarios para ejecutar cada fase con Cursor.

Después, procede a la implementación por etapas, validando los criterios de aceptación de cada una.

**Resultado esperado:** una tienda online de pijamas visualmente profesional, fácil de administrar por una persona no técnica, optimizada para buscadores y dispositivos móviles, con un flujo de compra claro y una arquitectura mantenible que pueda evolucionar sin reconstruir todo el proyecto.

Prioriza siempre las decisiones que aporten valor comercial real. La complejidad tecnológica, la cantidad de animaciones o el volumen de código no son indicadores de calidad por sí solos.