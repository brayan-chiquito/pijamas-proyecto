import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const routes = ['/', '/productos', '/productos/bata-suave-de-casa', '/carrito', '/finalizar-pedido']

for (const route of routes) {
  test(`sin fallos graves de accesibilidad en ${route}`, async ({ page }) => {
    await page.goto(route)
    const results = await new AxeBuilder({ page }).analyze()
    const serious = results.violations.filter((item) => item.impact === 'serious' || item.impact === 'critical')
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([])
  })
}
