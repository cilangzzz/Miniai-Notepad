import type { SyncableEntity } from '../types'

/**
 * 排序方向
 */
export type SortDirection = 'asc' | 'desc'

/**
 * 排序规格
 */
export interface SortSpec {
  field: string
  direction: SortDirection
}

/**
 * 通用排序函数
 * @param items - 要排序的数组
 * @param specs - 排序规格
 */
export function sortBy<T>(items: T[], specs: SortSpec[]): T[] {
  return [...items].sort((a, b) => {
    for (const spec of specs) {
      const aVal = (a as Record<string, unknown>)[spec.field]
      const bVal = (b as Record<string, unknown>)[spec.field]

      let comparison = 0

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime()
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      if (comparison !== 0) {
        return spec.direction === 'asc' ? comparison : -comparison
      }
    }
    return 0
  })
}

/**
 * 按时间戳排序（降序）
 * @param entities - 实体数组
 * @param field - 时间戳字段
 */
export function sortByTimestamp<T extends SyncableEntity>(
  entities: T[],
  field: 'created_at' | 'updated_at'
): T[] {
  return sortBy(entities, [{ field, direction: 'desc' }])
}

/**
 * 按创建时间排序（最新在前）
 * @param entities - 实体数组
 */
export function sortByCreated<T extends SyncableEntity>(entities: T[]): T[] {
  return sortByTimestamp(entities, 'created_at')
}

/**
 * 按更新时间排序（最新在前）
 * @param entities - 实体数组
 */
export function sortByUpdated<T extends SyncableEntity>(entities: T[]): T[] {
  return sortByTimestamp(entities, 'updated_at')
}

/**
 * 按名称排序（字母序）
 * @param items - 数组
 * @param field - 名称字段
 */
export function sortByField<T>(items: T[], field: keyof T): T[] {
  return sortBy(items, [{ field: String(field), direction: 'asc' }])
}

/**
 * 按排序权重排序
 * @param items - 数组
 */
export function sortByOrder<T extends { sort_order: number }>(items: T[]): T[] {
  return sortBy(items, [{ field: 'sort_order', direction: 'asc' }])
}