import type { SyncableEntity } from './syncable.types'
import type { CardColor } from './note.types'

/**
 * 分类实体
 */
export interface Category extends SyncableEntity {
  // 核心属性
  name: string            // 分类名称
  slug: string            // 分类slug（用于路由）
  color: CardColor        // 分类颜色
  icon?: string           // 分类图标（Material Symbol）

  // 统计字段
  note_count: number      // 笔记数量（缓存字段）

  // 排序
  sort_order: number      // 排序权重

  // 预设分类标记
  is_preset: boolean      // 是否预设分类（不可删除）
}

/**
 * 分类创建DTO
 */
export interface CategoryCreateDTO {
  name: string
  slug: string
  color: CardColor
  icon?: string
  sort_order?: number
}

/**
 * 分类更新DTO
 */
export interface CategoryUpdateDTO {
  name?: string
  slug?: string
  color?: CardColor
  icon?: string
  sort_order?: number
}