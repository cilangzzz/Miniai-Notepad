import { BaseRepository } from '../base/BaseRepository'
import type { INoteRepository } from './INoteRepository'
import { getDB } from '../../storage/db'
import type { Note, NoteCreateDTO, NoteUpdateDTO } from '../../types/entities'
import type { QuerySpec, FilterCondition } from '../base/IRepository'

/**
 * 笔记Repository实现
 * 提供笔记的CRUD操作和特有查询方法
 */
export class NoteRepository extends BaseRepository<Note, NoteCreateDTO, NoteUpdateDTO>
  implements INoteRepository {

  constructor() {
    super(getDB().notes)
  }

  /**
   * 创建笔记，添加必要的默认字段
   */
  async create(data: NoteCreateDTO): Promise<Note> {
    const now = Date.now()
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: data.title,
      content: data.content,
      category_id: data.category_id,
      tags: data.tags || [],
      card_type: data.card_type || 'text',
      card_color: data.card_color || 'yellow',
      font_weight: data.font_weight || 'normal',
      is_archived: false,
      is_pinned: data.is_pinned || false,
      reminder_at: data.reminder_at,
      reminder_status: data.reminder_at ? 'pending' : undefined,
      attachments: undefined,
      // SyncableEntity fields
      cloud_id: undefined,
      sync_status: 'local',
      local_version: 1,
      cloud_version: undefined,
      created_at: now,
      updated_at: now,
      last_sync_at: undefined,
      is_deleted: false,
      deleted_at: undefined,
    }

    await this.table.add(newNote)
    return newNote
  }

  async findByCategory(categoryId: string): Promise<Note[]> {
    return this.table
      .filter(note => note.category_id === categoryId && !note.is_archived && !note.is_deleted)
      .toArray()
  }

  async findArchived(): Promise<Note[]> {
    return this.table
      .filter(note => note.is_archived && !note.is_deleted)
      .toArray()
  }

  async findPinned(): Promise<Note[]> {
    return this.table
      .filter(note => note.is_pinned && !note.is_archived && !note.is_deleted)
      .toArray()
  }

  async searchByKeyword(keyword: string): Promise<Note[]> {
    const lowerKeyword = keyword.toLowerCase()
    return this.table
      .filter(note =>
        !note.is_deleted &&
        !note.is_archived &&
        (note.title.toLowerCase().includes(lowerKeyword) ||
          note.content.toLowerCase().includes(lowerKeyword))
      )
      .toArray()
  }

  async archive(id: string): Promise<void> {
    await this.update(id, {
      is_archived: true,
      archived_at: Date.now(),
    } as NoteUpdateDTO)
  }

  async unarchive(id: string): Promise<void> {
    await this.update(id, {
      is_archived: false,
      archived_at: undefined,
    } as NoteUpdateDTO)
  }

  async pin(id: string): Promise<void> {
    await this.update(id, {
      is_pinned: true,
      pinned_at: Date.now(),
    } as NoteUpdateDTO)
  }

  async unpin(id: string): Promise<void> {
    await this.update(id, {
      is_pinned: false,
      pinned_at: undefined,
    } as NoteUpdateDTO)
  }

  async findWithReminder(): Promise<Note[]> {
    return this.table
      .filter(note =>
        !note.is_deleted &&
        !note.is_archived &&
        note.reminder_at !== undefined &&
        note.reminder_status === 'pending'
      )
      .toArray()
  }

  async findByTag(tagId: string): Promise<Note[]> {
    return this.table
      .filter(note =>
        !note.is_deleted &&
        !note.is_archived &&
        note.tags.includes(tagId)
      )
      .toArray()
  }

  /**
   * 获取所有活跃笔记（非归档、非删除）
   * 按置顶优先、创建时间倒序排列
   */
  async findAllActiveSorted(): Promise<Note[]> {
    const notes = await this.table
      .filter(note => !note.is_deleted && !note.is_archived)
      .toArray()

    // 排序：置顶优先，然后按创建时间倒序
    return notes.sort((a, b) => {
      // 置顶笔记优先
      if (a.is_pinned !== b.is_pinned) {
        return a.is_pinned ? -1 : 1
      }
      // 同为置顶或非置顶时，按创建时间倒序
      return b.created_at - a.created_at
    })
  }

  /**
   * 查询笔记的筛选器实现
   */
  protected applyFilter(collection: Dexie.Collection<Note, string>, filter: FilterCondition): Dexie.Collection<Note, string> {
    return collection.and(note => {
      if (note.is_deleted) return false

      if (filter.field === 'category_id' && filter.operator === 'eq') {
        return note.category_id === filter.value
      }

      if (filter.field === 'is_archived' && filter.operator === 'eq') {
        return note.is_archived === filter.value
      }

      if (filter.field === 'is_pinned' && filter.operator === 'eq') {
        return note.is_pinned === filter.value
      }

      return true
    })
  }

  /**
   * 更新提醒状态
   */
  async updateReminderStatus(id: string, status: 'pending' | 'triggered' | 'dismissed'): Promise<void> {
    await this.update(id, {
      reminder_status: status,
    } as NoteUpdateDTO)
  }
}