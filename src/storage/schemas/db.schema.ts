import Dexie, { Table } from 'dexie'
import type { Note, Category, Tag, Income, Expense, NewsArticle } from '../../types/entities'

/**
 * MiniAI记事本数据库 Schema 定义
 * 使用 Dexie.js 封装 IndexedDB，提供更友好的API
 */
export class MiniAIDB extends Dexie {
  // 数据表定义
  notes!: Table<Note, string>
  categories!: Table<Category, string>
  tags!: Table<Tag, string>
  incomes!: Table<Income, string>
  expenses!: Table<Expense, string>
  newsCache!: Table<NewsArticle, string>

  constructor() {
    super('MiniAIDB')

    // 版本2：添加 is_deleted, sync_status 索引
    this.version(2).stores({
      // 笔记表：主键id + 索引
      // 包含所有 SyncableEntity 字段和业务字段索引
      notes: 'id, cloud_id, category_id, is_archived, is_pinned, is_deleted, sync_status, created_at, updated_at, [category_id+is_archived]',

      // 分类表：主键id + 索引
      categories: 'id, cloud_id, slug, sort_order, is_deleted, sync_status',

      // 标签表：主键id + 索引
      tags: 'id, cloud_id, name, usage_count, is_deleted, sync_status',

      // 收入表：主键id + 索引
      incomes: 'id, cloud_id, date, source, is_deleted, sync_status, [date+source]',

      // 支出表：主键id + 索引
      expenses: 'id, cloud_id, date, category, is_deleted, sync_status, [date+category]',

      // 新闻缓存表：主键id + 索引
      newsCache: 'id, published_at, source, is_saved, is_read, is_deleted'
    }).upgrade(tx => {
      // 为所有现有数据添加默认值
      const tables = ['notes', 'categories', 'tags', 'incomes', 'expenses', 'newsCache']
      return Promise.all(tables.map(tableName => {
        const table = tx.table(tableName)
        return table.toCollection().modify(item => {
          if (item.is_deleted === undefined) {
            item.is_deleted = false
          }
          if (item.sync_status === undefined) {
            item.sync_status = 'local'
          }
        })
      }))
    })
  }
}

// 数据库表名称常量
export const STORE_NAMES = {
  NOTES: 'notes',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  INCOMES: 'incomes',
  EXPENSES: 'expenses',
  NEWS_CACHE: 'newsCache'
} as const

export type StoreName = typeof STORE_NAMES[keyof typeof STORE_NAMES]