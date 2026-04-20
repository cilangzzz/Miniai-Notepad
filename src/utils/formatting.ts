/**
 * 格式化金额
 * @param amount - 金额数值
 * @param currency - 货币符号
 */
export function formatAmount(amount: number, currency?: string): string {
  const symbol = currency ?? '¥'
  return `${symbol}${amount.toFixed(2)}`
}

/**
 * 格式化金额（无小数）
 * @param amount - 金额数值
 */
export function formatAmountInt(amount: number): string {
  return `¥${Math.round(amount)}`
}

/**
 * 格式化百分比
 * @param value - 百分比数值
 * @param decimals - 小数位数
 */
export function formatPercent(value: number, decimals?: number): string {
  return `${value.toFixed(decimals ?? 1)}%`
}

/**
 * 格式化文件大小
 * @param bytes - 字节数
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)}GB`
}

/**
 * 格式化计数
 * @param count - 计数值
 * @param maxDisplay - 最大显示数
 */
export function formatCount(count: number, maxDisplay?: number): string {
  const max = maxDisplay ?? 99
  if (count <= max) return String(count)
  return `${max}+`
}

/**
 * 格式化标题（截断）
 * @param title - 标题
 * @param maxLength - 最大长度
 */
export function formatTitle(title: string, maxLength?: number): string {
  const max = maxLength ?? 50
  if (title.length <= max) return title
  return `${title.substring(0, max)}...`
}

/**
 * 格式化内容摘要
 * @param content - 内容
 * @param maxLength - 最大长度
 */
export function formatSummary(content: string, maxLength?: number): string {
  const max = maxLength ?? 100
  const stripped = content.replace(/\n/g, ' ').trim()
  if (stripped.length <= max) return stripped
  return `${stripped.substring(0, max)}...`
}

/**
 * 首字母大写
 * @param str - 字符串
 */
export function capitalize(str: string): string {
  if (str.length === 0) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 转换为slug格式
 * @param str - 字符串
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}