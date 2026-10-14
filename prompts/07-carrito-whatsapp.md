# Fase 7 — Carrito y flujo de compra por WhatsApp

## Rol

Desarrollador Full Stack senior con foco en estado de cliente, validación y flujos de conversión.

## Contexto

`AGENTS.md`, `docs/requirements.md` (RF-CART), `docs/navigation.md` (3.4 y 3.5), `docs/decisions/004-whatsapp-click-to-chat.md`, `packages/domain/src/cart.ts`, `packages/domain/src/whatsapp.ts`, `packages/domain/src/schemas.ts`.

## Objetivo

Carrito persistente con totales consistentes, revalidación de precios/disponibilidad y página de resumen que genera un enlace `wa.me` correcto, con lenguaje que no confunde apertura de WhatsApp con confirmación.

## Tareas

1. `lib/cart/store.ts` (zustand + persist en localStorage, clave versionada) con acciones `add`, `updateQuantity`, `remove`, `clear`; hidratación segura (sin desajuste SSR) y selector de totales usando `computeCartTotals`.
2. Server Action `revalidateCartLines(lines)` que devuelve precio vigente, disponibilidad y título actual por línea; el cliente marca cambios y ajusta cantidades si superan existencias.
3. Componentes: `AddToCartButton`, `CartSheet`, `CartLine`, `CartSummary`, `CartEmpty`, página `/carrito`.
4. Página `/finalizar-pedido` con formulario (`checkoutFormSchema`), resumen, texto explicativo y botón que llama a la Server Action `prepareWhatsAppOrder(form, lines)`; esta reconfirma precios en servidor, construye el mensaje con `buildWhatsAppMessage` y la URL con `buildWhatsAppUrl` leyendo el número del global `site-settings`.
5. Tras abrir WhatsApp: estado "Pedido preparado" con "Vaciar carrito" / "Seguir comprando". Si WhatsApp está desactivado: contacto alternativo.
6. Botón "Consultar por WhatsApp" en producto (mensaje con nombre y URL del producto).

## Restricciones

- Precios y totales mostrados al usuario deben coincidir con los del mensaje (ambos desde `@pijamas/domain` con datos del servidor).
- Prohibido el texto "confirmado"/"confirmación de pedido". Usar "Pedido preparado" y explicar que se confirma en la conversación.
- El enlace se abre con `target="_blank"` y `rel="noopener noreferrer"`; en móvil puede usarse el mismo `wa.me`.
- El mensaje incluye saludo configurable, líneas (nombre, variante, cantidad, precio unitario, subtotal), total estimado, nombre del cliente, ciudad y nota si existen, y URL de cada producto.

## Archivos

`apps/web/src/lib/cart/**`, `apps/web/src/components/store/cart/**`, `apps/web/src/app/(frontend)/carrito/**`, `apps/web/src/app/(frontend)/finalizar-pedido/**`, `apps/web/src/actions/*.ts`.

## Pruebas

- Unitarias ya existentes en `@pijamas/domain` (ampliar si cambia el formato del mensaje).
- Componentes: store del carrito (agregar misma variante suma cantidad; variantes distintas crean líneas).
- E2E: flujo completo descrito en `docs/testing.md` 4.3.1 y 4.3.5; verificación decodificando `text` de la URL.

## Criterios de aceptación

- Total del resumen = total del mensaje = suma de líneas (prueba).
- URL `wa.me` válida con número normalizado y `text` codificado; saltos de línea como `%0A`.
- Carrito sobrevive a recarga y a cierre de pestaña.
- Precio cambiado en el panel se refleja con aviso al recargar `/carrito`.
- Sin desajuste de hidratación en consola.

## Condiciones que impiden cerrar

- Mensaje construido en el cliente con precios del cliente.
- Texto que afirme confirmación del pedido.

## Resumen final

Formato final del mensaje (ejemplo real), decisiones de UX en el resumen, limitaciones documentadas del flujo.
