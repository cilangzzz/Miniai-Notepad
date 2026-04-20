import { TIME_CONSTANTS } from '../constants'

/**
 * 日期格式化选项
 */
interface FormatOptions {
  format?: 'short' | 'long' | 'full'
  locale?: string
}

/**
 * 格式化日期
 * @param date - 日期对象或时间戳
 * @param options - 格式化选项
 */
export function formatDate(date: Date | number, options?: FormatOptions): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const format = options?.format ?? 'short'
  const locale = options?.locale ?? 'zh-CN'

  const formatMap: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
  }

  return d.toLocaleDateString(locale, formatMap[format])
}

/**
 * 格式化时间
 * @param date - 日期对象或时间戳
 * @param includeSeconds - 是否包含秒
 */
export function formatTime(date: Date | number, includeSeconds?: boolean): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
  }
  return d.toLocaleTimeString('zh-CN', options)
}

/**
 * 格式化相对时间
 * @param date - 日期对象或时间戳
 */
export function formatRelativeTime(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const now = Date.now()
  const diff = now - d.getTime()

  if (diff < TIME_CONSTANTS.MINUTE) {
    return '刚刚'
  }
  if (diff < TIME_CONSTANTS.HOUR) {
    const minutes = Math.floor(diff / TIME_CONSTANTS.MINUTE)
    return `${minutes}分钟前`
  }
  if (diff < TIME_CONSTANTS.DAY) {
    const hours = Math.floor(diff / TIME_CONSTANTS.HOUR)
    return `${hours}小时前`
  }
  if (diff < TIME_CONSTANTS.WEEK) {
    const days = Math.floor(diff / TIME_CONSTANTS.DAY)
    return `${days}天前`
  }

  return formatDate(d)
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param date - 日期对象或时间戳
 */
export function formatDateISO(date: Date | number): string {
  const d = typeof date === 'number' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * 判断是否是今天
 * @param date - 日期对象或时间戳
 */
export function isToday(date: Date | number): boolean {
  const d = typeof date === 'number' ? new Date(date) : date
  const today = new Date()
  return d.getFullYear() === today.getFullYear()
    && d.getMonth() === today.getMonth()
    && d.getDate() === today.getDate()
}

/**
 * 获取月份范围
 * @param date - 日期对象或时间戳
 */
export function getMonthRange(date: Date | number): { start: Date; end: Date } {
  const d = typeof date === 'number' ? new Date(date) : date
  const start = new Date(d.getFullYear(), d.getMonth(), 1)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
  return { start, end }
}