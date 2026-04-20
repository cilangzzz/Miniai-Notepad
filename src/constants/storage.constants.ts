/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
  // LocalStorage 键
  THEME: 'kinetic_notes_theme',
  USER_PREFERENCES: 'kinetic_notes_preferences',
  LAST_SYNC: 'kinetic_notes_last_sync',
  NAV_STATE: 'kinetic_notes_nav_state',

  // IndexedDB 配置
  DB_NAME: 'MiniAIDB',
  DB_VERSION: 1,
} as const

/**
 * IndexedDB 表名常量
 */
export const DB_STORES = {
  NOTES: 'notes',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  INCOMES: 'incomes',
  EXPENSES: 'expenses',
  SYNC_LOG: 'syncLog',
} as const

/**
 * 存储容量限制（估算）
 */
export const STORAGE_LIMITS = {
  // IndexedDB 通常限制
  INDEXEDDB_MIN: 50 * 1024 * 1024,      // 50MB
  INDEXEDDB_DEFAULT: 250 * 1024 * 1024, // 250MB
  INDEXEDDB_MAX: 2 * 1024 * 1024 * 1024, // 2GB

  // 单条记录大小估算
  NOTE_SIZE_ESTIMATE: 5 * 1024,         // 5KB
  CATEGORY_SIZE_ESTIMATE: 500,          // 500B
  TAG_SIZE_ESTIMATE: 300,               // 300B
} as const