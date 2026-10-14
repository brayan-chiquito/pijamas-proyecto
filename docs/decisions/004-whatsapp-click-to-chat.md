# ADR-004: Cierre de venta por WhatsApp click-to-chat

Estado: Aceptada · Fecha: 2026-10-12

## Contexto

La propietaria gestiona ventas por WhatsApp. No hay pasarela de pagos en la primera versión. WhatsApp documenta oficialmente el formato `https://wa.me/<número>?text=<texto codificado>` (Centro de ayuda, verificado), que abre un chat con mensaje prellenado en móvil y escritorio.

## Decisión

El flujo de compra termina en una página de resumen que genera un enlace `wa.me` con el pedido. El número, el saludo y la activación se configuran en el global `site-settings`. El mensaje se construye en el servidor (Server Action) con precios reconfirmados desde la base de datos.

## Reglas

- El número se almacena normalizado (solo dígitos, con indicativo de país, 8–15 dígitos).
- El texto se codifica con `encodeURIComponent` (saltos de línea `%0A`).
- La interfaz nunca usa "pedido confirmado"; indica que la confirmación ocurre en la conversación.
- No se reservan existencias ni se registra el pedido en base de datos.

## Alternativas

- WhatsApp Business Platform (Cloud API): permite mensajes automáticos y registro, pero tiene costo por conversación y requiere verificación de empresa. Se reevaluará si el volumen lo justifica.
- Formulario de pedido con correo: menos inmediato para la propietaria.

## Consecuencias

- Simplicidad y costo cero.
- Limitación documentada: la trazabilidad de pedidos vive en WhatsApp; las existencias se actualizan manualmente en el panel tras cada venta.
- Evolución prevista: colección `orders` con estado y enlace al chat, cuando se desee historial.
