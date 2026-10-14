import type { ReactNode } from 'react'

type Node = {
  type: string
  text?: string
  format?: number | string
  tag?: string
  url?: string
  children?: Node[]
}

function renderText(node: Node, key: number) {
  const format = typeof node.format === 'number' ? node.format : 0
  let content: ReactNode = node.text ?? ''
  if (format & 1) content = <strong key={key}>{content}</strong>
  if (format & 2) content = <em key={key}>{content}</em>
  return <span key={key}>{content}</span>
}

function renderNode(node: Node, key: number): ReactNode {
  const children = node.children?.map((child, index) => renderNode(child, index))
  switch (node.type) {
    case 'text':
      return renderText(node, key)
    case 'linebreak':
      return <br key={key} />
    case 'link':
    case 'autolink': {
      const external = (node.url ?? '').startsWith('http')
      return (
        <a
          key={key}
          href={node.url}
          className="text-plum-700 underline"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      )
    }
    case 'heading': {
      const Tag = node.tag === 'h3' ? 'h3' : 'h2'
      return (
        <Tag key={key} className="mt-6 font-display text-2xl">
          {children}
        </Tag>
      )
    }
    case 'list':
      return node.tag === 'ol' ? (
        <ol key={key} className="mt-3 list-decimal space-y-1 pl-5">
          {children}
        </ol>
      ) : (
        <ul key={key} className="mt-3 list-disc space-y-1 pl-5">
          {children}
        </ul>
      )
    case 'listitem':
      return <li key={key}>{children}</li>
    case 'paragraph':
      return (
        <p key={key} className="mt-3 leading-relaxed text-ink-900">
          {children}
        </p>
      )
    default:
      return <div key={key}>{children}</div>
  }
}

export function RichText({ data }: { data: unknown }) {
  const children = (data as { root?: { children?: Node[] } } | null)?.root?.children
  if (!children || children.length === 0) return null
  return <div className="max-w-prose">{children.map((node, index) => renderNode(node, index))}</div>
}
