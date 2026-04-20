import { BaseRepository } from '../base/BaseRepository'
import type { ICategoryRepository } from './ICategoryRepository'
import { getDB } from '../../storage/db'
import type { Category, CategoryCreateDTO, CategoryUpdateDTO } from '../../types/entities'

/**
 * 分类Repository实现
 * 提供分类的CRUD操作和特有查询方法
 */
export class CategoryRepository extends BaseRepository<Category, CategoryCreateDTO, CategoryUpdateDTO>
  implements ICategoryRepository {

  constructor() {
    super(getDB().categories)
  }

  /**
   * 创建分类，添加必要的默认字段
   */
  async create(data: CategoryCreateDTO): Promise<Category> {
    const now = Date.now()
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: String(data.name),
      slug: String(data.slug),
      color: data.color,
      icon: data.icon ? String(data.icon) : undefined,
      note_count: 0,
      sort_order: typeof data.sort_order === 'number' ? data.sort_order : 0,
      is_preset: false,
      // SyncableEntity fields
      cloud_id: undefined,
      sync_status: 'local',
      local_version: 1,
      cloud_version: undefined,
      created_at: now,
      updated_at: now,
      last_sync_at: undefined,
      is_deleted: false,
      deleted_at: undefined,
    }

    await this.table.add(newCategory)
    return newCategory
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const categories = await this.table
      .filter(cat => cat.slug === slug && !cat.is_deleted)
      .toArray()
    return categories[0] ?? null
  }

  async findPresets(): Promise<Category[]> {
    return this.table
      .filter(cat => cat.is_preset && !cat.is_deleted)
      .toArray()
  }

  async findCustom(): Promise<Category[]> {
    return this.table
      .filter(cat => !cat.is_preset && !cat.is_deleted)
      .toArray()
  }

  async findAllSorted(): Promise<Category[]> {
    const categories = await this.findAllActive()
    return categories.sort((a, b) => a.sort_order - b.sort_order)
  }

  async updateNoteCount(categoryId: string, count: number): Promise<void> {
    await this.update(categoryId, {
      note_count: count,
    } as CategoryUpdateDTO)
  }

  async incrementNoteCount(categoryId: string): Promise<void> {
    const category = await this.findById(categoryId)
    if (category) {
      await this.update(categoryId, {
        note_count: category.note_count + 1,
      } as CategoryUpdateDTO)
    }
  }

  async decrementNoteCount(categoryId: string): Promise<void> {
    const category = await this.findById(categoryId)
    if (category && category.note_count > 0) {
      await this.update(categoryId, {
        note_count: category.note_count - 1,
      } as CategoryUpdateDTO)
    }
  }

  async bulkUpdateSortOrder(orders: Map<string, number>): Promise<void> {
    const db = getDB()
    await db.transaction('rw', this.table, async () => {
      for (const [categoryId, sortOrder] of orders.entries()) {
        await this.update(categoryId, {
          sort_order: sortOrder,
        } as CategoryUpdateDTO)
      }
    })
  }

  /**
   * 删除分类（仅允许删除自定义分类）
   * 预设分类不可删除，将抛出错误
   */
  async delete(id: string): Promise<void> {
    const category = await this.findById(id)
    if (!category) {
      throw new Error(`Category ${id} not found`)
    }

    if (category.is_preset) {
      throw new Error('Cannot delete preset category')
    }

    // 调用基类的软删除方法
    await super.delete(id)
  }

  /**
   * 检查分类是否可以被删除
   * @param categoryId 分类ID
   * @returns 是否可删除
   */
  async canDelete(categoryId: string): Promise<boolean> {
    const category = await this.findById(categoryId)
    if (!category) return false
    return !category.is_preset
  }

  /**
   * 获取分类的使用统计
   * @param categoryId 分类ID
   * @returns 笔记数量
   */
  async getNoteCount(categoryId: string): Promise<number> {
    const category = await this.findById(categoryId)
    return category?.note_count ?? 0
  }
}