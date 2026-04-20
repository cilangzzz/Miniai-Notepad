export type { INewsRepository, NewsCacheConfig } from './INewsRepository'
export { NewsRepository } from './NewsRepository'

// 创建默认实例
import { NewsRepository } from './NewsRepository'
export const newsRepo = new NewsRepository()