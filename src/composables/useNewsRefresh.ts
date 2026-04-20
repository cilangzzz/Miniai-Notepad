import { ref, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 下拉刷新封装
 * 用于新闻列表的下拉刷新功能
 */
export interface PullRefreshOptions {
  /** 下拉开始回调 */
  onPullStart?: () => void
  /** 下拉过程中回调（距离） */
  onPull?: (distance: number) => void
  /** 下拉结束回调 */
  onPullEnd?: () => void
  /** 刷新触发回调 */
  onRefresh: () => Promise<void> | void
  /** 刷新触发距离阈值 */
  threshold?: number
  /** 最大下拉距离 */
  maxDistance?: number
}

export function useNewsRefresh(
  containerRef: Ref<HTMLElement | null>,
  options: PullRefreshOptions
) {
  const {
    onPullStart,
    onPull,
    onPullEnd,
    onRefresh,
    threshold = 80,
    maxDistance = 150,
  } = options

  const isPulling = ref(false)
  const startY = ref(0)
  const currentY = ref(0)
  const pullDistance = ref(0)
  const isRefreshing = ref(false)
  const canRefresh = ref(false)

  /**
   * 触摸开始
   */
  function handleTouchStart(e: TouchEvent) {
    if (isRefreshing.value) return

    const container = containerRef.value
    if (!container) return

    // 只有在滚动到顶部时才允许下拉
    if (container.scrollTop === 0) {
      startY.value = e.touches[0].clientY
      isPulling.value = true
      onPullStart?.()
    }
  }

  /**
   * 触摸移动
   */
  function handleTouchMove(e: TouchEvent) {
    if (!isPulling.value || isRefreshing.value) return

    currentY.value = e.touches[0].clientY
    const distance = currentY.value - startY.value

    // 只处理向下拉（正值）
    if (distance > 0) {
      // 限制最大距离
      pullDistance.value = Math.min(distance, maxDistance)
      canRefresh.value = pullDistance.value >= threshold
      onPull?.(pullDistance.value)
    }
  }

  /**
   * 触摸结束
   */
  async function handleTouchEnd() {
    if (!isPulling.value) return

    // 如果超过阈值，触发刷新
    if (canRefresh.value && !isRefreshing.value) {
      isRefreshing.value = true
      try {
        await onRefresh()
      } finally {
        isRefreshing.value = false
      }
    }

    // 重置状态
    isPulling.value = false
    startY.value = 0
    currentY.value = 0
    pullDistance.value = 0
    canRefresh.value = false
    onPullEnd?.()
  }

  /**
   * 初始化下拉刷新监听
   */
  function initPullRefresh() {
    const container = containerRef.value
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)
  }

  /**
   * 清理下拉刷新监听
   */
  function destroyPullRefresh() {
    const container = containerRef.value
    if (!container) return

    container.removeEventListener('touchstart', handleTouchStart)
    container.removeEventListener('touchmove', handleTouchMove)
    container.removeEventListener('touchend', handleTouchEnd)
  }

  /**
   * 手动触发刷新
   */
  async function manualRefresh() {
    if (isRefreshing.value) return

    isRefreshing.value = true
    try {
      await onRefresh()
    } finally {
      isRefreshing.value = false
    }
  }

  // 自动初始化和清理
  onMounted(() => {
    initPullRefresh()
  })

  onUnmounted(() => {
    destroyPullRefresh()
  })

  return {
    initPullRefresh,
    destroyPullRefresh,
    manualRefresh,
    isPulling,
    pullDistance,
    isRefreshing,
    canRefresh,
  }
}

/**
 * 简化版下拉刷新（基于滚动位置）
 */
export interface ScrollRefreshOptions {
  onRefresh: () => Promise<void> | void
  disabled?: Ref<boolean>
}

export function useScrollRefresh(options: ScrollRefreshOptions) {
  const { onRefresh, disabled } = options

  const isRefreshing = ref(false)
  const containerRef = ref<HTMLElement | null>(null)

  /**
   * 处理滚动到顶部
   */
  async function handleScrollToTop() {
    if (disabled?.value || isRefreshing.value) return

    isRefreshing.value = true
    try {
      await onRefresh()
    } finally {
      isRefreshing.value = false
    }
  }

  /**
   * 设置容器元素
   */
  function setContainer(el: HTMLElement | null) {
    containerRef.value = el
  }

  /**
   * 手动刷新
   */
  async function refresh() {
    await handleScrollToTop()
  }

  return {
    isRefreshing,
    setContainer,
    refresh,
  }
}