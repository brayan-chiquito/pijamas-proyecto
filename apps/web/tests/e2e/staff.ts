import { expect, type APIRequestContext } from '@playwright/test'

export async function staffAuth(request: APIRequestContext): Promise<{ Authorization: string }> {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  expect(email, 'SEED_ADMIN_EMAIL').toBeTruthy()
  expect(password, 'SEED_ADMIN_PASSWORD').toBeTruthy()
  const login = await request.post('/api/users/login', { data: { email, password } })
  expect(login.ok(), await login.text()).toBe(true)
  const body = (await login.json()) as { token?: string }
  expect(body.token).toBeTruthy()
  return { Authorization: `JWT ${body.token}` }
}
