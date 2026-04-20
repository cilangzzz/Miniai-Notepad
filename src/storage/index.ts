// 存储层导出

// 适配器
export type { IStorageAdapter } from './adapters/IStorageAdapter'
export { IndexedDBAdapter } from './adapters/IndexedDBAdapter'

// 数据库
export {
  MiniAIDB,
  STORE_NAMES,
  getDB,
  initDB,
  closeDB,
  clearAllData
} from './db'

export type { StoreName } from './schemas/db.schema'