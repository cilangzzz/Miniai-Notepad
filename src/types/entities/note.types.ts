import type { SyncableEntity } from './syncable.types'

/**
 * 卡片类型枚举
 */
export type CardType = 'text' | 'image' | 'task' | 'quote'

/**
 * 卡片颜色枚举
 */
export type CardColor = 'yellow' | 'cyan' | 'white' | 'gray' | 'dark'

/**
 * 字体粗细枚举
 */
export type FontWeight = 'normal' | 'medium' | 'bold' | 'extrabold'

/**
 * 提醒状态枚举
 */
export type ReminderStatus = 'pending' | 'triggered' | 'dismissed'

/**
 * 附件结构（预留扩展）
 */
export interface Attachment {
  id: string
  type: 'image' | 'file' | 'link'
  url: string
  thumbnail?: string
  size?: number
}

/**
 * 笔记实体
 */
export interface Note extends SyncableEntity {
  // 核心内容
  title: string           // 笔记标题 (≤50字符)
  content: string         // 笔记内容 (≤5000字符)

  // 分类与标签
  category_id: string     // 分类ID引用
  tags: string[]          // 标签ID列表

  // 卡片展示属性
  card_type: CardType     // 卡片类型
  card_color: CardColor   // 卡片颜色
  font_weight: FontWeight // 字体粗细

  // 状态标记
  is_archived: boolean    // 是否归档
  archived_at?: number    // 归档时间戳
  is_pinned: boolean      // 是否置顶
  pinned_at?: number      // 置顶时间戳

  // 提醒设置
  reminder_at?: number    // 提醒时间戳
  reminder_status?: ReminderStatus

  // 附件（预留）
  attachments?: Attachment[]
}

/**
 * 笔记创建DTO
 */
export interface NoteCreateDTO {
  title: string
  content: string
  category_id: string
  tags?: string[]
  card_type?: CardType
  card_color?: CardColor
  font_weight?: FontWeight
  is_pinned?: boolean
  reminder_at?: number
}

/**
 * 笔记更新DTO
 */
export interface NoteUpdateDTO {
  title?: string
  content?: string
  category_id?: string
  tags?: string[]
  card_type?: CardType
  card_color?: CardColor
  font_weight?: FontWeight
  is_archived?: boolean
  is_pinned?: boolean
  reminder_at?: number
  reminder_status?: ReminderStatus
}