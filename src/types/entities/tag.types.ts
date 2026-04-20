import type { SyncableEntity } from './syncable.types'
import type { CardColor } from './note.types'

/**
 * 标签实体
 */
export interface Tag extends SyncableEntity {
  // 核心属性
  name: string            // 标签名称
  color: CardColor        // 标签颜色

  // Neo-Brutalist视觉效果
  rotation: number        // 旋转角度 (-3 ~ 3度)

  // 统计字段
  usage_count: number     // 使用次数（缓存字段）

  // 时间范围
  start_date?: string     // 开始日期 (YYYY-MM-DD)
  end_date?: string       // 结束日期 (YYYY-MM-DD)
}

/**
 * 标签创建DTO
 */
export interface TagCreateDTO {
  name: string
  color?: CardColor
  rotation?: number
  start_date?: string
  end_date?: string
}

/**
 * 标签更新DTO
 */
export interface TagUpdateDTO {
  name?: string
  color?: CardColor
  rotation?: number
  start_date?: string
  end_date?: string
}