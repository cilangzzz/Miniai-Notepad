/**
 * 结果类型 - 用于操作结果封装
 */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E }

/**
 * 创建成功结果
 */
export function success<T>(data: T): Result<T> {
  return { success: true, data }
}

/**
 * 创建失败结果
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error }
}

/**
 * 判断是否成功
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true
}

/**
 * 判断是否失败
 */
export function isFailure<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false
}