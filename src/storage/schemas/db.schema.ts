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

    // 版本1：初始 Schema
    this.version(1).stores({
      // 笔记表：主键id + 索引
      // 索引：cloud_id, category_id, is_archived, is_pinned, created_at, updated_at
      // 复合索引：[category_id+is_archived] 用于按分类筛选非归档笔记
      notes: 'id, cloud_id, category_id, is_archived, is_pinned, created_at, updated_at, [category_id+is_archived]',

      // 分类表：主键id + 索引
      // 索引：cloud_id, slug, sort_order
      categories: 'id, cloud_id, slug, sort_order',

      // 标签表：主键id + 索引
      // 索引：cloud_id, name, usage_count
      tags: 'id, cloud_id, name, usage_count',

      // 收入表：主键id + 索引
      // 索引：cloud_id, date, source
      // 复合索引：[date+source] 用于月度来源统计
      incomes: 'id, cloud_id, date, source, [date+source]',

      // 支出表：主键id + 索引
      // 索引：cloud_id, date, category
      // 复合索引：[date+category] 用于月度分类统计
      expenses: 'id, cloud_id, date, category, [date+category]',

      // 新闻缓存表：主键id + 索引
      // 索引：published_at, source, is_saved, is_read
      newsCache: 'id, published_at, source, is_saved, is_read'
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