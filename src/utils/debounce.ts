/**
 * 防抖函数
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args)
      timeoutId = null
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn - 要执行的函数
 * @param delay - 延迟时间（毫秒）
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = delay - (now - lastCall)

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCall = now
      fn.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        fn.apply(this, args)
      }, remaining)
    }
  }
}

/**
 * 创建防抖 Promise
 * @param fn - 返回Promise的函数
 * @param delay - 延迟时间
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let pendingPromise: Promise<ReturnType<T>> | null = null

  return function (this: unknown, ...args: Parameters<T>): Promise<ReturnType<T>> {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    pendingPromise = new Promise<ReturnType<T>>((resolve) => {
      timeoutId = setTimeout(async () => {
        const result = await fn.apply(this, args) as ReturnType<T>
        resolve(result)
        timeoutId = null
        pendingPromise = null
      }, delay)
    })

    return pendingPromise
  }
}