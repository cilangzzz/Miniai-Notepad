import { ref, computed, onUnmounted } from 'vue'
import { useUiStore } from '@/stores'

/**
 * Toast消息封装
 * 提供便捷的消息提示功能
 */
export interface ToastOptions {
  /** 消息内容 */
  message: string
  /** 消息类型 */
  type?: 'success' | 'error' | 'warning' | 'info'
  /** 显示时长（毫秒），0表示不自动关闭 */
  duration?: number
}

/**
 * 基于UI Store的Toast封装
 */
export function useToast() {
  const uiStore = useUiStore()

  // Computed
  const toasts = computed(() => uiStore.toasts)
  const hasVisibleToasts = computed(() => uiStore.hasVisibleToasts)

  /**
   * 显示成功消息
   */
  function success(message: string, duration?: number) {
    return uiStore.showToast(message, 'success', duration ?? 3000)
  }

  /**
   * 显示错误消息
   */
  function error(message: string, duration?: number) {
    return uiStore.showToast(message, 'error', duration ?? 5000)
  }

  /**
   * 显示警告消息
   */
  function warning(message: string, duration?: number) {
    return uiStore.showToast(message, 'warning', duration ?? 4000)
  }

  /**
   * 显示信息消息
   */
  function info(message: string, duration?: number) {
    return uiStore.showToast(message, 'info', duration ?? 3000)
  }

  /**
   * 显示自定义消息
   */
  function show(options: ToastOptions): string {
    return uiStore.showToast(options.message, options.type ?? 'info', options.duration ?? 3000)
  }

  /**
   * 移除指定消息
   */
  function remove(id: string) {
    uiStore.removeToast(id)
  }

  /**
   * 清空所有消息
   */
  function clear() {
    uiStore.clearToasts()
  }

  return {
    toasts,
    hasVisibleToasts,
    success,
    error,
    warning,
    info,
    show,
    remove,
    clear,
  }
}

/**
 * 独立Toast管理（不依赖UI Store）
 * 用于组件内部的独立消息管理
 */
export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  visible: boolean
}

export function useLocalToast() {
  const toasts = ref<ToastItem[]>([])
  const hasVisibleToasts = computed(() => toasts.value.some(t => t.visible))

  /**
   * 生成唯一ID
   */
  function generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  }

  /**
   * 添加消息
   */
  function addToast(message: string, type: ToastItem['type'] = 'info', duration: number = 3000): string {
    const id = generateId()
    const toast: ToastItem = {
      id,
      message,
      type,
      duration,
      visible: true,
    }

    toasts.value.push(toast)

    // 自动移除
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  /**
   * 移除消息
   */
  function removeToast(id: string) {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.visible = false
      // 延迟移除（动画时间）
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300)
    }
  }

  /**
   * 清空所有消息
   */
  function clearToasts() {
    toasts.value = []
  }

  /**
   * 快捷方法
   */
  function success(message: string, duration?: number) {
    return addToast(message, 'success', duration ?? 3000)
  }

  function error(message: string, duration?: number) {
    return addToast(message, 'error', duration ?? 5000)
  }

  function warning(message: string, duration?: number) {
    return addToast(message, 'warning', duration ?? 4000)
  }

  function info(message: string, duration?: number) {
    return addToast(message, 'info', duration ?? 3000)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    clearToasts()
  })

  return {
    toasts,
    hasVisibleToasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  }
}

/**
 * Promise结果Toast封装
 * 自动根据Promise结果显示成功/错误消息
 */
export function usePromiseToast() {
  const toast = useToast()
  const isLoading = ref(false)

  /**
   * 执行Promise并自动显示消息
   */
  async function withToast<T>(
    promise: Promise<T>,
    options: {
      successMessage?: string
      errorMessage?: string
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
    } = {}
  ): Promise<T | null> {
    isLoading.value = true

    try {
      const result = await promise
      if (options.successMessage) {
        toast.success(options.successMessage)
      }
      options.onSuccess?.(result)
      return result
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e))
      toast.error(options.errorMessage ?? error.message)
      options.onError?.(error)
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    withToast,
  }
}