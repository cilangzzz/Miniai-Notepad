import type { Note, NoteCreateDTO, NoteUpdateDTO } from '../entities'

/**
 * 笔记筛选条件
 */
export interface NoteFilter {
  category_id: string | null
  tags: string[]
  is_archived: boolean
  keyword?: string
}

/**
 * 笔记排序方式
 */
export interface NoteSort {
  field: 'created_at' | 'updated_at' | 'title'
  order: 'asc' | 'desc'
}

/**
 * 笔记Store状态
 */
export interface NoteStoreState {
  notes: Note[]
  currentNote: Note | null
  filter: NoteFilter
  sort: NoteSort
  loading: boolean
  error: string | null
}

/**
 * 笔记Store操作
 */
export interface NoteStoreActions {
  fetchNotes: () => Promise<void>
  createNote: (note: NoteCreateDTO) => Promise<Note>
  updateNote: (id: string, updates: NoteUpdateDTO) => Promise<Note>
  archiveNote: (id: string) => Promise<void>
  restoreNote: (id: string) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  setFilter: (filter: Partial<NoteFilter>) => void
  setSort: (sort: Partial<NoteSort>) => void
  clearFilter: () => void
}