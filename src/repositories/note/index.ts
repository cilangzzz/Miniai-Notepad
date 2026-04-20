export type { INoteRepository } from './INoteRepository'
export { NoteRepository } from './NoteRepository'

// 创建默认实例
import { NoteRepository } from './NoteRepository'
export const noteRepo = new NoteRepository()