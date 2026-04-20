import { BaseRepository } from '../base/BaseRepository'
import type { INewsRepository, NewsCacheConfig } from './INewsRepository'
import { getDB } from '../../storage/db'
import type { NewsArticle, NewsCreateDTO } from '../../types/entities'
import type { QuerySpec, FilterCondition } from '../base/IRepository'

/**
 * 默认缓存配置
 */
const DEFAULT_CACHE_CONFIG: NewsCacheConfig = {
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7天
  maxItems: 100,                     // 最大100条
}

/**
 * 新闻Repository实现
 * 提供新闻缓存的CRUD操作和缓存管理功能
 */
export class NewsRepository extends BaseRepository<NewsArticle, NewsCreateDTO, Partial<NewsArticle>>
  implements INewsRepository {

  private cacheConfig: NewsCacheConfig

  constructor(config?: Partial<NewsCacheConfig>) {
    super(getDB().newsCache)
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...config }
  }

  async findSaved(): Promise<NewsArticle[]> {
    return this.table
      .where('is_saved')
      .equals(true as unknown as boolean)
      .and(article => !article.is_deleted)
      .toArray()
  }

  async findRead(): Promise<NewsArticle[]> {
    return this.table
      .where('is_read')
      .equals(true as unknown as boolean)
      .and(article => !article.is_deleted)
      .toArray()
  }

  async findUnread(): Promise<NewsArticle[]> {
    return this.table
      .where('is_read')
      .equals(false as unknown as boolean)
      .and(article => !article.is_deleted)
      .toArray()
  }

  async findBySource(source: string): Promise<NewsArticle[]> {
    return this.table
      .where('source')
      .equals(source)
      .and(article => !article.is_deleted)
      .toArray()
  }

  async findByCategory(category: string): Promise<NewsArticle[]> {
    return this.table
      .filter(article =>
        !article.is_deleted &&
        article.category === category
      )
      .toArray()
  }

  async findLatest(limit: number = 20): Promise<NewsArticle[]> {
    return this.table
      .orderBy('published_at')
      .reverse()
      .filter(article => !article.is_deleted)
      .limit(limit)
      .toArray()
  }

  async searchByKeyword(keyword: string): Promise<NewsArticle[]> {
    const lowerKeyword = keyword.toLowerCase()
    return this.table
      .filter(article =>
        !article.is_deleted &&
        (article.title.toLowerCase().includes(lowerKeyword) ||
          (article.summary?.toLowerCase().includes(lowerKeyword) ?? false) ||
          article.content.toLowerCase().includes(lowerKeyword))
      )
      .toArray()
  }

  async saveToNote(id: string): Promise<void> {
    await this.update(id, {
      is_saved: true,
      saved_at: Date.now(),
    })
  }

  async unsaveFromNote(id: string): Promise<void> {
    await this.update(id, {
      is_saved: false,
      saved_at: undefined,
    })
  }

  async markAsRead(id: string): Promise<void> {
    await this.update(id, {
      is_read: true,
    })
  }

  async markAsUnread(id: string): Promise<void> {
    await this.update(id, {
      is_read: false,
    })
  }

  async cleanExpiredCache(maxAge: number = this.cacheConfig.maxAge): Promise<number> {
    const expirationTime = Date.now() - maxAge
    const expiredArticles = await this.table
      .where('published_at')
      .below(expirationTime)
      .and(article => !article.is_saved && !article.is_deleted)
      .toArray()

    if (expiredArticles.length > 0) {
      await this.table.bulkDelete(expiredArticles.map(a => a.id))
    }

    return expiredArticles.length
  }

  async existsByUrl(url: string): Promise<boolean> {
    const count = await this.table
      .filter(article => article.url === url && !article.is_deleted)
      .count()
    return count > 0
  }

  async findByUrl(url: string): Promise<NewsArticle | null> {
    const article = await this.table
      .filter(a => a.url === url && !a.is_deleted)
      .first()
    return article ?? null
  }

  async bulkMarkAsRead(ids: string[]): Promise<void> {
    for (const id of ids) {
      await this.markAsRead(id)
    }
  }

  async getCacheStats(): Promise<{
    total: number
    saved: number
    read: number
    unread: number
    oldest: number
    newest: number
  }> {
    const all = await this.findAllActive()
    const saved = all.filter(a => a.is_saved)
    const read = all.filter(a => a.is_read)
    const unread = all.filter(a => !a.is_read)

    const timestamps = all.map(a => a.published_at)
    const oldest = timestamps.length > 0 ? Math.min(...timestamps) : 0
    const newest = timestamps.length > 0 ? Math.max(...timestamps) : 0

    return {
      total: all.length,
      saved: saved.length,
      read: read.length,
      unread: unread.length,
      oldest,
      newest,
    }
  }

  /**
   * 创建新闻（如果URL已存在则跳过）
   * @param data 新闻数据
   * @returns 创建的新闻实体或已存在的实体
   */
  async createIfNotExists(data: NewsCreateDTO): Promise<NewsArticle> {
    const existing = await this.findByUrl(data.url)
    if (existing) {
      return existing
    }

    return this.create({
      ...data,
      is_saved: false,
      is_read: false,
    })
  }

  /**
   * 批量创建新闻（跳过已存在的URL）
   * @param data 新闻数据列表
   * @returns 创建的新闻实体列表
   */
  async bulkCreateIfNotExists(data: NewsCreateDTO[]): Promise<NewsArticle[]> {
    const results: NewsArticle[] = []
    for (const item of data) {
      const article = await this.createIfNotExists(item)
      results.push(article)
    }
    return results
  }

  /**
   * 清理超出最大条数的缓存
   * 保留已保存的新闻
   * @returns 清理的新闻数量
   */
  async cleanOverflowCache(): Promise<number> {
    const all = await this.table
      .orderBy('published_at')
      .reverse()
      .filter(article => !article.is_deleted)
      .toArray()

    if (all.length <= this.cacheConfig.maxItems) {
      return 0
    }

    // 保留已保存的新闻
    const saved = all.filter(a => a.is_saved)
    const unsaved = all.filter(a => !a.is_saved)

    // 计算需要清理的数量
    const toDeleteCount = all.length - this.cacheConfig.maxItems
    if (toDeleteCount <= 0) return 0

    // 按发布时间排序，删除最旧的未保存新闻
    const toDelete = unsaved
      .sort((a, b) => a.published_at - b.published_at)
      .slice(0, toDeleteCount)

    await this.table.bulkDelete(toDelete.map(a => a.id))
    return toDelete.length
  }

  /**
   * 更新缓存配置
   */
  updateCacheConfig(config: Partial<NewsCacheConfig>): void {
    this.cacheConfig = { ...this.cacheConfig, ...config }
  }
}