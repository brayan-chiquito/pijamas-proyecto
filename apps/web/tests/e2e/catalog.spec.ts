import { expect, test } from '@playwright/test'

test('los filtros no se indexan y el canonical vuelve al catálogo', async ({ page }) => {
  await page.goto('/productos?talla=M&orden=precio-asc')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/productos$/)
})

test('la página 2 del catálogo conserva su propio canonical', async ({ page }) => {
  await page.goto('/productos?page=2')
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/productos\?page=2$/)
})

test('el selector de talla se usa con el teclado', async ({ page }) => {
  await page.goto('/productos/bata-suave-de-casa')
  const medium = page.getByRole('radio', { name: 'M' })
  await medium.focus()
  await page.keyboard.press('Enter')
  await expect(medium).toHaveAttribute('aria-checked', 'true')
})

test('la talla agotada queda deshabilitada', async ({ page }) => {
  await page.goto('/productos/bata-suave-de-casa')
  const large = page.getByRole('radio', { name: /L/ })
  await expect(large).toBeDisabled()
  await expect(large).toContainText('Agotado')
})

test('la imagen para compartir mide 1200 por 630', async ({ page }) => {
  const sharp = (await import('sharp')).default
  for (const route of ['/', '/productos/bata-suave-de-casa']) {
    await page.goto(route)
    const href = await page.locator('meta[property="og:image"]').first().getAttribute('content')
    expect(href).toBeTruthy()
    const imageUrl = new URL(href!)
    const response = await page.request.get(`${imageUrl.pathname}${imageUrl.search}`)
    expect(response.ok()).toBe(true)
    const meta = await sharp(Buffer.from(await response.body())).metadata()
    expect(meta.width).toBe(1200)
    expect(meta.height).toBe(630)
  }
})
