import type { Category } from '../types'

/**
 * 预设分类ID
 */
export const PRESET_CATEGORY_IDS = {
  WORK: 'cat-work',
  PERSONAL: 'cat-personal',
  IDEAS: 'cat-ideas',
  TASKS: 'cat-tasks',
} as const

/**
 * 预设分类列表
 */
export const PRESET_CATEGORIES: Category[] = [
  {
    id: PRESET_CATEGORY_IDS.WORK,
    name: 'Work',
    slug: 'work',
    color: 'yellow',
    icon: 'work',
    note_count: 0,
    sort_order: 1,
    is_preset: true,
    sync_status: 'local',
    local_version: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
    is_deleted: false,
  },
  {
    id: PRESET_CATEGORY_IDS.PERSONAL,
    name: 'Personal',
    slug: 'personal',
    color: 'cyan',
    icon: 'person',
    note_count: 0,
    sort_order: 2,
    is_preset: true,
    sync_status: 'local',
    local_version: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
    is_deleted: false,
  },
  {
    id: PRESET_CATEGORY_IDS.IDEAS,
    name: 'Ideas',
    slug: 'ideas',
    color: 'white',
    icon: 'lightbulb',
    note_count: 0,
    sort_order: 3,
    is_preset: true,
    sync_status: 'local',
    local_version: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
    is_deleted: false,
  },
  {
    id: PRESET_CATEGORY_IDS.TASKS,
    name: 'Tasks',
    slug: 'tasks',
    color: 'gray',
    icon: 'check_circle',
    note_count: 0,
    sort_order: 4,
    is_preset: true,
    sync_status: 'local',
    local_version: 1,
    created_at: Date.now(),
    updated_at: Date.now(),
    is_deleted: false,
  },
]

/**
 * 分类图标映射
 */
export const CATEGORY_ICONS: Record<string, string> = {
  work: 'work',
  personal: 'person',
  ideas: 'lightbulb',
  tasks: 'check_circle',
} as const