import { isValidWhatsAppPhone } from '@pijamas/domain'
import type { GlobalConfig } from 'payload'

import { anyone, staff } from '@/access'
import { revalidateStoreTags, tagsForCollection } from '@/hooks/revalidate'

const revalidate = () => {
  const target = tagsForCollection('site-settings')
  void revalidateStoreTags(target.tags, target.paths)
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Configuración del sitio',
  admin: { group: 'Sitio', description: 'Marca, WhatsApp, contacto y textos que se repiten en toda la tienda.' },
  access: { read: anyone, update: staff },
  hooks: { afterChange: [revalidate] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Marca',
          fields: [
            { name: 'siteName', label: 'Nombre de la tienda', type: 'text', required: true, defaultValue: 'Casa Pijama' },
            { name: 'tagline', label: 'Frase', type: 'text', defaultValue: 'Descanso bien vestido' },
            { name: 'logo', label: 'Logotipo', type: 'upload', relationTo: 'media' },
          ],
        },
        {
          label: 'Comercio',
          fields: [
            {
              name: 'currency',
              label: 'Moneda',
              type: 'text',
              required: true,
              defaultValue: 'COP',
              admin: { description: 'Código ISO 4217, por ejemplo COP o USD.' },
            },
            { name: 'locale', label: 'Locale', type: 'text', required: true, defaultValue: 'es-CO' },
            {
              name: 'lowStockThreshold',
              label: 'Umbral de pocas unidades',
              type: 'number',
              min: 1,
              defaultValue: 3,
            },
            {
              name: 'shippingNotice',
              label: 'Aviso de envío en la ficha',
              type: 'text',
              defaultValue: 'Envíos a todo el país. El plazo se confirma por WhatsApp.',
            },
          ],
        },
        {
          label: 'WhatsApp',
          fields: [
            { name: 'whatsappEnabled', label: 'Activar pedidos por WhatsApp', type: 'checkbox', defaultValue: true },
            {
              name: 'whatsappPhone',
              label: 'Número con indicativo',
              type: 'text',
              admin: { description: 'Solo dígitos con indicativo de país. Ejemplo: 573001112233.' },
              validate: (value: unknown) => {
                if (value === undefined || value === null || value === '') return true
                return isValidWhatsAppPhone(String(value))
                  ? true
                  : 'Escribe el número con indicativo de país, sin ceros iniciales'
              },
            },
            {
              name: 'whatsappGreeting',
              label: 'Saludo del pedido',
              type: 'textarea',
              defaultValue: 'Hola {{tienda}}, soy {{nombre}} y quiero hacer este pedido:',
              admin: { description: 'Puedes usar {{nombre}} y {{tienda}}.' },
            },
            { name: 'floatingButton', label: 'Mostrar botón flotante', type: 'checkbox', defaultValue: true },
          ],
        },
        {
          label: 'Contacto',
          fields: [
            { name: 'email', label: 'Correo', type: 'email' },
            { name: 'phone', label: 'Teléfono visible', type: 'text' },
            { name: 'address', label: 'Dirección', type: 'textarea' },
            { name: 'schedule', label: 'Horario', type: 'text' },
            {
              name: 'socialLinks',
              label: 'Redes sociales',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  label: 'Red',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Pinterest', value: 'pinterest' },
                  ],
                },
                { name: 'url', label: 'URL', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Anuncio y confianza',
          fields: [
            { name: 'announcementEnabled', label: 'Mostrar barra de anuncio', type: 'checkbox', defaultValue: false },
            { name: 'announcementText', label: 'Texto del anuncio', type: 'text' },
            { name: 'announcementLink', label: 'Enlace del anuncio', type: 'text' },
            {
              name: 'trustItems',
              label: 'Bloque de confianza',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'title', label: 'Título', type: 'text', required: true },
                { name: 'text', label: 'Texto', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'defaultTitleSuffix', label: 'Sufijo del título', type: 'text', defaultValue: 'Casa Pijama' },
            { name: 'defaultDescription', label: 'Descripción por defecto', type: 'textarea' },
            { name: 'defaultOgImage', label: 'Imagen para compartir', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
