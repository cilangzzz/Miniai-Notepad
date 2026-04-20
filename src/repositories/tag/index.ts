export type { ITagRepository } from './ITagRepository'
export { TagRepository } from './TagRepository'

// 创建默认实例
import { TagRepository } from './TagRepository'
export const tagRepo = new TagRepository()