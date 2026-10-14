export const catalogTags = {
  products: 'products',
  product: (slug: string) => `product:${slug}`,
  categories: 'categories',
  collections: 'collections',
  pages: 'pages',
  faqs: 'faqs',
  settings: 'settings',
  navigation: 'navigation',
  home: 'home',
  sizeGuide: 'size-guide',
} as const
