# Guía de administración

Para quien edita la tienda desde el panel, sin tocar código. La dirección local es `http://localhost:3000/admin` (o el puerto que esté usando el servidor de desarrollo). En producción será `https://tu-dominio/admin`.

El pedido no se cobra en la web. El cliente arma el carrito y abre WhatsApp con el mensaje ya escrito. Tú confirmas talla, precio y envío en el chat.

## 1. Entrar

1. Abre `/admin`.
2. Escribe el correo y la contraseña del usuario administrador.
3. Si olvidaste la contraseña y no hay correo configurado, hay que restablecerla desde la base de datos o crear otro usuario. No hay recuperación automática hasta que se configure SMTP.

En local, el usuario de demostración es el de `SEED_ADMIN_EMAIL` en el archivo de entorno. Cámbialo antes de publicar la tienda.

## 2. Borrador, vista previa y publicado

Casi todo el catálogo tiene dos estados:

- **Borrador:** solo lo ves tú en el panel (y en la vista previa). No sale en la tienda.
- **Publicado:** lo ve quien visita el sitio.

### Cómo editar y ver la tienda al mismo tiempo

El panel es el control de la web: productos, portada, páginas, menú, WhatsApp, etc. Para no adivinar el resultado:

1. Abre lo que quieres cambiar (producto, **Página de inicio**, página, categoría…).
2. Pulsa el icono del **ojo** (Previsualizar). Déjalo **abierto** mientras trabajas.
3. Se parte la pantalla: formulario a un lado, tienda al otro. Franja ámbar = estás en borrador (los clientes aún no lo ven).
4. En productos, portada y páginas el borrador se guarda solo (~0,4 s) y la vista se refresca sola.
5. En menú, configuración o categorías: guarda y la vista se actualiza.
6. Cuando quede bien, **Publicar cambios**. Solo entonces sale a la tienda pública.
7. “Salir de la vista previa” cierra el modo borrador; el ojo otra vez cierra el panel lateral.

No hace falta publicar solo para mirar cómo queda. Publicar es el paso final.

El cambio publicado se refleja en la tienda a los pocos segundos, sin volver a desplegar. Si no aparece, recarga la página pública.

Para publicar un producto hace falta al menos una imagen. Si falta, el panel muestra el error y no publica.

## 3. Subir una foto

1. Entra en **Imágenes**.
2. Crea una nueva y elige el archivo (JPEG, PNG, WebP o AVIF).
3. Escribe el **texto alternativo**: qué se ve, no el nombre del archivo. Ejemplo: “Pijama largo de algodón rosa, vista frontal”.
4. Guarda.

Las fotos de muestra del catálogo de demostración se pueden reemplazar subiendo otra imagen y eligiéndola en el producto. Si vuelves a ejecutar el seed, solo pisa las fotos cuyo nombre de archivo sigue siendo el de demostración.

## 4. Crear un producto con tallas y colores

1. **Productos** → Crear.
2. Pestaña **Información**: nombre, descripción corta (hasta 160 caracteres), descripción, categoría. Marca **Destacado en inicio** si debe salir en la portada.
3. Pestaña **Precio y existencias**:
   - **Precio** en pesos enteros, sin puntos. `74900` se muestra como `$ 74.900`.
   - **Precio promocional** solo si es menor que el precio. Si es igual o mayor, el panel lo rechaza.
   - **Control de existencias** → **Existencias por variante**.
   - En **Opciones**, una fila `Talla` con valores `S`, `M`, `L` y otra `Color` con `Rosa`, `Gris` (los nombres que uses).
   - En **Variantes**, una fila por combinación. En **Combinación** escribe la opción y el valor exactamente como los definiste (`Talla` / `M`, `Color` / `Rosa`). Pon las unidades de esa combinación. El precio propio es opcional.
4. Pestaña **Imágenes**: la primera es la principal. La segunda aparece al pasar el cursor en el catálogo. Arrastra para cambiar el orden.
5. Pestaña **Detalles**: materiales y cuidados, si los tienes.
6. Arriba a la derecha, cambia el estado a **Publicado** y guarda.

Sin variantes (una sola pieza): elige **Existencias del producto** y escribe las unidades, o **Solo disponible o agotado** si no quieres llevar conteo.

## 5. Después de una venta por WhatsApp

La web no descuenta sola. Cuando cierres la venta en el chat:

1. Abre el producto.
2. Baja las **unidades** de esa variante (o del producto, si no usa variantes).
3. Si llega a 0, la ficha muestra **Agotado** y no deja agregarlo al carrito.
4. Guarda. Tiene que seguir publicado.

## 6. Inicio, menús y WhatsApp

- **Página de inicio:** antetítulo, título, texto, imagen del hero y botón. El bloque de destacados usa los productos marcados como destacados, salvo que elijas una selección manual o una colección.
- **Navegación:** textos y rutas del menú y del pie. Una ruta interna empieza por `/`, por ejemplo `/productos`.
- **Configuración del sitio** → **WhatsApp**:
  - Activa **Activar pedidos por WhatsApp**.
  - Número con indicativo de país, sin `+` ni espacios. Colombia: `573001112233`.
  - El saludo puede usar `{{tienda}}` y `{{nombre}}`.
  - **Mostrar botón flotante** pone el enlace verde en todas las páginas.
- El mensaje que se abre en WhatsApp **no confirma el pedido**. Se lo dice el propio texto al cliente.

## 7. Páginas, preguntas y guía de tallas

- **Páginas:** envíos, cambios, privacidad, contacto. El slug es la dirección (`/envios`).
- **Preguntas frecuentes:** pregunta y respuesta. Salen en `/preguntas-frecuentes`.
- **Guía de tallas:** el texto de `/guia-de-tallas`.
- **Colecciones** y **Categorías:** agrupan el catálogo. Una categoría sin productos publicados no debe enlazarse desde el menú.

## 8. Aviso de “Hydration failed” / “1 Issue” en el panel

En desarrollo, Payload inyecta un `<style>` de capas CSS que el cliente a veces reescribe (`data-merge-styles`). Next lo marca como hidratación. En este proyecto está mitigado con `admin.suppressHydrationWarning` y un parche de `@payloadcms/next` (`patches/@payloadcms__next@3.90.2.patch`).

Si aún ves el badge rojo “1 Issue”, recarga forzada (`Ctrl+Shift+R`). En producción ese overlay **no aparece**.

## 9. SEO en el panel

La descripción larga del producto o categoría **no** es lo mismo que el título/meta de buscadores. En la sección **SEO**, rellena Title y Description o usa **Generar automáticamente**. Si pone “0/3 comprobaciones”, faltan esos campos meta.

## 10. Si algo falla

| Lo que ves | Qué hacer |
| --- | --- |
| El producto no sale en la tienda | Revisa que esté **Publicado**, con categoría e imagen, y recarga. |
| No deja publicar | Lee el mensaje rojo: suele faltar la imagen, el precio promocional no es menor, o una variante repite la misma talla y color. |
| El precio se ve mal | Escríbelo sin puntos ni símbolo. `59900`, no `59.900`. |
| WhatsApp abre sin número o con el de demostración | **Configuración del sitio** → número real, canal activado, y guarda. |
| La foto no cambia | En el producto, pestaña Imágenes, elige la imagen nueva y guarda. La primera de la lista es la principal. |
| No entras al panel | Comprueba correo y contraseña. Si el sitio público abre pero `/admin` no, la base de datos puede estar caída. |
