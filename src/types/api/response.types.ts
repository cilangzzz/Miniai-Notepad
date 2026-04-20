/**
 * API响应基础接口
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
}

/**
 * API错误结构
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

/**
 * 分页响应
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * 批量操作响应
 */
export interface BulkResponse<T> {
  success: number
  failed: number
  errors?: Array<{ id: string; error: string }>
  data?: T[]
}