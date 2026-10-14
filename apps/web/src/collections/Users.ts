import type { CollectionConfig } from 'payload'

import { adminOnly, readUsers, updateUsers } from '@/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
    description: 'Personas que pueden entrar al panel. El rol administrador gestiona usuarios.',
  },
  auth: {
    tokenExpiration: 60 * 60 * 2,
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    create: adminOnly,
    read: readUsers,
    update: updateUsers,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: {
        description:
          'El editor gestiona catálogo y contenido. El administrador también gestiona usuarios y roles.',
      },
    },
  ],
}
