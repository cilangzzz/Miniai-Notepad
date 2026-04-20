import { ref, computed, watch, type Ref } from 'vue'

/**
 * 筛选状态管理封装
 * 提通用的筛选功能封装
 */
export interface FilterCondition {
  field: string
  value: unknown
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains'
}

export interface FilterOptions<T> {
  /** 初始筛选条件 */
  initialFilters?: FilterCondition[]
  /** 筛选变更回调 */
  onChange?: (filters: FilterCondition[]) => void
  /** 数据源 */
  dataSource?: Ref<T[]>
}

export function useFilter<T>(options: FilterOptions<T> = {}) {
  const { initialFilters = [], onChange, dataSource } = options

  const filters = ref<FilterCondition[]>(initialFilters)
  const hasFilters = computed(() => filters.value.length > 0)

  /**
   * 应用筛选条件
   */
  const filteredData = computed<T[]>(() => {
    if (!dataSource?.value || !hasFilters.value) {
      return dataSource?.value ?? []
    }

    return dataSource.value.filter(item => {
      return filters.value.every(condition => {
        const value = (item as Record<string, unknown>)[condition.field]

        switch (condition.operator) {
          case 'eq':
            return value === condition.value
          case 'neq':
            return value !== condition.value
          case 'gt':
            return typeof value === 'number' && typeof condition.value === 'number' && value > condition.value
          case 'gte':
            return typeof value === 'number' && typeof condition.value === 'number' && value >= condition.value
          case 'lt':
            return typeof value === 'number' && typeof condition.value === 'number' && value < condition.value
          case 'lte':
            return typeof value === 'number' && typeof condition.value === 'number' && value <= condition.value
          case 'in':
            return Array.isArray(condition.value) && condition.value.includes(value)
          case 'contains':
            return typeof value === 'string' && typeof condition.value === 'string' && value.includes(condition.value)
          default:
            return true
        }
      })
    })
  })

  /**
   * 设置单个筛选条件
   */
  function setFilter(field: string, value: unknown, operator: FilterCondition['operator'] = 'eq') {
    // 移除已存在的同字段条件
    const index = filters.value.findIndex(f => f.field === field)
    if (index !== -1) {
      filters.value.splice(index, 1)
    }

    // 添加新条件（如果值有效）
    if (value !== null && value !== undefined && value !== '') {
      filters.value.push({ field, value, operator })
    }

    onChange?.(filters.value)
  }

  /**
   * 移除单个筛选条件
   */
  function removeFilter(field: string) {
    filters.value = filters.value.filter(f => f.field !== field)
    onChange?.(filters.value)
  }

  /**
   * 批量设置筛选条件
   */
  function setFilters(newFilters: FilterCondition[]) {
    filters.value = newFilters
    onChange?.(filters.value)
  }

  /**
   * 清空所有筛选条件
   */
  function clearFilters() {
    filters.value = []
    onChange?.(filters.value)
  }

  /**
   * 重置为初始筛选条件
   */
  function resetFilters() {
    filters.value = initialFilters
    onChange?.(filters.value)
  }

  /**
   * 获取指定字段的筛选值
   */
  function getFilterValue(field: string): unknown | undefined {
    return filters.value.find(f => f.field === field)?.value
  }

  /**
   * 检查是否存在指定字段的筛选
   */
  function hasFilter(field: string): boolean {
    return filters.value.some(f => f.field === field)
  }

  /**
   * 切换筛选条件（存在则移除，不存在则添加）
   */
  function toggleFilter(field: string, value: unknown, operator: FilterCondition['operator'] = 'eq') {
    if (hasFilter(field)) {
      removeFilter(field)
    } else {
      setFilter(field, value, operator)
    }
  }

  // 监听筛选条件变化
  watch(filters, (newFilters) => {
    onChange?.(newFilters)
  }, { deep: true })

  return {
    filters,
    hasFilters,
    filteredData,
    setFilter,
    removeFilter,
    setFilters,
    clearFilters,
    resetFilters,
    getFilterValue,
    hasFilter,
    toggleFilter,
  }
}

/**
 * 多选筛选封装
 * 用于分类、标签等多选场景
 */
export interface MultiSelectFilterOptions {
  field: string
  onChange?: (values: unknown[]) => void
}

export function useMultiSelectFilter(options: MultiSelectFilterOptions) {
  const { field, onChange } = options

  const selectedValues = ref<unknown[]>([])
  const hasSelection = computed(() => selectedValues.value.length > 0)

  /**
   * 添加选中值
   */
  function addValue(value: unknown) {
    if (!selectedValues.value.includes(value)) {
      selectedValues.value.push(value)
      onChange?.(selectedValues.value)
    }
  }

  /**
   * 移除选中值
   */
  function removeValue(value: unknown) {
    selectedValues.value = selectedValues.value.filter(v => v !== value)
    onChange?.(selectedValues.value)
  }

  /**
   * 切换选中状态
   */
  function toggleValue(value: unknown) {
    if (selectedValues.value.includes(value)) {
      removeValue(value)
    } else {
      addValue(value)
    }
  }

  /**
   * 设置所有选中值
   */
  function setValues(values: unknown[]) {
    selectedValues.value = values
    onChange?.(values)
  }

  /**
   * 清空选中值
   */
  function clearValues() {
    selectedValues.value = []
    onChange?.([])
  }

  /**
   * 检查是否选中
   */
  function isSelected(value: unknown): boolean {
    return selectedValues.value.includes(value)
  }

  return {
    selectedValues,
    hasSelection,
    addValue,
    removeValue,
    toggleValue,
    setValues,
    clearValues,
    isSelected,
  }
}