export type { ICategoryRepository } from './ICategoryRepository'
export { CategoryRepository } from './CategoryRepository'

// 创建默认实例
import { CategoryRepository } from './CategoryRepository'
export const categoryRepo = new CategoryRepository()