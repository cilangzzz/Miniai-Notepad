/**
 * 生成UUID
 * 使用 crypto.randomUUID 或 fallback
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 生成短ID
 * 用于非关键场景
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 11)
}

/**
 * 生成带前缀的ID
 * @param prefix - ID前缀
 */
export function generateId(prefix: string): string {
  return `${prefix}-${generateShortId()}`
}