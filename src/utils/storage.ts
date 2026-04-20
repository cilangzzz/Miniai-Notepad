import { STORAGE_KEYS, STORAGE_LIMITS } from '../constants'

/**
 * LocalStorage 存储工具
 */
export const localStorageUtil = {
  /**
   * 获取存储项
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch {
      return null
    }
  },

  /**
   * 设置存储项
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },

  /**
   * 删除存储项
   */
  remove(key: string): void {
    localStorage.removeItem(key)
  },

  /**
   * 清空所有存储
   */
  clear(): void {
    localStorage.clear()
  },

  /**
   * 获取存储使用情况
   */
  getUsage(): { used: number; available: number } {
    let used = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        const value = localStorage.getItem(key)
        if (value) {
          used += key.length + value.length
        }
      }
    }
    // 估算可用空间（通常5MB限制）
    const available = 5 * 1024 * 1024 - used
    return { used, available }
  },
}

/**
 * 计算IndexedDB估算使用量
 * @param noteCount - 笔记数量
 * @param categoryCount - 分类数量
 * @param tagCount - 标签数量
 */
export function estimateStorageUsage(
  noteCount: number,
  categoryCount: number,
  tagCount: number
): number {
  return (
    noteCount * STORAGE_LIMITS.NOTE_SIZE_ESTIMATE +
    categoryCount * STORAGE_LIMITS.CATEGORY_SIZE_ESTIMATE +
    tagCount * STORAGE_LIMITS.TAG_SIZE_ESTIMATE
  )
}

/**
 * 获取存储百分比
 * @param used - 已使用字节
 */
export function getStoragePercentage(used: number): number {
  const total = STORAGE_LIMITS.INDEXEDDB_DEFAULT
  return Math.min(100, Math.round((used / total) * 100))
}