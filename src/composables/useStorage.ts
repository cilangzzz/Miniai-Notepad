import { ref, computed, onMounted } from 'vue'
import { STORAGE_LIMITS } from '@/constants'
import { estimateStorageUsage, getStoragePercentage, localStorageUtil } from '@/utils'

/**
 * 存储容量追踪封装
 * 提供存储使用情况监控和管理功能
 */
export function useStorage() {
  const usedBytes = ref(0)
  const maxBytes = ref(STORAGE_LIMITS.INDEXEDDB_DEFAULT)
  const lastCleanup = ref(0)
  const isCalculating = ref(false)

  // Usage percentage
  const usagePercentage = computed(() => getStoragePercentage(usedBytes.value))

  // Warning states
  const isWarning = computed(() => usagePercentage.value >= 80)
  const isCritical = computed(() => usagePercentage.value >= 95)
  const isFull = computed(() => usagePercentage.value >= 100)

  // Available space
  const availableBytes = computed(() => maxBytes.value - usedBytes.value)
  const availablePercentage = computed(() => 100 - usagePercentage.value)

  /**
   * 计算存储使用量
   */
  async function calculateUsage() {
    isCalculating.value = true

    try {
      // 使用 Navigator.storage API（如果可用）
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate()
        usedBytes.value = estimate.usage ?? 0
        maxBytes.value = estimate.quota ?? STORAGE_LIMITS.INDEXEDDB_DEFAULT
      } else {
        // 回退方案：使用 localStorage 大小估算
        const localStorageSize = calculateLocalStorageSize()
        usedBytes.value = localStorageSize
      }
    } catch (error) {
      console.error('Failed to calculate storage usage:', error)
    } finally {
      isCalculating.value = false
    }
  }

  /**
   * 计算 localStorage 使用量
   */
  function calculateLocalStorageSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        const value = localStorage.getItem(key)
        if (value) {
          total += key.length + value.length
        }
      }
    }
    // UTF-16 编码，每个字符2字节
    return total * 2
  }

  /**
   * 估算实体数量可用的空间
   */
  function estimateAvailableEntities(): {
    notes: number
    categories: number
    tags: number
  } {
    const available = availableBytes.value

    return {
      notes: Math.floor(available / STORAGE_LIMITS.NOTE_SIZE_ESTIMATE),
      categories: Math.floor(available / STORAGE_LIMITS.CATEGORY_SIZE_ESTIMATE),
      tags: Math.floor(available / STORAGE_LIMITS.TAG_SIZE_ESTIMATE),
    }
  }

  /**
   * 清理过期数据
   */
  async function cleanupExpiredData() {
    // 实际清理逻辑需要调用各个 repository 的清理方法
    lastCleanup.value = Date.now()
    await calculateUsage()
  }

  /**
   * 检查是否可以写入指定大小的数据
   */
  function canWrite(size: number): boolean {
    return availableBytes.value >= size
  }

  /**
   * 获取存储状态描述
   */
  function getStatusDescription(): string {
    if (isFull.value) {
      return 'Storage is full. Please clean up data.'
    }
    if (isCritical.value) {
      return 'Storage is critically low. Consider cleaning up data.'
    }
    if (isWarning.value) {
      return 'Storage usage is high. Consider cleaning up old data.'
    }
    return `Storage usage: ${usagePercentage.value.toFixed(1)}%`
  }

  // Initialize on mount
  onMounted(() => {
    calculateUsage()
  })

  return {
    // State
    usedBytes,
    maxBytes,
    lastCleanup,
    isCalculating,

    // Computed
    usagePercentage,
    isWarning,
    isCritical,
    isFull,
    availableBytes,
    availablePercentage,

    // Actions
    calculateUsage,
    cleanupExpiredData,
    estimateAvailableEntities,
    canWrite,
    getStatusDescription,
  }
}

/**
 * LocalStorage 操作封装
 */
export function useLocalStorage() {
  const usage = computed(() => localStorageUtil.getUsage())

  /**
   * 获取存储项
   */
  function get<T>(key: string): T | null {
    return localStorageUtil.get<T>(key)
  }

  /**
   * 设置存储项
   */
  function set<T>(key: string, value: T): boolean {
    return localStorageUtil.set<T>(key, value)
  }

  /**
   * 移除存储项
   */
  function remove(key: string): void {
    localStorageUtil.remove(key)
  }

  /**
   * 清空所有存储
   */
  function clear(): void {
    localStorageUtil.clear()
  }

  /**
   * 检查键是否存在
   */
  function exists(key: string): boolean {
    return localStorage.getItem(key) !== null
  }

  return {
    usage,
    get,
    set,
    remove,
    clear,
    exists,
  }
}

/**
 * SessionStorage 操作封装
 */
export function useSessionStorage() {
  /**
   * 获取存储项
   */
  function get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return null
      return JSON.parse(item) as T
    } catch {
      return null
    }
  }

  /**
   * 设置存储项
   */
  function set<T>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  }

  /**
   * 移除存储项
   */
  function remove(key: string): void {
    sessionStorage.removeItem(key)
  }

  /**
   * 清空所有存储
   */
  function clear(): void {
    sessionStorage.clear()
  }

  /**
   * 检查键是否存在
   */
  function exists(key: string): boolean {
    return sessionStorage.getItem(key) !== null
  }

  return {
    get,
    set,
    remove,
    clear,
    exists,
  }
}