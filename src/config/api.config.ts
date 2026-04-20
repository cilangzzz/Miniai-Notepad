/**
 * API 配置
 */
export const apiConfig = {
  // 新闻 API（预留）
  news: {
    baseUrl: '',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // 云同步 API（P2阶段）
  sync: {
    baseUrl: '',
    timeout: 30000,
    batchSize: 50,
    syncInterval: 60000, // 1分钟同步间隔
  },

  // 通用配置
  common: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
} as const

/**
 * API 配置类型
 */
export type ApiConfig = typeof apiConfig