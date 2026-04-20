import type { SyncableEntity, Note } from '../types'

/**
 * 筛选条件操作符
 */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'

/**
 * 筛选条件
 */
export interface FilterCondition {
  field: string
  operator: FilterOperator
  value: unknown
}

/**
 * 应用筛选条件
 * @param items - 数组
 * @param conditions - 筛选条件数组
 */
export function filterBy<T>(items: T[], conditions: FilterCondition[]): T[] {
  return items.filter((item) => {
    return conditions.every((condition) => {
      const value = (item as Record<string, unknown>)[condition.field]
      return applyOperator(value, condition.operator, condition.value)
    })
  })
}

/**
 * 应用操作符判断
 */
function applyOperator(value: unknown, operator: FilterOperator, target: unknown): boolean {
  switch (operator) {
    case 'eq':
      return value === target
    case 'neq':
      return value !== target
    case 'gt':
      return typeof value === 'number' && typeof target === 'number' && value > target
    case 'gte':
      return typeof value === 'number' && typeof target === 'number' && value >= target
    case 'lt':
      return typeof value === 'number' && typeof target === 'number' && value < target
    case 'lte':
      return typeof value === 'number' && typeof target === 'number' && value <= target
    case 'in':
      return Array.isArray(target) && target.includes(value)
    case 'contains':
      return typeof value === 'string' && typeof target === 'string' && value.includes(target)
    default:
      return false
  }
}

/**
 * 筛选未删除实体
 * @param entities - 实体数组
 */
export function filterActive<T extends SyncableEntity>(entities: T[]): T[] {
  return filterBy(entities, [{ field: 'is_deleted', operator: 'eq', value: false }])
}

/**
 * 筛选已删除实体
 * @param entities - 实体数组
 */
export function filterDeleted<T extends SyncableEntity>(entities: T[]): T[] {
  return filterBy(entities, [{ field: 'is_deleted', operator: 'eq', value: true }])
}

/**
 * 筛选归档笔记
 * @param notes - 笔记数组
 */
export function filterArchived(notes: Note[]): Note[] {
  return filterBy(notes, [{ field: 'is_archived', operator: 'eq', value: true }])
}

/**
 * 筛选未归档笔记
 * @param notes - 笔记数组
 */
export function filterNotArchived(notes: Note[]): Note[] {
  return filterBy(notes, [{ field: 'is_archived', operator: 'eq', value: false }])
}

/**
 * 筛选置顶笔记
 * @param notes - 笔记数组
 */
export function filterPinned(notes: Note[]): Note[] {
  return filterBy(notes, [{ field: 'is_pinned', operator: 'eq', value: true }])
}

/**
 * 按分类筛选笔记
 * @param notes - 笔记数组
 * @param categoryId - 分类ID
 */
export function filterByCategory(notes: Note[], categoryId: string): Note[] {
  return filterBy(notes, [{ field: 'category_id', operator: 'eq', value: categoryId }])
}

/**
 * 按标签筛选笔记
 * @param notes - 笔记数组
 * @param tagId - 标签ID
 */
export function filterByTag(notes: Note[], tagId: string): Note[] {
  return notes.filter((note) => note.tags.includes(tagId))
}

/**
 * 关键词搜索
 * @param notes - 笔记数组
 * @param keyword - 关键词
 */
export function searchByKeyword(notes: Note[], keyword: string): Note[] {
  const lowerKeyword = keyword.toLowerCase()
  return notes.filter((note) =>
    note.title.toLowerCase().includes(lowerKeyword) ||
    note.content.toLowerCase().includes(lowerKeyword)
  )
}