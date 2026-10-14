import { expect, test } from '@playwright/test'

import { staffAuth } from './staff'

const slug = 'pijama-estampado-rojo'
const changedPrice = 101900

test('el carrito avisa cuando el precio cambió', async ({ page }) => {
  await page.goto(`/productos/${slug}`)
  await page.getByRole('radio', { name: 'M' }).click()
  await page.getByRole('radio', { name: 'Rosa' }).click()
  await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  await expect(page.getByRole('status')).toHaveText('Agregado al carrito')

  const auth = await staffAuth(page.request)
  const listed = await page.request.get(`/api/products?where[slug][equals]=${slug}&limit=1&depth=0`, {
    headers: auth,
  })
  expect(listed.ok()).toBe(true)
  const product = (await listed.json()).docs[0] as { id: number; price: number }
  const original = product.price

  try {
    const updated = await page.request.patch(`/api/products/${product.id}`, {
      headers: auth,
      data: { price: changedPrice, _status: 'published' },
    })
    expect(updated.ok(), await updated.text()).toBe(true)

    await page.goto('/carrito')
    await expect(page.getByRole('status')).toContainText('algún precio')
    await expect(page.getByText('101.900').first()).toBeVisible()
  } finally {
    const again = await staffAuth(page.request)
    const restored = await page.request.patch(`/api/products/${product.id}`, {
      headers: again,
      data: { price: original, _status: 'published' },
    })
    expect(restored.ok(), await restored.text()).toBe(true)
  }
})
