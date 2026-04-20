import type { IRepository, QuerySpec } from '../base/IRepository'
import type { Note, NoteCreateDTO, NoteUpdateDTO } from '../../types/entities'

/**
 * 笔记Repository接口
 * 扩展基础接口，添加笔记特有的查询方法
 */
export interface INoteRepository extends IRepository<Note, NoteCreateDTO, NoteUpdateDTO> {
  /**
   * 按分类查找笔记
   * @param categoryId 分类ID
   * @returns 该分类下的所有非归档笔记
   */
  findByCategory(categoryId: string): Promise<Note[]>

  /**
   * 查找归档笔记
   * @returns 所有归档笔记
   */
  findArchived(): Promise<Note[]>

  /**
   * 查找置顶笔记
   * @returns 所有置顶笔记
   */
  findPinned(): Promise<Note[]>

  /**
   * 按关键词搜索
   * @param keyword 搜索关键词
   * @returns 标题或内容包含关键词的笔记
   */
  searchByKeyword(keyword: string): Promise<Note[]>

  /**
   * 归档笔记
   * @param id 笔记ID
   */
  archive(id: string): Promise<void>

  /**
   * 取消归档
   * @param id 笔记ID
   */
  unarchive(id: string): Promise<void>

  /**
   * 置顶笔记
   * @param id 笔记ID
   */
  pin(id: string): Promise<void>

  /**
   * 取消置顶
   * @param id 笔记ID
   */
  unpin(id: string): Promise<void>

  /**
   * 查找带提醒的笔记
   * @returns 所有设置了提醒且未触发的笔记
   */
  findWithReminder(): Promise<Note[]>

  /**
   * 按标签查找笔记
   * @param tagId 标签ID
   * @returns 包含该标签的笔记
   */
  findByTag(tagId: string): Promise<Note[]>
}