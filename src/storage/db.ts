import { MiniAIDB, STORE_NAMES } from './schemas/db.schema'
import { seedFakeData } from './seed'

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
 * 确保数据库连接已建立，处理可能的版本迁移错误
 */
export async function initDB(): Promise<void> {
  try {
    const db = getDB()
    await db.open()
    // Seed fake data after database is ready
    await seedFakeData()
  } catch (err) {
    // Version mismatch or schema change - delete old database and recreate
    console.warn('Database schema mismatch, recreating database...')
    if (dbInstance) {
      dbInstance.close()
      dbInstance = null
    }
    // Delete old database
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.deleteDatabase('MiniAIDB')
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
      request.onblocked = () => {
        console.warn('Database deletion blocked, retrying...')
        resolve() // Continue anyway
      }
    })
    // Create new database
    dbInstance = new MiniAIDB()
    await dbInstance.open()
  }
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