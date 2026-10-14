import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'media')
const stamp = new Date().toISOString().slice(0, 10)
const target = path.join(root, '..', '..', 'backups', `media-${stamp}`)

await mkdir(target, { recursive: true })
await cp(source, target, { recursive: true, force: true })
console.info(`Imágenes copiadas en ${target}`)
