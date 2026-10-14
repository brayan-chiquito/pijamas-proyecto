import { expect, test } from '@playwright/test'

test('el pedido por WhatsApp no queda confirmado', async ({ page }) => {
  await page.goto('/productos/bata-suave-de-casa')
  await expect(page.getByRole('heading', { level: 1, name: 'Bata suave de casa' })).toBeVisible()

  await page.getByRole('radio', { name: 'M' }).click()
  await page.getByRole('radio', { name: 'Rosa' }).click()
  await page.getByRole('spinbutton', { name: 'Cantidad' }).fill('2')
  await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  await expect(page.getByRole('status')).toHaveText('Agregado al carrito')

  await page.goto('/finalizar-pedido')
  await page.getByLabel('Nombre').fill('Ana')
  await page.getByLabel('Ciudad o zona').fill('Medellín')
  await page.getByRole('button', { name: 'Enviar pedido por WhatsApp' }).click()

  const link = page.getByRole('link', { name: 'Abrir WhatsApp de nuevo' })
  await expect(link).toBeVisible()
  const href = await link.getAttribute('href')
  expect(href).toBeTruthy()
  const url = new URL(href!)
  expect(url.hostname).toBe('wa.me')
  expect(url.pathname).toBe('/573001112233')
  const message = decodeURIComponent(url.searchParams.get('text') || '')
  expect(message).toContain('Ana')
  expect(message).toContain('Bata suave de casa')
  expect(message).toContain('2')
  expect(message.toLowerCase()).not.toContain('pedido confirmado')
})

test('un producto inexistente responde 404', async ({ page }) => {
  const response = await page.goto('/productos/no-existe')
  expect(response?.status()).toBe(404)
})
