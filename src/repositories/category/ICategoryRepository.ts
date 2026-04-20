import type { IRepository } from '../base/IRepository'
import type { Category, CategoryCreateDTO, CategoryUpdateDTO } from '../../types/entities'

/**
 * 分类Repository接口
 * 扩展基础接口，添加分类特有的查询方法
 */
export interface ICategoryRepository extends IRepository<Category, CategoryCreateDTO, CategoryUpdateDTO> {
  /**
   * 按slug查找分类
   * @param slug 分类slug
   * @returns 分类实体或null
   */
  findBySlug(slug: string): Promise<Category | null>

  /**
   * 获取预设分类
   * @returns 所有预设分类
   */
  findPresets(): Promise<Category[]>

  /**
   * 获取自定义分类
   * @returns 所有非预设分类
   */
  findCustom(): Promise<Category[]>

  /**
   * 按排序顺序获取所有分类
   * @returns 排序后的分类列表
   */
  findAllSorted(): Promise<Category[]>

  /**
   * 更新笔记数量
   * @param categoryId 分类ID
   * @param count 新的笔记数量
   */
  updateNoteCount(categoryId: string, count: number): Promise<void>

  /**
   * 增加笔记数量
   * @param categoryId 分类ID
   */
  incrementNoteCount(categoryId: string): Promise<void>

  /**
   * 减少笔记数量
   * @param categoryId 分类ID
   */
  decrementNoteCount(categoryId: string): Promise<void>

  /**
   * 批量更新排序顺序
   * @param orders 分类ID和排序顺序的映射
   */
  bulkUpdateSortOrder(orders: Map<string, number>): Promise<void>
}