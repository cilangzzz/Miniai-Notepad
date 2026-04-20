import { ref, computed, watch, type Ref } from 'vue'
import { sortBy } from '@/utils'

/**
 * 排序状态管理封装
 * 提通用的排序功能封装
 */
export interface SortSpec {
  field: string
  direction: 'asc' | 'desc'
}

export interface SortOptions<T> {
  /** 初始排序配置 */
  initialSort?: SortSpec
  /** 排序变更回调 */
  onChange?: (sort: SortSpec) => void
  /** 数据源 */
  dataSource?: Ref<T[]>
  /** 可用的排序字段 */
  sortableFields?: string[]
}

export function useSort<T>(options: SortOptions<T> = {}) {
  const { initialSort, onChange, dataSource, sortableFields } = options

  const sort = ref<SortSpec>(initialSort ?? { field: 'created_at', direction: 'desc' })
  const hasCustomSort = computed(() => sort.value.field !== 'created_at' || sort.value.direction !== 'desc')

  /**
   * 应用排序
   */
  const sortedData = computed<T[]>(() => {
    if (!dataSource?.value) {
      return []
    }

    return sortBy(dataSource.value, [sort.value])
  })

  /**
   * 设置排序字段
   */
  function setSortField(field: string) {
    if (sortableFields && !sortableFields.includes(field)) return

    // 如果当前已经是该字段，则切换排序方向
    if (sort.value.field === field) {
      toggleSortDirection()
    } else {
      sort.value = { field, direction: 'desc' }
      onChange?.(sort.value)
    }
  }

  /**
   * 设置排序方向
   */
  function setSortDirection(direction: 'asc' | 'desc') {
    sort.value.direction = direction
    onChange?.(sort.value)
  }

  /**
   * 设置完整排序配置
   */
  function setSort(newSort: Partial<SortSpec>) {
    sort.value = { ...sort.value, ...newSort }
    onChange?.(sort.value)
  }

  /**
   * 切换排序方向
   */
  function toggleSortDirection() {
    sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
    onChange?.(sort.value)
  }

  /**
   * 重置为初始排序
   */
  function resetSort() {
    sort.value = initialSort ?? { field: 'created_at', direction: 'desc' }
    onChange?.(sort.value)
  }

  /**
   * 清空排序（恢复默认）
   */
  function clearSort() {
    sort.value = { field: 'created_at', direction: 'desc' }
    onChange?.(sort.value)
  }

  /**
   * 检查是否按指定字段排序
   */
  function isSortByField(field: string): boolean {
    return sort.value.field === field
  }

  /**
   * 掷取指定字段的排序方向
   */
  function getSortDirection(field: string): 'asc' | 'desc' | null {
    if (sort.value.field === field) {
      return sort.value.direction
    }
    return null
  }

  // 监听排序变化
  watch(sort, (newSort) => {
    onChange?.(newSort)
  }, { deep: true })

  return {
    sort,
    hasCustomSort,
    sortedData,
    setSortField,
    setSortDirection,
    setSort,
    toggleSortDirection,
    resetSort,
    clearSort,
    isSortByField,
    getSortDirection,
  }
}

/**
 * 多字段排序封装
 * 支持按多个字段排序
 */
export interface MultiSortOptions<T> {
  initialSorts?: SortSpec[]
  onChange?: (sorts: SortSpec[]) => void
  dataSource?: Ref<T[]>
  sortableFields?: string[]
}

export function useMultiSort<T>(options: MultiSortOptions<T> = {}) {
  const { initialSorts = [], onChange, dataSource, sortableFields } = options

  const sorts = ref<SortSpec[]>(initialSorts)
  const hasSorts = computed(() => sorts.value.length > 0)

  /**
   * 应用多字段排序
   */
  const sortedData = computed<T[]>(() => {
    if (!dataSource?.value || !hasSorts.value) {
      return dataSource?.value ?? []
    }

    return sortBy(dataSource.value, sorts.value)
  })

  /**
   * 添加排序字段
   */
  function addSort(field: string, direction: 'asc' | 'desc' = 'desc') {
    if (sortableFields && !sortableFields.includes(field)) return

    // 移除已存在的同字段排序
    const index = sorts.value.findIndex(s => s.field === field)
    if (index !== -1) {
      sorts.value.splice(index, 1)
    }

    sorts.value.push({ field, direction })
    onChange?.(sorts.value)
  }

  /**
   * 移除排序字段
   */
  function removeSort(field: string) {
    sorts.value = sorts.value.filter(s => s.field !== field)
    onChange?.(sorts.value)
  }

  /**
   * 切换排序方向
   */
  function toggleSortDirection(field: string) {
    const sortSpec = sorts.value.find(s => s.field === field)
    if (sortSpec) {
      sortSpec.direction = sortSpec.direction === 'asc' ? 'desc' : 'asc'
      onChange?.(sorts.value)
    }
  }

  /**
   * 清空所有排序
   */
  function clearSorts() {
    sorts.value = []
    onChange?.([])
  }

  /**
   * 设置所有排序
   */
  function setSorts(newSorts: SortSpec[]) {
    sorts.value = newSorts
    onChange?.(newSorts)
  }

  /**
   * 检查是否按指定字段排序
   */
  function hasSortForField(field: string): boolean {
    return sorts.value.some(s => s.field === field)
  }

  /**
   * 获取排序优先级（索引）
   */
  function getSortPriority(field: string): number {
    return sorts.value.findIndex(s => s.field === field)
  }

  return {
    sorts,
    hasSorts,
    sortedData,
    addSort,
    removeSort,
    toggleSortDirection,
    clearSorts,
    setSorts,
    hasSortForField,
    getSortPriority,
  }
}