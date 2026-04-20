import { BaseRepository } from '../base/BaseRepository'
import type { ITagRepository } from './ITagRepository'
import { getDB } from '../../storage/db'
import type { Tag, TagCreateDTO, TagUpdateDTO } from '../../types/entities'

/**
 * 标签Repository实现
 * 提供标签的CRUD操作和特有查询方法
 */
export class TagRepository extends BaseRepository<Tag, TagCreateDTO, TagUpdateDTO>
  implements ITagRepository {

  constructor() {
    super(getDB().tags)
  }

  async findByName(name: string): Promise<Tag | null> {
    const tag = await this.table
      .where('name')
      .equals(name)
      .and(t => !t.is_deleted)
      .first()
    return tag ?? null
  }

  async searchByName(keyword: string): Promise<Tag[]> {
    const lowerKeyword = keyword.toLowerCase()
    return this.table
      .filter(tag =>
        !tag.is_deleted &&
        tag.name.toLowerCase().includes(lowerKeyword)
      )
      .toArray()
  }

  async findPopular(limit: number = 10): Promise<Tag[]> {
    const tags = await this.table
      .where('usage_count')
      .above(0)
      .and(t => !t.is_deleted)
      .toArray()

    return tags
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, limit)
  }

  async findAllSortedByUsage(): Promise<Tag[]> {
    const tags = await this.findAllActive()
    return tags.sort((a, b) => b.usage_count - a.usage_count)
  }

  async updateUsageCount(tagId: string, count: number): Promise<void> {
    await this.update(tagId, {
      usage_count: count,
    } as TagUpdateDTO)
  }

  async incrementUsageCount(tagId: string): Promise<void> {
    const tag = await this.findById(tagId)
    if (tag) {
      await this.update(tagId, {
        usage_count: tag.usage_count + 1,
      } as TagUpdateDTO)
    }
  }

  async decrementUsageCount(tagId: string): Promise<void> {
    const tag = await this.findById(tagId)
    if (tag && tag.usage_count > 0) {
      await this.update(tagId, {
        usage_count: tag.usage_count - 1,
      } as TagUpdateDTO)
    }
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Tag[]> {
    return this.table
      .filter(tag =>
        !tag.is_deleted &&
        tag.start_date !== undefined &&
        tag.end_date !== undefined &&
        tag.start_date >= startDate &&
        tag.end_date <= endDate
      )
      .toArray()
  }

  async findByNames(names: string[]): Promise<Tag[]> {
    return this.table
      .where('name')
      .anyOf(names)
      .and(t => !t.is_deleted)
      .toArray()
  }

  /**
   * 创建或获取标签
   * 如果标签名称已存在，返回现有标签
   * 否则创建新标签
   * @param name 标签名称
   * @param color 标签颜色（可选，创建时使用）
   * @returns 标签实体
   */
  async createOrGet(name: string, color?: Tag['color']): Promise<Tag> {
    const existing = await this.findByName(name)
    if (existing) {
      return existing
    }

    return this.create({
      name,
      color: color ?? 'yellow',
      rotation: Math.random() * 6 - 3, // -3 到 3 度随机旋转
    } as TagCreateDTO)
  }

  /**
   * 批量创建或获取标签
   * @param names 标签名称列表
   * @returns 标签实体列表
   */
  async bulkCreateOrGet(names: string[]): Promise<Tag[]> {
    const results: Tag[] = []
    for (const name of names) {
      const tag = await this.createOrGet(name)
      results.push(tag)
    }
    return results
  }

  /**
   * 批量增加使用次数
   * @param tagIds 标签ID列表
   */
  async bulkIncrementUsageCount(tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      await this.incrementUsageCount(tagId)
    }
  }

  /**
   * 批量减少使用次数
   * @param tagIds 标签ID列表
   */
  async bulkDecrementUsageCount(tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      await this.decrementUsageCount(tagId)
    }
  }
}