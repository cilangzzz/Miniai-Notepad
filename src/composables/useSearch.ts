import { ref, computed, watch } from 'vue'
import { debounce } from '@/utils'

/**
 * 搜索功能封装
 * 提供统一的搜索状态管理
 */
export interface SearchOptions {
  /** 搜索回调 */
  onSearch?: (keyword: string) => Promise<void> | void
  /** 防抖延迟（毫秒） */
  debounceDelay?: number
  /** 最小搜索长度 */
  minLength?: number
  /** 最大搜索长度 */
  maxLength?: number
  /** 是否立即搜索 */
  immediate?: boolean
}

export function useSearch(options: SearchOptions = {}) {
  const {
    onSearch,
    debounceDelay = 300,
    minLength = 2,
    maxLength = 100,
    immediate = false,
  } = options

  const keyword = ref('')
  const isSearching = ref(false)
  const hasKeyword = computed(() => keyword.value.trim().length > 0)
  const isValidLength = computed(() => {
    const length = keyword.value.trim().length
    return length >= minLength && length <= maxLength
  })
  const canSearch = computed(() => hasKeyword.value && isValidLength.value && !isSearching.value)

  // 创建防抖搜索函数
  const debouncedSearch = debounce(async (kw: string) => {
    if (!canSearch.value) return

    isSearching.value = true
    try {
      await onSearch?.(kw.trim())
    } finally {
      isSearching.value = false
    }
  }, debounceDelay)

  /**
   * 设置搜索关键词
   */
  function setKeyword(value: string) {
    keyword.value = value

    // 自动触发搜索
    if (canSearch.value && onSearch) {
      debouncedSearch(value)
    }
  }

  /**
   * 立即执行搜索
   */
  async function executeSearch() {
    if (!canSearch.value) return

    isSearching.value = true
    try {
      await onSearch?.(keyword.value.trim())
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 清空搜索
   */
  function clearSearch() {
    keyword.value = ''
    isSearching.value = false
  }

  // 监听关键词变化
  watch(keyword, (newKeyword) => {
    if (newKeyword.trim().length >= minLength && onSearch) {
      debouncedSearch(newKeyword)
    }
  })

  // 立即搜索（如果设置了immediate且有初始值）
  if (immediate && keyword.value) {
    executeSearch()
  }

  return {
    keyword,
    isSearching,
    hasKeyword,
    isValidLength,
    canSearch,
    setKeyword,
    executeSearch,
    clearSearch,
  }
}

/**
 * 高级搜索封装
 * 支持多条件搜索
 */
export interface AdvancedSearchOptions {
  fields: string[]
  onSearch?: (conditions: SearchCondition[]) => Promise<void> | void
  debounceDelay?: number
}

export interface SearchCondition {
  field: string
  value: string
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith'
}

export function useAdvancedSearch(options: AdvancedSearchOptions) {
  const { fields, onSearch, debounceDelay = 300 } = options

  const conditions = ref<Map<string, SearchCondition>>(new Map())
  const isSearching = ref(false)

  const hasConditions = computed(() => conditions.value.size > 0)
  const activeConditions = computed(() => Array.from(conditions.value.values()))

  // 创建防抖搜索函数
  const debouncedSearch = debounce(async (conds: SearchCondition[]) => {
    if (conds.length === 0) return

    isSearching.value = true
    try {
      await onSearch?.(conds)
    } finally {
      isSearching.value = false
    }
  }, debounceDelay)

  /**
   * 设置单个条件
   */
  function setCondition(field: string, value: string, operator: SearchCondition['operator'] = 'contains') {
    if (!fields.includes(field)) return

    if (value.trim()) {
      conditions.value.set(field, { field, value: value.trim(), operator })
    } else {
      conditions.value.delete(field)
    }

    triggerSearch()
  }

  /**
   * 移除单个条件
   */
  function removeCondition(field: string) {
    conditions.value.delete(field)
    triggerSearch()
  }

  /**
   * 清空所有条件
   */
  function clearConditions() {
    conditions.value.clear()
    isSearching.value = false
  }

  /**
   * 触发搜索
   */
  function triggerSearch() {
    if (hasConditions.value && onSearch) {
      debouncedSearch(activeConditions.value)
    }
  }

  /**
   * 立即执行搜索
   */
  async function executeSearch() {
    if (!hasConditions.value) return

    isSearching.value = true
    try {
      await onSearch?.(activeConditions.value)
    } finally {
      isSearching.value = false
    }
  }

  /**
   * 获取指定字段的条件值
   */
  function getConditionValue(field: string): string | undefined {
    return conditions.value.get(field)?.value
  }

  return {
    conditions,
    isSearching,
    hasConditions,
    activeConditions,
    setCondition,
    removeCondition,
    clearConditions,
    executeSearch,
    getConditionValue,
  }
}