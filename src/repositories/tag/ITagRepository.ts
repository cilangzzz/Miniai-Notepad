import type { IRepository } from '../base/IRepository'
import type { Tag, TagCreateDTO, TagUpdateDTO } from '../../types/entities'

/**
 * 标签Repository接口
 * 扩展基础接口，添加标签特有的查询方法
 */
export interface ITagRepository extends IRepository<Tag, TagCreateDTO, TagUpdateDTO> {
  /**
   * 按名称查找标签
   * @param name 标签名称
   * @returns 标签实体或null
   */
  findByName(name: string): Promise<Tag | null>

  /**
   * 搜索标签（名称模糊匹配）
   * @param keyword 搜索关键词
   * @returns 匹配的标签列表
   */
  searchByName(keyword: string): Promise<Tag[]>

  /**
   * 获取热门标签
   * @param limit 返回数量
   * @returns 使用次数最高的标签
   */
  findPopular(limit?: number): Promise<Tag[]>

  /**
   * 按使用次数排序获取所有标签
   * @returns 排序后的标签列表
   */
  findAllSortedByUsage(): Promise<Tag[]>

  /**
   * 更新使用次数
   * @param tagId 标签ID
   * @param count 新的使用次数
   */
  updateUsageCount(tagId: string, count: number): Promise<void>

  /**
   * 增加使用次数
   * @param tagId 标签ID
   */
  incrementUsageCount(tagId: string): Promise<void>

  /**
   * 减少使用次数
   * @param tagId 标签ID
   */
  decrementUsageCount(tagId: string): Promise<void>

  /**
   * 查找时间范围内的标签
   * @param startDate 开始日期 (YYYY-MM-DD)
   * @param endDate 结束日期 (YYYY-MM-DD)
   * @returns 时间范围内的标签
   */
  findByDateRange(startDate: string, endDate: string): Promise<Tag[]>

  /**
   * 批量查找标签
   * @param names 标签名称列表
   * @returns 匹配的标签列表
   */
  findByNames(names: string[]): Promise<Tag[]>
}