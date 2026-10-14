import type { Access } from 'payload'

type Role = 'admin' | 'editor'

function roleOf(user: { role?: string | null } | null | undefined): Role | null {
  if (user?.role === 'admin' || user?.role === 'editor') return user.role
  return null
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const adminOnly: Access = ({ req }) => roleOf(req.user) === 'admin'

export const staff: Access = ({ req }) => roleOf(req.user) !== null

/** Público solo ve publicados; el personal ve borradores. */
export const publishedOrStaff: Access = ({ req }) => {
  if (roleOf(req.user)) return true
  return { _status: { equals: 'published' } }
}

export const readUsers: Access = ({ req }) => {
  if (roleOf(req.user) === 'admin') return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

export const updateUsers: Access = ({ req }) => {
  if (roleOf(req.user) === 'admin') return true
  if (req.user) return { id: { equals: req.user.id } }
  return false
}

export function isAdmin(user: { role?: string | null } | null | undefined): boolean {
  return roleOf(user) === 'admin'
}
