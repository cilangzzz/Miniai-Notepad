/**
 * 分页信息
 */
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page: number
  pageSize: number
}

/**
 * 创建默认分页参数
 */
export function defaultPageParams(): PageParams {
  return { page: 1, pageSize: 20 }
}

/**
 * 计算总页数
 */
export function calculateTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize)
}

/**
 * 计算偏移量
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize
}