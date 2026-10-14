# Seguridad: controles y criterios

## 1. Modelo de amenazas resumido

Activos: catálogo y contenido (integridad), credenciales de administración, datos mínimos del cliente introducidos en el resumen de pedido (nombre, ciudad, nota: no se almacenan en servidor), disponibilidad del sitio.

Amenazas principales: acceso no autorizado al panel, modificación de contenido vía API pública, inyección (XSS vía texto enriquecido o parámetros de URL), abuso de subida de archivos, fuga de secretos en el cliente, dependencias vulnerables.

## 2. Autenticación y sesiones (Payload)

| Control | Implementación | Verificación |
| --- | --- | --- |
| Contraseñas con hash | Payload (scrypt/pbkdf2 interno) | Revisión de configuración |
| Sesión en cookie HTTP-only, `SameSite=Lax`, `Secure` en producción | `auth.cookies` en colección `users` | Inspección de cabeceras en producción |
| Bloqueo por intentos fallidos | `auth.maxLoginAttempts: 5`, `lockTime: 10 min` | Prueba manual |
| Expiración de sesión | `auth.tokenExpiration: 2 h`, renovación en uso | Configuración |
| Recuperación de contraseña | Habilitada solo si hay `SMTP_*` configurado; de lo contrario, el admin restablece desde el panel | Prueba con Mailpit en local |
| Sin registro público | `auth.disableLocalStrategy: false`, pero `create` en `users` solo para rol admin | Prueba: `POST /api/users` anónimo → 403 |
| Primer usuario | Creado por `seed` desde variables de entorno o por el flujo de "primer usuario" de Payload únicamente cuando la tabla está vacía | — |

## 3. Autorización (control de acceso)

| Colección / Global | Lectura pública | Crear / editar | Eliminar | Notas |
| --- | --- | --- | --- | --- |
| products, categories, collections, tags, pages, faqs | Solo `_status = published` (anónimo); todo para usuarios autenticados | admin, editor | admin, editor | Borradores solo con sesión o cookie de vista previa |
| media | Pública (necesario para servir imágenes) | admin, editor | admin, editor | Tipos MIME y tamaño limitados |
| users | Solo el propio usuario; admin ve todos | admin (editor solo edita su perfil, no su rol) | admin | Un admin no puede eliminarse a sí mismo si es el último |
| site-settings, navigation, home-page, size-guide | Pública | admin, editor | — | Campos sensibles no existen en globals (los secretos van en env) |
| redirects | Pública (la consulta `proxy.ts`) | admin | admin | — |

Las funciones de acceso viven en `apps/web/src/access/` y se prueban con Vitest contra la Local API (`overrideAccess: false`).

## 4. Validación de entradas

- **Panel**: validaciones de campo en Payload (servidor) con mensajes en español: precio ≥ 0, promocional < precio, slug único y con formato, `alt` obligatorio, teléfono de WhatsApp 8–15 dígitos, URLs válidas en redes.
- **Tienda**: formulario de resumen validado con Zod en cliente y en la Server Action; cantidades enteras 1–99; slugs de productos del carrito verificados contra la base de datos antes de construir el mensaje (precios del servidor, nunca del cliente).
- **Parámetros de URL**: `searchParams` del catálogo parseados con Zod (`page` entero ≥ 1, `orden` enumerado, listas de tallas/colores saneadas); valores inválidos se ignoran, no provocan error 500.

## 5. Prevención de vulnerabilidades web

| Riesgo | Control |
| --- | --- |
| XSS en texto enriquecido | Lexical serializa a React (sin `dangerouslySetInnerHTML`); enlaces con `rel="noopener noreferrer"` cuando son externos |
| XSS en mensaje de WhatsApp | El mensaje se construye con texto plano y `encodeURIComponent`; nunca se interpola HTML |
| CSRF | Payload usa cookies `SameSite` y verificación de origen (`csrf` en config con los dominios permitidos) |
| Inyección SQL | Drizzle/Payload parametrizan todas las consultas; no se concatena SQL |
| Enumeración de usuarios | Mensajes de login genéricos (Payload) |
| Subida de archivos | `mimeTypes` permitidos, tamaño máximo 8 MB, procesamiento con `sharp` (reencodifica), nombres saneados |
| Clickjacking / MIME sniffing | Cabeceras en `next.config.ts`: `X-Frame-Options: DENY` para la tienda (el panel usa `SAMEORIGIN` por el live preview), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictiva |
| CSP | `Content-Security-Policy-Report-Only` con nonce en `src/proxy.ts`. No bloquea: primero se observa. `style-src` permite estilos en línea porque `next/image` los usa. El panel `/admin` queda fuera. |
| Exposición de API | REST de Payload accesible, pero el control de acceso devuelve solo publicados; GraphQL deshabilitado (`graphQL.disable: true`) por no usarse |
| Revalidación bajo demanda | `/next/revalidate` exige `REVALIDATION_SECRET` en cabecera; solo lo invocan hooks del servidor |
| Vista previa | `/next/preview` exige sesión válida de Payload y comprueba `PREVIEW_SECRET` |
| Rate limiting | El host (Vercel) provee protección básica; para formularios no hay envío a servidor salvo la Server Action de resumen (idempotente, sin efectos) |

## 6. Secretos y configuración

- Todos los secretos en variables de entorno; `.env.example` como contrato sin valores reales.
- Variables públicas solo con prefijo `NEXT_PUBLIC_` y nunca secretos.
- `PAYLOAD_SECRET` ≥ 32 caracteres aleatorios; rotación documentada en `docs/deployment.md`.
- Sin credenciales en el repositorio: `.gitignore` incluye `.env*` salvo `.env.example`; revisión con `git diff` antes de cada commit.

## 7. Dependencias

- `pnpm audit --prod` en CI; fallo en severidad alta/crítica.
- Renovación mensual de dependencias menores; Next.js se actualiza inmediatamente ante avisos de seguridad (próximo anunciado: 2026-10-14).
- Lockfile versionado; `pnpm install --frozen-lockfile` en CI.

## 8. Registro y errores

- Errores del servidor con `console.error` estructurado (JSON) sin datos personales ni cuerpos de petición completos; Vercel los agrega en logs.
- `error.tsx` muestra mensaje genérico; el `digest` permite correlacionar en logs.
- Sin servicio externo de errores en la primera versión; `docs/deployment.md` indica cómo añadir Sentry si se requiere.

## 9. Copias de seguridad

- Neon: historial de 6 h en Free (restauración puntual limitada). Complemento obligatorio: `pg_dump` semanal mediante GitHub Actions a un almacenamiento privado (ver `docs/deployment.md`), retención 8 semanas.
- Imágenes: Vercel Blob no versiona; exportación mensual con script `pnpm --filter web export:media` (lista y descarga).

## 10. Criterios de aceptación de seguridad (fase 10)

- [ ] `POST/PATCH/DELETE` anónimos a cualquier colección → 401/403 (prueba automatizada).
- [ ] `GET /api/products` anónimo no devuelve borradores (prueba automatizada).
- [ ] Editor no puede cambiar su rol ni crear usuarios (prueba automatizada).
- [ ] Cabeceras de seguridad presentes en respuesta de `/` y `/productos/[slug]`.
- [ ] Subida de archivo `.svg` o `.exe` rechazada.
- [ ] `pnpm audit --prod` sin altas/críticas.
- [ ] Ningún secreto en el bundle del cliente (`grep` de nombres de variables en `.next/static`).
- [ ] Mensaje de WhatsApp con caracteres `&`, `#`, `+`, saltos de línea y emojis llega íntegro (prueba E2E que decodifica la URL).
