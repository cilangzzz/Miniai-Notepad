/**
 * HTML 安全处理工具
 * 用于富文本内容的截断和净化
 */

/** 允许的安全 HTML 标签 */
const SAFE_TAGS = ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'span', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'code']

/**
 * 移除 HTML 标签，获取纯文本
 * @param html HTML 内容
 * @returns 纯文本内容
 */
export function stripHtml(html: string): string {
  if (!html) return ''

  // 创建临时 DOM 元素来解析 HTML
  const temp = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')

  return temp.trim()
}

/**
 * 安全截断 HTML 内容
 * 截断纯文本部分，但保持 HTML 结构完整
 * @param html HTML 内容
 * @param maxLength 最大长度
 * @returns 截断后的 HTML
 */
export function truncateHtml(html: string, maxLength: number): string {
  if (!html || html.length <= maxLength) return html

  // 简化处理：先转换为纯文本截断，再重新包裹
  const text = stripHtml(html)
  if (text.length <= maxLength) return html

  const truncatedText = text.slice(0, maxLength) + '...'

  // 如果原文是简单段落，保留 p 标签
  if (html.startsWith('<p>') && html.endsWith('</p>')) {
    return `<p>${truncatedText}</p>`
  }

  return truncatedText
}

/**
 * 净化 HTML，移除不安全的标签和属性
 * @param html HTML 内容
 * @returns 安全的 HTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''

  // 简单的正则净化（生产环境建议使用 DOMPurify）
  let result = html

  // 移除 script 标签
  result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

  // 移除 style 标签
  result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

  // 移除事件属性
  result = result.replace(/on\w+="[^"]*"/gi, '')
  result = result.replace(/on\w+='[^']*'/gi, '')

  // 移除不安全标签（保留安全标签）
  const unsafeTagPattern = /<(\/?)(\w+)[^>]*>/g
  result = result.replace(unsafeTagPattern, (match, _isClosing, tagName) => {
    if (SAFE_TAGS.includes(tagName.toLowerCase())) {
      return match
    }
    return ''
  })

  return result
}

/**
 * 检查内容是否为 HTML 格式
 * @param content 内容
 * @returns 是否为 HTML
 */
export function isHtmlContent(content: string): boolean {
  if (!content) return false
  return content.includes('<') && content.includes('>')
}

/**
 * 安全渲染内容（自动判断纯文本或 HTML）
 * @param content 内容
 * @param maxLength 最大长度（可选）
 * @returns 安全的内容
 */
export function safeRenderContent(content: string, maxLength?: number): string {
  if (!content) return ''

  const isHtml = isHtmlContent(content)

  if (maxLength) {
    if (isHtml) {
      return sanitizeHtml(truncateHtml(content, maxLength))
    }
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '')
  }

  if (isHtml) {
    return sanitizeHtml(content)
  }

  return content
}