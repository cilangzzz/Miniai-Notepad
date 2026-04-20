import type { SyncableEntity } from './syncable.types'

/**
 * 新闻实体
 */
export interface NewsArticle extends SyncableEntity {
  // 核心属性
  title: string           // 新闻标题
  content: string         // 新闻内容
  summary?: string        // 新闻摘要
  source: string          // 新闻来源
  author?: string         // 作者
  url: string             // 原文链接
  image_url?: string      // 图片链接

  // 时间信息
  published_at: number    // 发布时间戳
  category?: string       // 新闻分类

  // 状态
  is_saved: boolean       // 是否保存到笔记
  saved_at?: number       // 保存时间戳
  is_read: boolean        // 是否已读
}

/**
 * 新闻创建DTO（用于保存）
 */
export interface NewsCreateDTO {
  title: string
  content: string
  summary?: string
  source: string
  author?: string
  url: string
  image_url?: string
  published_at: number
  category?: string
}