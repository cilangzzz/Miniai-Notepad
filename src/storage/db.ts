import { MiniAIDB, STORE_NAMES } from './schemas/db.schema'

/**
 * 数据库实例
 * 单例模式，全局共享同一数据库连接
 */
let dbInstance: MiniAIDB | null = null

/**
 * 获取数据库实例
 * 延迟初始化，首次调用时创建连接
 */
export function getDB(): MiniAIDB {
  if (!dbInstance) {
    dbInstance = new MiniAIDB()
  }
  return dbInstance
}

/**
 * 初始化数据库
 * 确保数据库连接已建立
 */
export async function initDB(): Promise<void> {
  const db = getDB()
  // Dexie 在创建实例时自动打开数据库
  // 使用 db.open() 确保连接已建立
  await db.open()
}

/**
 * 关闭数据库连接
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

/**
 * 清空所有数据
 * 用于测试或重置应用状态
 */
export async function clearAllData(): Promise<void> {
  const db = getDB()
  await Promise.all([
    db.notes.clear(),
    db.categories.clear(),
    db.tags.clear(),
    db.incomes.clear(),
    db.expenses.clear(),
    db.newsCache.clear()
  ])
}

// 导出数据库实例（推荐使用 getDB() 函数）
export { MiniAIDB, STORE_NAMES }
export default getDB