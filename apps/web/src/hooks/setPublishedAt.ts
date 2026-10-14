import type { CollectionBeforeChangeHook } from 'payload'

export const setPublishedAt: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  if (!data) return data
  const status = data._status
  const wasPublished = originalDoc?._status === 'published'
  if (status === 'published' && !wasPublished && !data.publishedAt) {
    data.publishedAt = new Date().toISOString()
  }
  return data
}
