import { ref, computed } from 'vue'

/**
 * 编辑器历史记录封装
 * 提供撤销/重做功能
 */
export interface HistoryState<T> {
  past: T[]
  present: T
  future: T[]
}

export interface EditorHistoryOptions<T> {
  /** 最大历史记录数量 */
  maxHistory?: number
  /** 初始状态 */
  initialState?: T
}

export function useEditorHistory<T>(options: EditorHistoryOptions<T> = {}) {
  const { maxHistory = 50, initialState } = options

  const history = ref<HistoryState<T>>({
    past: [],
    present: initialState ?? ({} as T),
    future: [],
  })

  // Computed
  const canUndo = computed(() => history.value.past.length > 0)
  const canRedo = computed(() => history.value.future.length > 0)
  const historyLength = computed(() => history.value.past.length + 1 + history.value.future.length)
  const currentIndex = computed(() => history.value.past.length)

  /**
   * 获取当前状态
   */
  function getState(): T {
    return history.value.present
  }

  /**
   * 推入新状态
   */
  function pushState(state: T): void {
    // 添加当前状态到历史
    history.value.past.push(history.value.present)

    // 设置新状态
    history.value.present = state

    // 清空未来状态（新的修改会清空重做栈）
    history.value.future = []

    // 限制历史记录数量
    if (history.value.past.length > maxHistory) {
      history.value.past.shift()
    }
  }

  /**
   * 撤销
   */
  function undo(): T | null {
    if (!canUndo.value) return null

    // 从过去栈取出上一个状态
    const previous = history.value.past.pop()!

    // 当前状态推入未来栈
    history.value.future.unshift(history.value.present)

    // 设置新当前状态
    history.value.present = previous

    return previous
  }

  /**
   * 重做
   */
  function redo(): T | null {
    if (!canRedo.value) return null

    // 从未来栈取出下一个状态
    const next = history.value.future.shift()!

    // 当前状态推入过去栈
    history.value.past.push(history.value.present)

    // 设置新当前状态
    history.value.present = next

    return next
  }

  /**
   * 重置历史
   */
  function reset(state: T): void {
    history.value = {
      past: [],
      present: state,
      future: [],
    }
  }

  /**
   * 清空历史
   */
  function clear(): void {
    history.value.past = []
    history.value.future = []
  }

  /**
   * 获取历史记录列表
   */
  function getHistoryList(): T[] {
    return [...history.value.past, history.value.present, ...history.value.future]
  }

  /**
   * 跳转到指定历史点
   */
  function jumpTo(index: number): T | null {
    const totalLength = historyLength.value
    if (index < 0 || index >= totalLength) return null

    const currentIdx = currentIndex.value

    if (index < currentIdx) {
      // 向后跳转（撤销）
      const steps = currentIdx - index
      for (let i = 0; i < steps; i++) {
        undo()
      }
    } else if (index > currentIdx) {
      // 向前跳转（重做）
      const steps = index - currentIdx
      for (let i = 0; i < steps; i++) {
        redo()
      }
    }

    return history.value.present
  }

  /**
   * 获取上一个状态（预览）
   */
  function peekPrevious(): T | null {
    if (!canUndo.value) return null
    return history.value.past[history.value.past.length - 1]
  }

  /**
   * 获取下一个状态（预览）
   */
  function peekNext(): T | null {
    if (!canRedo.value) return null
    return history.value.future[0]
  }

  return {
    history,
    canUndo,
    canRedo,
    historyLength,
    currentIndex,
    getState,
    pushState,
    undo,
    redo,
    reset,
    clear,
    getHistoryList,
    jumpTo,
    peekPrevious,
    peekNext,
  }
}

/**
 * 简化版编辑器历史
 * 针对文本内容优化
 */
export interface TextHistoryOptions {
  maxHistory?: number
  initialContent?: string
}

export function useTextHistory(options: TextHistoryOptions = {}) {
  const { maxHistory = 100, initialContent = '' } = options

  const contentHistory = useEditorHistory<string>({
    maxHistory,
    initialState: initialContent,
  })

  const content = computed(() => contentHistory.getState())

  /**
   * 更新内容
   */
  function updateContent(newContent: string): void {
    contentHistory.pushState(newContent)
  }

  /**
   * 撤销内容变更
   */
  function undoContent(): string {
    const previous = contentHistory.undo()
    return previous ?? content.value
  }

  /**
   * 重做内容变更
   */
  function redoContent(): string {
    const next = contentHistory.redo()
    return next ?? content.value
  }

  return {
    content,
    canUndo: contentHistory.canUndo,
    canRedo: contentHistory.canRedo,
    updateContent,
    undoContent,
    redoContent,
    reset: contentHistory.reset,
    clear: contentHistory.clear,
  }
}

/**
 * 表单历史记录
 * 针对表单对象优化
 */
export interface FormHistoryOptions<T extends Record<string, unknown>> {
  maxHistory?: number
  initialForm?: T
  deepClone?: boolean
}

export function useFormHistory<T extends Record<string, unknown>>(options: FormHistoryOptions<T> = {}) {
  const { maxHistory = 30, initialForm, deepClone = true } = options

  const clone = (obj: T): T => {
    if (deepClone) {
      return JSON.parse(JSON.stringify(obj)) as T
    }
    return { ...obj }
  }

  const formHistory = useEditorHistory<T>({
    maxHistory,
    initialState: initialForm ? clone(initialForm) : {} as T,
  })

  const form = computed(() => formHistory.getState())

  /**
   * 更新单个字段
   */
  function updateField<K extends keyof T>(field: K, value: T[K]): void {
    const newForm = clone(form.value)
    newForm[field] = value
    formHistory.pushState(newForm)
  }

  /**
   * 更新多个字段
   */
  function updateFields(updates: Partial<T>): void {
    const newForm = clone(form.value)
    Object.assign(newForm, updates)
    formHistory.pushState(newForm)
  }

  /**
   * 重置表单
   */
  function resetForm(initialState?: T): void {
    formHistory.reset(initialState ? clone(initialState) : {} as T)
  }

  /**
   * 撤销表单变更
   */
  function undoForm(): T {
    const previous = formHistory.undo()
    return previous ?? form.value
  }

  /**
   * 重做表单变更
   */
  function redoForm(): T {
    const next = formHistory.redo()
    return next ?? form.value
  }

  return {
    form,
    canUndo: formHistory.canUndo,
    canRedo: formHistory.canRedo,
    updateField,
    updateFields,
    resetForm,
    undoForm,
    redoForm,
  }
}