/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / (60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))

  if (minutes < 1) return 'JUST NOW'
  if (minutes < 60) return `${minutes} MIN AGO`
  if (hours < 24) return `${hours} HOUR${hours > 1 ? 'S' : ''} AGO`
  if (days < 7) return `${days} DAY${days > 1 ? 'S' : ''} AGO`

  return formatDate(timestamp)
}

/**
 * Format absolute date (e.g., "2026-04-20")
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Sanitize HTML content (basic implementation)
 * Production should use DOMPurify
 */
export function sanitizeHtml(html: string): string {
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form']
  const dangerousAttrs = ['onclick', 'onload', 'onerror', 'onmouseover']

  let sanitized = html

  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  dangerousAttrs.forEach(attr => {
    const regex = new RegExp(`${attr}="[^"]*"`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  return sanitized
}

/**
 * Truncate content
 */
export function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) return content
  return content.slice(0, maxLength) + '...'
}