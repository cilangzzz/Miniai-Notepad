import { APP_NAME, APP_VERSION, APP_TITLE, BREAKPOINTS, PAGINATION, CHAR_LIMITS } from '../constants'

/**
 * 应用配置
 */
export const appConfig = {
  name: APP_NAME,
  version: APP_VERSION,
  title: APP_TITLE,

  breakpoints: BREAKPOINTS,

  pagination: PAGINATION,

  charLimits: CHAR_LIMITS,

  features: {
    notes: true,
    categories: true,
    archive: true,
    finance: true,
    news: false, // 新闻功能默认关闭
  },

  storage: {
    autoSaveInterval: 30000, // 30秒自动保存
    maxBackups: 5,
  },

  ui: {
    toastDuration: 1000,
    modalTransitionDuration: 200,
    debounceDelay: 300,
  },
} as const

/**
 * 应用配置类型
 */
export type AppConfig = typeof appConfig