import { expect, test, type APIRequestContext, type Page } from '@playwright/test'

import { staffAuth } from './staff'

async function login(page: Page) {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  expect(email, 'SEED_ADMIN_EMAIL').toBeTruthy()
  expect(password, 'SEED_ADMIN_PASSWORD').toBeTruthy()
  await page.goto('/admin/login')
  await page.locator('input[name="email"]').fill(email!)
  await page.locator('input[name="password"]').fill(password!)
  await page.locator('button[type="submit"]').click()
  await expect(page).toHaveURL(/\/admin(?!\/login)/)
  return staffAuth(page.request)
}

async function json<T>(response: Awaited<ReturnType<APIRequestContext['get']>>): Promise<T> {
  expect(response.ok(), await response.text()).toBe(true)
  return response.json() as Promise<T>
}

test('el panel publica un borrador y la tienda lo muestra', async ({ page, browser, baseURL }) => {
  const slug = `pijama-e2e-${Date.now()}`
  const title = 'Pijama de prueba e2e'
  let productId: number | null = null
  let auth: { Authorization: string } | null = null

  try {
    auth = await login(page)
    const categories = await json<{ docs: { id: number }[] }>(
      await page.request.get('/api/categories?limit=1&depth=0', { headers: auth }),
    )
    const media = await json<{ docs: { id: number }[] }>(await page.request.get('/api/media?limit=1&depth=0'))
    const categoryId = categories.docs[0]?.id
    const mediaId = media.docs[0]?.id
    expect(categoryId).toBeTruthy()
    expect(mediaId).toBeTruthy()

    const createdBody = await json<{ doc?: { id: number }; id?: number }>(
      await page.request.post('/api/products?draft=true', {
        headers: auth,
        data: {
          title,
          slug,
          price: 45000,
          category: categoryId,
          inventoryMode: 'simple',
          stock: 3,
          _status: 'draft',
        },
      }),
    )
    productId = createdBody.doc?.id ?? createdBody.id ?? null
    expect(productId).toBeTruthy()

    const guest = await browser.newContext({ baseURL })
    const hidden = await guest.newPage()
    const missing = await hidden.goto(`/productos/${slug}`)
    expect(missing?.status()).toBe(404)
    await guest.close()

    await page.goto(`/next/preview?path=${encodeURIComponent(`/productos/${slug}`)}`)
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible()

    await json(
      await page.request.patch(`/api/products/${productId}`, {
        headers: auth,
        data: {
          _status: 'published',
          images: [{ image: mediaId }],
        },
      }),
    )

    const visitor = await browser.newContext({ baseURL })
    const published = await visitor.newPage()
    await published.goto(`/productos/${slug}`)
    await expect(published.getByRole('heading', { level: 1, name: title })).toBeVisible()
    await visitor.close()
  } finally {
    if (productId && auth) {
      const removed = await page.request.delete(`/api/products/${productId}`, { headers: auth })
      expect(removed.ok(), await removed.text()).toBe(true)
    }
  }
})
