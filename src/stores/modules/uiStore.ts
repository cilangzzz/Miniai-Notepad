import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration: number
  visible: boolean
}

export interface ModalState {
  id: string
  type: string
  title?: string
  content?: string
  data?: Record<string, unknown>
  visible: boolean
}

export interface NavigationState {
  currentRoute: string
  previousRoute: string | null
  title: string
  showBackButton: boolean
}

const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1024
} as const

export const useUiStore = defineStore('ui', () => {
  // ========== State ==========
  const navigation = ref<NavigationState>({
    currentRoute: '/',
    previousRoute: null,
    title: 'MiniAI记事本',
    showBackButton: false
  })

  const theme = ref<'dark' | 'light'>('dark')

  const modals = ref<ModalState[]>([])

  const toasts = ref<ToastMessage[]>([])

  const isMobileDrawerOpen = ref(false)

  const windowWidth = ref(window.innerWidth)

  const isOnline = ref(navigator.onLine)

  // ========== Getters ==========
  const isMobile = computed(() => windowWidth.value < BREAKPOINTS.MOBILE)

  const isTablet = computed(() =>
    windowWidth.value >= BREAKPOINTS.MOBILE &&
    windowWidth.value < BREAKPOINTS.DESKTOP
  )

  const isDesktop = computed(() => windowWidth.value >= BREAKPOINTS.DESKTOP)

  const currentBreakpoint = computed<'mobile' | 'tablet' | 'desktop'>(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })

  const gridColumns = computed(() => {
    if (isMobile.value) return 1
    if (isTablet.value) return 2
    return 3
  })

  const activeModal = computed(() =>
    modals.value.find(m => m.visible)
  )

  const hasVisibleToasts = computed(() =>
    toasts.value.some(t => t.visible)
  )

  // ========== Actions ==========
  function setTheme(newTheme: 'dark' | 'light') {
    theme.value = newTheme
    document.documentElement.setAttribute('data-theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  function updateNavigation(route: string, title: string, showBack: boolean = false) {
    navigation.value.previousRoute = navigation.value.currentRoute
    navigation.value.currentRoute = route
    navigation.value.title = title
    navigation.value.showBackButton = showBack
  }

  function showModal(
    type: string,
    options: { title?: string; content?: string; data?: Record<string, unknown> } = {}
  ) {
    const id = `modal-${Date.now()}`
    const modal: ModalState = {
      id,
      type,
      title: options.title,
      content: options.content,
      data: options.data,
      visible: true
    }
    modals.value.push(modal)
    return id
  }

  function closeModal(id?: string) {
    if (id) {
      const modal = modals.value.find(m => m.id === id)
      if (modal) {
        modal.visible = false
        modals.value = modals.value.filter(m => m.id !== id)
      }
    } else {
      // Close the active modal
      const active = activeModal.value
      if (active) {
        active.visible = false
        modals.value = modals.value.filter(m => m.id !== active.id)
      }
    }
  }

  function closeAllModals() {
    modals.value = []
  }

  function showToast(
    message: string,
    type: ToastMessage['type'] = 'info',
    duration: number = 3000
  ) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    const toast: ToastMessage = {
      id,
      message,
      type,
      duration,
      visible: true
    }
    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: string) {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      toast.visible = false
      setTimeout(() => {
        toasts.value = toasts.value.filter(t => t.id !== id)
      }, 300) // Animation time
    }
  }

  function clearToasts() {
    toasts.value = []
  }

  function openMobileDrawer() {
    isMobileDrawerOpen.value = true
  }

  function closeMobileDrawer() {
    isMobileDrawerOpen.value = false
  }

  function toggleMobileDrawer() {
    isMobileDrawerOpen.value = !isMobileDrawerOpen.value
  }

  function updateWindowWidth(width: number) {
    windowWidth.value = width
  }

  function updateOnlineStatus(online: boolean) {
    isOnline.value = online
    if (!online) {
      showToast('网络连接已断开', 'warning', 0)
    } else {
      showToast('网络连接已恢复', 'success')
    }
  }

  function initialize() {
    // Initialize window width
    updateWindowWidth(window.innerWidth)

    // Listen for window resize
    window.addEventListener('resize', () => {
      updateWindowWidth(window.innerWidth)
    })

    // Listen for online/offline status
    window.addEventListener('online', () => updateOnlineStatus(true))
    window.addEventListener('offline', () => updateOnlineStatus(false))

    // Apply initial theme
    setTheme(theme.value)
  }

  return {
    // State
    navigation,
    theme,
    modals,
    toasts,
    isMobileDrawerOpen,
    windowWidth,
    isOnline,
    // Getters
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    gridColumns,
    activeModal,
    hasVisibleToasts,
    // Actions
    setTheme,
    updateNavigation,
    showModal,
    closeModal,
    closeAllModals,
    showToast,
    removeToast,
    clearToasts,
    openMobileDrawer,
    closeMobileDrawer,
    toggleMobileDrawer,
    updateWindowWidth,
    updateOnlineStatus,
    initialize
  }
})