import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  language: 'zh-CN' | 'en-US'
  autoSave: boolean
  autoSaveInterval: number // in seconds
  showPinnedFirst: boolean
  defaultCardColor: string
  defaultCardType: string
}

export interface StorageInfo {
  usedBytes: number
  maxBytes: number
  lastCleanup: number
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  fontSize: 'medium',
  language: 'zh-CN',
  autoSave: true,
  autoSaveInterval: 30,
  showPinnedFirst: true,
  defaultCardColor: 'yellow',
  defaultCardType: 'text'
}

export const useSettingStore = defineStore('setting', () => {
  // ========== State ==========
  const preferences = ref<UserPreferences>(loadPreferences())
  const storageInfo = ref<StorageInfo>({
    usedBytes: 0,
    maxBytes: 50 * 1024 * 1024, // 50MB default limit
    lastCleanup: 0
  })

  // ========== Getters ==========
  const themeClass = computed(() => {
    if (preferences.value.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return isDark ? 'dark' : 'light'
    }
    return preferences.value.theme
  })

  const storagePercentage = computed(() =>
    (storageInfo.value.usedBytes / storageInfo.value.maxBytes) * 100
  )

  const isStorageWarning = computed(() =>
    storagePercentage.value >= 80
  )

  const isStorageCritical = computed(() =>
    storagePercentage.value >= 95
  )

  // ========== Actions ==========
  function updatePreference<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) {
    preferences.value[key] = value
    savePreferences(preferences.value)

    if (key === 'theme') {
      applyTheme(value)
    }
  }

  function updatePreferences(newPrefs: Partial<UserPreferences>) {
    preferences.value = { ...preferences.value, ...newPrefs }
    savePreferences(preferences.value)

    if (newPrefs.theme) {
      applyTheme(newPrefs.theme)
    }
  }

  function resetPreferences() {
    preferences.value = DEFAULT_PREFERENCES
    savePreferences(DEFAULT_PREFERENCES)
    applyTheme(DEFAULT_PREFERENCES.theme)
  }

  function applyTheme(theme: 'dark' | 'light' | 'system') {
    const effectiveTheme = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme

    document.documentElement.setAttribute('data-theme', effectiveTheme)

    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }

  async function calculateStorageUsage() {
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate()
        storageInfo.value.usedBytes = estimate.usage || 0
        storageInfo.value.maxBytes = estimate.quota || 50 * 1024 * 1024
      } else {
        // Fallback: estimate from localStorage and IndexedDB
        const localStorageSize = calculateLocalStorageSize()
        storageInfo.value.usedBytes = localStorageSize
      }
    } catch (e) {
      console.error('无法计算存储使用量:', e)
    }
  }

  function calculateLocalStorageSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const value = localStorage.getItem(key)
        if (value) {
          total += key.length + value.length
        }
      }
    }
    return total * 2 // UTF-16 encoding
  }

  async function exportData(): Promise<string> {
    const data = {
      preferences: preferences.value,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    return JSON.stringify(data, null, 2)
  }

  async function importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData)
      if (data.preferences) {
        updatePreferences(data.preferences)
      }
      return true
    } catch (e) {
      console.error('导入数据失败:', e)
      return false
    }
  }

  async function clearStorageData(): Promise<void> {
    localStorage.clear()
    if (indexedDB.databases) {
      const databases = await indexedDB.databases()
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name)
        }
      }
    }
    storageInfo.value.usedBytes = 0
    storageInfo.value.lastCleanup = Date.now()
  }

  function initialize() {
    applyTheme(preferences.value.theme)
    calculateStorageUsage()

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (preferences.value.theme === 'system') {
        applyTheme('system')
      }
    })
  }

  return {
    // State
    preferences,
    storageInfo,
    // Getters
    themeClass,
    storagePercentage,
    isStorageWarning,
    isStorageCritical,
    // Actions
    updatePreference,
    updatePreferences,
    resetPreferences,
    applyTheme,
    calculateStorageUsage,
    exportData,
    importData,
    clearStorageData,
    initialize
  }
})

// ========== Helper Functions ==========
function loadPreferences(): UserPreferences {
  try {
    const saved = localStorage.getItem('miniAI-preferences')
    if (saved) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.error('加载偏好设置失败:', e)
  }
  return DEFAULT_PREFERENCES
}

function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem('miniAI-preferences', JSON.stringify(prefs))
  } catch (e) {
    console.error('保存偏好设置失败:', e)
  }
}