import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 无限滚动封装
 * 用于新闻列表的无限滚动加载功能
 */
export interface InfiniteScrollOptions {
  /** 加载更多回调 */
  onLoadMore: () => Promise<void> | void
  /** 禁用条件 */
  disabled: Ref<boolean>
  /** 触发距离（距离底部的像素） */
  threshold?: number
  /** 是否立即开始观察 */
  immediate?: boolean
}

export function useNewsInfinite(
  triggerRef: Ref<HTMLElement | null>,
  options: InfiniteScrollOptions
) {
  const { onLoadMore, disabled, threshold = 100, immediate = true } = options

  const observer = ref<IntersectionObserver | null>(null)
  const isLoading = ref(false)

  /**
   * 开始观察触发元素
   */
  function observe() {
    if (!triggerRef.value) return

    observer.value = new IntersectionObserver(
      async (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && !disabled.value && !isLoading.value) {
          isLoading.value = true
          try {
            await onLoadMore()
          } finally {
            isLoading.value = false
          }
        }
      },
      {
        rootMargin: `${threshold}px`,
        threshold: 0,
      }
    )

    observer.value.observe(triggerRef.value)
  }

  /**
   * 停止观察
   */
  function disconnect() {
    if (observer.value) {
      observer.value.disconnect()
      observer.value = null
    }
  }

  /**
   * 重新开始观察
   */
  function reobserve() {
    disconnect()
    observe()
  }

  /**
   * 强制加载（手动触发）
   */
  async function forceLoad() {
    if (!disabled.value && !isLoading.value) {
      isLoading.value = true
      try {
        await onLoadMore()
      } finally {
        isLoading.value = false
      }
    }
  }

  // 自动初始化
  onMounted(() => {
    if (immediate) {
      observe()
    }
  })

  // 自动清理
  onUnmounted(() => {
    disconnect()
  })

  return {
    observe,
    disconnect,
    reobserve,
    forceLoad,
    isLoading,
  }
}

/**
 * 简化版无限滚动
 * 监听滚动位置，接近底部时触发加载
 */
export interface ScrollInfiniteOptions {
  onLoadMore: () => Promise<void> | void
  disabled?: Ref<boolean>
  threshold?: number
}

export function useScrollInfinite(options: ScrollInfiniteOptions) {
  const { onLoadMore, disabled, threshold = 200 } = options

  const isLoading = ref(false)
  const containerRef = ref<HTMLElement | null>(null)

  /**
   * 处理滚动事件
   */
  async function handleScroll(event: Event) {
    if (disabled?.value || isLoading.value) return

    const target = event.target as HTMLElement
    const scrollTop = target.scrollTop
    const scrollHeight = target.scrollHeight
    const clientHeight = target.clientHeight

    // 距离底部的距离
    const distanceToBottom = scrollHeight - scrollTop - clientHeight

    if (distanceToBottom <= threshold) {
      isLoading.value = true
      try {
        await onLoadMore()
      } finally {
        isLoading.value = false
      }
    }
  }

  /**
   * 设置容器元素
   */
  function setContainer(el: HTMLElement | null) {
    containerRef.value = el
    if (el) {
      el.addEventListener('scroll', handleScroll)
    }
  }

  // 清理
  onUnmounted(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll)
    }
  })

  return {
    isLoading,
    setContainer,
  }
}