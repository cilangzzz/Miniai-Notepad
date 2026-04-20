import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BREAKPOINTS } from '@/constants'

/**
 * 响应式断点封装
 * 提供设备尺寸和断点检测功能
 */
export function useResponsive() {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)

  // Breakpoint computed
  const isMobile = computed(() => windowWidth.value < BREAKPOINTS.MOBILE)
  const isTablet = computed(() =>
    windowWidth.value >= BREAKPOINTS.MOBILE && windowWidth.value < BREAKPOINTS.TABLET
  )
  const isDesktop = computed(() => windowWidth.value >= BREAKPOINTS.TABLET)

  const currentBreakpoint = computed<'mobile' | 'tablet' | 'desktop'>(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  // Grid columns based on breakpoint
  const gridColumns = computed(() => {
    if (isMobile.value) return 1
    if (isTablet.value) return 2
    return 3 // or more for large desktop
  })

  // Layout type
  const layoutType = computed<'compact' | 'standard' | 'wide'>(() => {
    if (isMobile.value) return 'compact'
    if (isTablet.value) return 'standard'
    return 'wide'
  })

  // Sidebar visibility
  const showSidebar = computed(() => isDesktop.value)
  const showMobileDrawer = computed(() => isMobile.value)

  // Aspect ratio
  const aspectRatio = computed(() => windowWidth.value / windowHeight.value)
  const isPortrait = computed(() => aspectRatio.value < 1)
  const isLandscape = computed(() => aspectRatio.value >= 1)

  // Device type hints
  const isTouchDevice = computed(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0
  })

  // Handle resize
  function handleResize() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }

  // Initialize and cleanup
  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    // Dimensions
    windowWidth,
    windowHeight,

    // Breakpoints
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,

    // Layout
    gridColumns,
    layoutType,
    showSidebar,
    showMobileDrawer,

    // Orientation
    aspectRatio,
    isPortrait,
    isLandscape,

    // Device
    isTouchDevice,
  }
}

/**
 * 简化版响应式检测
 * 只返回关键断点信息
 */
export function useBreakpoint() {
  const breakpoint = ref<'mobile' | 'tablet' | 'desktop'>('desktop')

  function updateBreakpoint() {
    const width = window.innerWidth
    if (width < BREAKPOINTS.MOBILE) {
      breakpoint.value = 'mobile'
    } else if (width < BREAKPOINTS.TABLET) {
      breakpoint.value = 'tablet'
    } else {
      breakpoint.value = 'desktop'
    }
  }

  onMounted(() => {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint)
  })

  return {
    breakpoint,
    isMobile: computed(() => breakpoint.value === 'mobile'),
    isTablet: computed(() => breakpoint.value === 'tablet'),
    isDesktop: computed(() => breakpoint.value === 'desktop'),
  }
}

/**
 * 媒体查询封装
 * 使用 matchMedia API 进行精确的媒体查询
 */
export function useMediaQuery(query: string) {
  const matches = ref(false)
  const mediaQueryList = ref<MediaQueryList | null>(null)

  function updateMatches() {
    if (mediaQueryList.value) {
      matches.value = mediaQueryList.value.matches
    }
  }

  onMounted(() => {
    mediaQueryList.value = window.matchMedia(query)
    matches.value = mediaQueryList.value.matches
    mediaQueryList.value.addEventListener('change', updateMatches)
  })

  onUnmounted(() => {
    if (mediaQueryList.value) {
      mediaQueryList.value.removeEventListener('change', updateMatches)
    }
  })

  return {
    matches,
  }
}

/**
 * 预定义媒体查询
 */
export function usePresetMediaQueries() {
  const isMobileQuery = useMediaQuery(`(max-width: ${BREAKPOINTS.MOBILE - 1}px)`)
  const isTabletQuery = useMediaQuery(`(min-width: ${BREAKPOINTS.MOBILE}px) and (max-width: ${BREAKPOINTS.TABLET - 1}px)`)
  const isDesktopQuery = useMediaQuery(`(min-width: ${BREAKPOINTS.TABLET}px)`)
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const isLightMode = useMediaQuery('(prefers-color-scheme: light)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return {
    isMobile: isMobileQuery.matches,
    isTablet: isTabletQuery.matches,
    isDesktop: isDesktopQuery.matches,
    isDarkMode,
    isLightMode,
    prefersReducedMotion,
  }
}