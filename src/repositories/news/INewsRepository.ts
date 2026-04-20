import type { IRepository } from '../base/IRepository'
import type { NewsArticle, NewsCreateDTO } from '../../types/entities'

/**
 * 新闻缓存配置
 */
export interface NewsCacheConfig {
  maxAge: number          // 最大缓存时间（毫秒）
  maxItems: number        // 最大缓存条数
}

/**
 * 新闻Repository接口
 * 扩展基础接口，添加新闻缓存特有的管理方法
 */
export interface INewsRepository extends IRepository<NewsArticle, NewsCreateDTO, Partial<NewsArticle>> {
  /**
   * 获取已保存的新闻
   * @returns 所有已保存的新闻
   */
  findSaved(): Promise<NewsArticle[]>

  /**
   * 获取已读新闻
   * @returns 所有已读新闻
   */
  findRead(): Promise<NewsArticle[]>

  /**
   * 获取未读新闻
   * @returns 所有未读新闻
   */
  findUnread(): Promise<NewsArticle[]>

  /**
   * 按来源查找新闻
   * @param source 新闻来源
   * @returns 该来源的新闻
   */
  findBySource(source: string): Promise<NewsArticle[]>

  /**
   * 按分类查找新闻
   * @param category 新闻分类
   * @returns 该分类的新闻
   */
  findByCategory(category: string): Promise<NewsArticle[]>

  /**
   * 获取最新新闻
   * @param limit 返回数量
   * @returns 最新发布的新闻
   */
  findLatest(limit?: number): Promise<NewsArticle[]>

  /**
   * 搜索新闻
   * @param keyword 搜索关键词
   * @returns 标题或摘要包含关键词的新闻
   */
  searchByKeyword(keyword: string): Promise<NewsArticle[]>

  /**
   * 保存新闻到笔记
   * @param id 新闻ID
   */
  saveToNote(id: string): Promise<void>

  /**
   * 取消保存
   * @param id 新闻ID
   */
  unsaveFromNote(id: string): Promise<void>

  /**
   * 标记为已读
   * @param id 新闻ID
   */
  markAsRead(id: string): Promise<void>

  /**
   * 标记为未读
   * @param id 新闻ID
   */
  markAsUnread(id: string): Promise<void>

  /**
   * 清理过期缓存
   * @param maxAge 最大缓存时间（毫秒）
   * @returns 清理的新闻数量
   */
  cleanExpiredCache(maxAge: number): Promise<number>

  /**
   * 检查新闻是否已存在（防止重复缓存）
   * @param url 新闻URL
   * @returns 是否已存在
   */
  existsByUrl(url: string): Promise<boolean>

  /**
   * 按URL查找新闻
   * @param url 新闻URL
   * @returns 新闻实体或null
   */
  findByUrl(url: string): Promise<NewsArticle | null>

  /**
   * 批量标记已读
   * @param ids 新闻ID列表
   */
  bulkMarkAsRead(ids: string[]): Promise<void>

  /**
   * 获取缓存统计
   * @returns 缓存统计信息
   */
  getCacheStats(): Promise<{
    total: number
    saved: number
    read: number
    unread: number
    oldest: number
    newest: number
  }>
}