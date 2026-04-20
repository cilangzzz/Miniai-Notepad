/**
 * API请求基础接口
 */
export interface ApiRequest {
  headers?: Record<string, string>
  timeout?: number
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * 筛选请求参数
 */
export interface FilterParams {
  category_id?: string
  tags?: string[]
  is_archived?: boolean
  is_pinned?: boolean
  date_from?: string
  date_to?: string
  keyword?: string
}

/**
 * 新闻请求参数
 */
export interface NewsRequestParams extends PaginationParams {
  category?: string
  source?: string
  date_from?: string
  date_to?: string
}