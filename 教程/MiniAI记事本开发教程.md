# MiniAI记事本开发教程

> 本教程记录了 MiniAI记事本 (KINETIC_NOTES) 项目从需求分析到代码实现的完整开发过程。

---

## 目录

1. [项目概述](#1-项目概述)
2. [需求分析与PRD编写](#2-需求分析与prd编写)
3. [技术选型决策](#3-技术选型决策)
4. [系统架构设计](#4-系统架构设计)
5. [数据模型设计](#5-数据模型设计)
6. [Neo-Brutalist设计系统](#6-neo-brutalist设计系统)
7. [功能模块实现](#7-功能模块实现)
8. [项目初始化与骨架搭建](#8-项目初始化与骨架搭建)
9. [核心代码实现](#9-核心代码实现)
10. [响应式布局实现](#10-响应式布局实现)
11. [开发经验总结](#11-开发经验总结)

---

## 1. 项目概述

### 1.1 项目背景

MiniAI记事本定位为"轻量级个人信息管理中心"，整合高频使用场景（新闻、笔记、财务管理），采用独特的 **Neo-Brutalist** 设计风格，打造差异化视觉体验。

### 1.2 核心模块

| 模块 | 功能描述 |
|------|----------|
| **新闻模块** | 精选新闻内容浏览、收藏到笔记 |
| **记事本模块** | 笔记CRUD、分类管理、Bento Grid布局 |
| **分类标签模块** | 分类管理、标签云、统计信息 |
| **归档搜索模块** | 全文搜索、归档管理、笔记恢复 |
| **财务模块** | 收入/支出记录、收支统计、预算管理 |

### 1.3 技术栈

| 层级 | 技术选择 | 版本 |
|------|----------|------|
| 框架 | Vue 3 + Composition API | ^3.4 |
| 构建 | Vite | ^5.0 |
| 语言 | TypeScript (strict mode) | ^5.0 |
| 状态管理 | Pinia | ^2.1 |
| 路由 | Vue Router | ^4.2 |
| 样式 | Tailwind CSS | ^3.4 |
| 本地存储 | IndexedDB (Dexie.js) | ^3.2 |
| 富文本编辑 | Tiptap | ^3.22 |

---

## 2. 需求分析与PRD编写

### 2.1 用户画像

- **年龄**：18-35岁
- **职业**：白领/学生/自由职业者
- **核心诉求**：一站式管理、独特设计、快速操作
- **痛点**：多APP切换繁琐、记账工具复杂、新闻APP广告多

### 2.2 用户故事 (User Stories)

```
作为 用户
我想要 在一个APP中完成新闻阅读、笔记记录、收支管理
以便于 减少APP切换，提升生活效率
```

**优先级划分：**

| ID | 用户故事 | 优先级 |
|----|---------|--------|
| US-001 | 快速浏览精选新闻 | P0 |
| US-002 | 创建和编辑笔记 | P0 |
| US-003 | 分类管理笔记 | P0 |
| US-004 | 记录日常收入 | P0 |
| US-005 | 记录日常支出 | P0 |
| US-006 | 查看收支统计 | P0 |
| US-007 | 搜索历史笔记 | P1 |
| US-008 | 设置预算提醒 | P1 |
| US-009 | 归档笔记并可恢复 | P1 |
| US-010 | 同步数据到云端 | P2 |

### 2.3 核心设计规范

| 参数 | 值 | 描述 |
|------|-----|------|
| 主背景色 | `#131313` | 深黑色 |
| 主强调色 | `#FFD700` | 金黄色 |
| 次强调色 | `#007F7F` | 青色 |
| 边框粗细 | `4px` | 粗边框 |
| 圆角 | `0px` | 无圆角（Neo风格核心） |
| 阴影偏移 | `8px` | 硬偏移阴影 |

---

## 3. 技术选型决策

### 3.1 前端框架选择

**决策：Vue 3**

| 对比维度 | Vue 3 | React | Angular |
|----------|-------|-------|---------|
| 学习曲线 | 低 | 中 | 高 |
| 包体积 | ~40KB | ~45KB | ~130KB |
| TypeScript支持 | 原生支持 | 良好 | 原生支持 |
| Composition API | ✅ | Hooks模式 | RxJS |
| Vite官方支持 | ✅ | 需配置 | 需配置 |

**决策理由：**
1. Composition API 适合复杂业务逻辑抽象
2. Vite 官方支持，开发体验最佳
3. Pinia 状态管理简洁直观
4. 学习曲线平缓，团队上手快

### 3.2 前端存储方案

**决策：IndexedDB (Dexie.js封装)**

| 对比维度 | IndexedDB | localStorage | SQLite-WASM |
|----------|-----------|--------------|-------------|
| 存储容量 | GB级 | ~5MB | GB级 |
| 查询能力 | 索引查询 | 无 | SQL完整 |
| 异步API | ✅ | ❌ (阻塞) | ✅ |
| 云迁移成本 | 中 | 低 | 中 |

**决策理由：**
1. 容量充足，支持长期数据存储
2. 异步API不阻塞UI
3. Repository抽象层便于云迁移
4. Dexie.js简化IndexedDB API复杂度

### 3.3 状态管理方案

**决策：Pinia**

```typescript
// Pinia Store 示例
export const useNoteStore = defineStore('note', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)

  const pinnedNotes = computed(() =>
    notes.value.filter(n => n.is_pinned)
  )

  async function fetchNotes() {
    loading.value = true
    notes.value = await noteRepository.findAll()
    loading.value = false
  }

  return { notes, loading, pinnedNotes, fetchNotes }
})
```

### 3.4 UI组件方案

**决策：Tailwind CSS + 自定义组件库**

理由：Neo-Brutalist风格高度定制，现成UI组件库无法满足设计需求。

```javascript
// tailwind.config.js Neo风格扩展
module.exports = {
  theme: {
    extend: {
      colors: {
        'neo-bg': '#131313',
        'neo-primary': '#FFD700',
        'neo-secondary': '#007F7F',
      },
      boxShadow: {
        'neo': '8px 8px 0 0 rgba(255,255,255,0.8)',
        'neo-lg': '12px 12px 0 0 rgba(255,255,255,0.8)',
      },
    },
  },
}
```

---

## 4. 系统架构设计

### 4.1 分层架构

```
┌─────────────────────────────────────────┐
│           Presentation Layer             │
│    (Pages, Components, Router)           │
├─────────────────────────────────────────┤
│             State Layer                   │
│    (Pinia Store, Composables)            │
├─────────────────────────────────────────┤
│             Data Layer                    │
│    (Repository, Storage Adapter, API)    │
├─────────────────────────────────────────┤
│         Infrastructure Layer              │
│    (Utils, Constants, Types, Styles)     │
└─────────────────────────────────────────┘
```

### 4.2 目录结构

```
src/
├── app/                    # 应用入口
│   ├── App.vue
│   ├── main.ts
│   └── router/
│
├── components/             # 组件层
│   ├── base/               # 基础组件 (Base*)
│   ├── common/             # 通用组件
│   ├── business/           # 业务组件
│   │   ├── note/
│   │   ├── category/
│   │   ├── archive/
│   │   ├── finance/
│   │   └── news/
│   └── layout/
│
├── composables/            # 组合式函数
│   ├── useNotes.ts
│   ├── useFinance.ts
│   ├── useResponsive.ts
│   └── useToast.ts
│
├── stores/                 # Pinia状态管理
│   └── modules/
│       ├── noteStore.ts
│       ├── categoryStore.ts
│       └── uiStore.ts
│
├── repositories/           # 数据仓库层
│   ├── base/
│   ├── note/
│   └── finance/
│
├── storage/                # 存储适配层
│   └── adapters/
│       ├── IndexedDBAdapter.ts
│       └── IStorageAdapter.ts
│
├── types/                  # TypeScript类型定义
│   ├── entities/
│   ├── api/
│   └── common/
│
├── utils/                  # 工具函数
├── constants/              # 常量定义
├── config/                 # 配置文件
└── assets/                 # 静态资源
    └── styles/
        ├── variables.css
        └── neo-brutalist.css
```

### 4.3 Repository模式

```typescript
// Repository接口定义
interface IRepository<T> {
  findById(id: string): Promise<T | null>
  findAll(): Promise<T[]>
  create(data: CreateDTO): Promise<T>
  update(id: string, data: UpdateDTO): Promise<T>
  delete(id: string): Promise<void>
}

// 实现示例
class NoteRepository extends BaseRepository<Note> {
  async findByCategory(categoryId: string): Promise<Note[]> {
    return this.table
      .where('category_id')
      .equals(categoryId)
      .toArray()
  }

  async searchByKeyword(keyword: string): Promise<Note[]> {
    const lowerKeyword = keyword.toLowerCase()
    return this.table
      .filter(note =>
        note.title.toLowerCase().includes(lowerKeyword) ||
        note.content.toLowerCase().includes(lowerKeyword)
      )
      .toArray()
  }
}
```

---

## 5. 数据模型设计

### 5.1 云迁移预留设计

所有实体包含同步预留字段：

```typescript
interface SyncableEntity {
  id: string              // UUID，本地生成
  cloud_id?: string       // 云端ID（同步后填充）
  sync_status: 'local' | 'synced' | 'pending' | 'conflict'
  local_version: number   // 乐观锁版本号
  created_at: number      // 创建时间戳
  updated_at: number      // 更新时间戳
  is_deleted: boolean     // 软删除标记
}
```

### 5.2 笔记实体 (Note)

```typescript
interface Note extends SyncableEntity {
  title: string           // 笔记标题 (≤50字符)
  content: string         // 笔记内容 (≤5000字符，支持HTML)
  category_id: string     // 分类ID引用
  tags: string[]          // 标签ID列表

  // 卡片展示属性
  card_type: 'text' | 'image' | 'task' | 'quote'
  card_color: 'yellow' | 'cyan' | 'white' | 'gray' | 'dark'
  font_weight: 'normal' | 'medium' | 'bold' | 'extrabold'

  // 状态标记
  is_archived: boolean
  is_pinned: boolean

  // 提醒设置
  reminder_at?: number
}
```

### 5.3 IndexedDB Schema

```typescript
// 使用Dexie定义数据库
class MiniAIDB extends Dexie {
  notes!: Table<Note, string>
  categories!: Table<Category, string>
  tags!: Table<Tag, string>
  incomes!: Table<Income, string>
  expenses!: Table<Expense, string>

  constructor() {
    super('MiniAIDB')

    this.version(1).stores({
      notes: 'id, cloud_id, category_id, is_archived, created_at, updated_at',
      categories: 'id, slug, sort_order',
      tags: 'id, name, usage_count',
      incomes: 'id, date, source',
      expenses: 'id, date, category',
    })
  }
}

export const db = new MiniAIDB()
```

---

## 6. Neo-Brutalist设计系统

### 6.1 CSS变量定义

```css
/* assets/styles/variables.css */
:root {
  /* Colors */
  --color-bg-primary: #131313;
  --color-bg-secondary: #1a1a1a;

  --color-accent-yellow: #FFD700;
  --color-accent-cyan: #007F7F;

  --color-border: #FFFFFF;

  /* Typography */
  --font-heading: 'Space Grotesk', sans-serif;
  --font-body: 'Manrope', sans-serif;

  /* Borders - Neo核心 */
  --border-width: 4px;
  --border-radius: 0px;  /* 无圆角 */

  /* Shadows */
  --shadow-offset: 8px;
}
```

### 6.2 Neo组件样式

```css
/* Neo-Card */
.neo-card {
  background: var(--color-bg-secondary);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--border-radius);  /* 0px */
  box-shadow: var(--shadow-offset) var(--shadow-offset) 0 rgba(255,255,255,0.1);
  transition: transform 150ms ease, box-shadow 150ms ease;
}

.neo-card:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 rgba(255,255,255,0.1);
}

/* Neo-Button */
.neo-btn {
  font-family: var(--font-heading);
  font-weight: 700;
  text-transform: uppercase;
  border: var(--border-width) solid var(--color-border);
  border-radius: 0;
  background: var(--color-bg-secondary);
  color: white;
  cursor: pointer;
}

.neo-btn:hover {
  transform: translate(-2px, -2px);
  box-shadow: 4px 4px 0 var(--shadow-color);
}

.neo-btn--yellow {
  background: var(--color-accent-yellow);
  color: var(--color-bg-primary);
}

/* Neo-Tag（带旋转） */
.neo-tag {
  display: inline-flex;
  font-weight: 700;
  text-transform: uppercase;
  border: 2px solid white;
  border-radius: 0;
  transition: transform 150ms ease;
}

.neo-tag--rotate-left {
  transform: rotate(-3deg);
}

.neo-tag--rotate-right {
  transform: rotate(3deg);
}

.neo-tag:hover {
  transform: rotate(0deg);  /* Hover归位 */
}

/* Neo-FAB */
.neo-fab {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 80px;
  height: 80px;
  background: var(--color-accent-yellow);
  border: 4px solid white;
  border-radius: 0;
  box-shadow: 8px 8px 0 rgba(0,0,0,1);
}

.neo-fab:hover {
  transform: translate(-4px, -4px);
  box-shadow: 12px 12px 0 rgba(0,0,0,1);
}
```

### 6.3 自定义滚动条

```css
.neo-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.neo-scrollbar::-webkit-scrollbar-track {
  background: #0e0e0e;
}

.neo-scrollbar::-webkit-scrollbar-thumb {
  background: #FFD700;  /* 黄色滚动条 */
  border: 4px solid white;
}

.neo-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #007F7F;
}
```

---

## 7. 功能模块实现

### 7.1 编辑器模块架构

```
EditNotePage (页面组件)
├── EditorToolbar (顶部栏)
│   ├── CloseButton
│   ├── UndoButton / RedoButton
│   └── SaveButton
├── TitleEditor (标题编辑器)
├── RichTextEditor (富文本编辑器 - Tiptap)
├── EditorSidebar (侧边栏 - Desktop)
│   ├── TaxonomyPanel (标签管理)
│   ├── ReminderPanel (提醒设置)
│   └── CardChromatic (外观控制)
├── SaveFAB (保存浮动按钮)
└── RichTextToolbar (移动端工具栏)
```

### 7.2 笔记卡片类型

| card_type | 特点 |
|-----------|------|
| `text` | 默认文本卡片，显示标题+内容摘要 |
| `image` | 图片卡片，顶部图片+底部内容 |
| `task` | 任务卡片，显示checkbox样式 |
| `quote` | 引用卡片，居中显示引言 |

### 7.3 Bento Grid布局

```vue
<!-- components/common/BentoGrid.vue -->
<template>
  <div
    class="grid gap-4"
    :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    }"
  >
    <slot
      v-for="item in items"
      :key="item.id"
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive'

const { gridColumns } = useResponsive()
const columns = computed(() => gridColumns.value)  // 1/2/3列
</script>
```

---

## 8. 项目初始化与骨架搭建

### 8.1 创建Vue3项目

```bash
# 使用Vite创建项目
npm create vite@latest miniai-notepad -- --template vue-ts

# 进入项目目录
cd miniai-notepad

# 安装依赖
npm install
```

### 8.2 安装核心依赖

```bash
# 状态管理
npm install pinia

# 路由
npm install vue-router

# IndexedDB封装
npm install dexie dexie-react-hooks

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 富文本编辑器
npm install @tiptap/vue-3 @tiptap/starter-kit
npm install @tiptap/extension-underline @tiptap/extension-link @tiptap/extension-image

# 工具库
npm install dayjs
```

### 8.3 配置Tailwind CSS

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#131313',
        'surface': '#1a1a1a',
        'surface-container': '#2a2a2a',
        'primary-container': '#FFD700',
        'secondary-container': '#007F7F',
        'on-background': '#FFFFFF',
        'on-primary': '#000000',
      },
      fontFamily: {
        'headline': ['Space Grotesk', 'sans-serif'],
        'body': ['Manrope', 'sans-serif'],
      },
      borderWidth: {
        'neo': '4px',
      },
      boxShadow: {
        'neo': '8px 8px 0 0 rgba(255,255,255,0.1)',
        'neo-black': '8px 8px 0 0 rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
}
```

### 8.4 初始化项目结构

```bash
# 创建目录结构
mkdir -p src/components/base
mkdir -p src/components/common
mkdir -p src/components/business/note
mkdir -p src/components/business/category
mkdir -p src/components/business/finance
mkdir -p src/composables
mkdir -p src/stores/modules
mkdir -p src/repositories
mkdir -p src/storage/adapters
mkdir -p src/types/entities
mkdir -p src/pages
mkdir -p src/assets/styles
```

---

## 9. 核心代码实现

### 9.1 IndexedDB初始化

```typescript
// storage/db.ts
import Dexie, { Table } from 'dexie'

export interface Note {
  id: string
  title: string
  content: string
  category_id: string
  tags: string[]
  card_type: 'text' | 'image' | 'task' | 'quote'
  card_color: 'yellow' | 'cyan' | 'white' | 'gray' | 'dark'
  font_weight: 'normal' | 'medium' | 'bold' | 'extrabold'
  is_archived: boolean
  is_pinned: boolean
  created_at: number
  updated_at: number
}

export class MiniAIDB extends Dexie {
  notes!: Table<Note, string>
  categories!: Table<Category, string>
  tags!: Table<Tag, string>
  incomes!: Table<Income, string>
  expenses!: Table<Expense, string>

  constructor() {
    super('MiniAIDB')
    this.version(1).stores({
      notes: 'id, category_id, is_archived, created_at, updated_at',
      categories: 'id, slug',
      tags: 'id, name',
      incomes: 'id, date',
      expenses: 'id, date, category',
    })
  }
}

export const db = new MiniAIDB()
```

### 9.2 Pinia Store实现

```typescript
// stores/modules/noteStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { db } from '@/storage/db'
import type { Note } from '@/storage/db'

export const useNoteStore = defineStore('note', () => {
  const notes = ref<Note[]>([])
  const loading = ref(false)
  const currentCategory = ref<string | null>(null)

  // Getters
  const filteredNotes = computed(() => {
    let result = notes.value.filter(n => !n.is_archived)
    if (currentCategory.value) {
      result = result.filter(n => n.category_id === currentCategory.value)
    }
    return result.sort((a, b) => b.updated_at - a.updated_at)
  })

  const pinnedNotes = computed(() =>
    notes.value.filter(n => n.is_pinned && !n.is_archived)
  )

  // Actions
  async function fetchNotes() {
    loading.value = true
    try {
      notes.value = await db.notes.toArray()
    } finally {
      loading.value = false
    }
  }

  async function createNote(data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    const now = Date.now()
    const note: Note = {
      id: crypto.randomUUID(),
      ...data,
      created_at: now,
      updated_at: now,
    }
    await db.notes.add(note)
    notes.value.unshift(note)
    return note
  }

  async function updateNote(id: string, changes: Partial<Note>) {
    await db.notes.update(id, {
      ...changes,
      updated_at: Date.now(),
    })
    const index = notes.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notes.value[index] = { ...notes.value[index], ...changes }
    }
  }

  async function archiveNote(id: string) {
    await updateNote(id, { is_archived: true })
  }

  async function deleteNote(id: string) {
    await db.notes.delete(id)
    notes.value = notes.value.filter(n => n.id !== id)
  }

  return {
    notes,
    loading,
    currentCategory,
    filteredNotes,
    pinnedNotes,
    fetchNotes,
    createNote,
    updateNote,
    archiveNote,
    deleteNote,
  }
})
```

### 9.3 Composables实现

```typescript
// composables/useResponsive.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const windowWidth = ref(window.innerWidth)

  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const isMobile = computed(() => windowWidth.value < 768)
  const isTablet = computed(() =>
    windowWidth.value >= 768 && windowWidth.value < 1024
  )
  const isDesktop = computed(() => windowWidth.value >= 1024)

  const gridColumns = computed(() => {
    if (isMobile.value) return 1
    if (isTablet.value) return 2
    return 3
  })

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    gridColumns,
  }
}
```

```typescript
// composables/useToast.ts
import { ref } from 'vue'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning'
}

export function useToast() {
  const toasts = ref<Toast[]>([])

  function show(message: string, type: Toast['type'] = 'success') {
    const toast: Toast = {
      id: crypto.randomUUID(),
      message,
      type,
    }
    toasts.value.push(toast)

    // Auto remove after 3 seconds
    setTimeout(() => {
      remove(toast.id)
    }, 3000)
  }

  function remove(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    warning: (msg: string) => show(msg, 'warning'),
    remove,
  }
}
```

### 9.4 NoteCard组件

```vue
<!-- components/business/note/NoteCard.vue -->
<script setup lang="ts">
import type { Note, CardColor } from '@/types/entities'

interface Props {
  note: Note
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
})

const emit = defineEmits<{
  click: [id: string]
  edit: [id: string]
  archive: [id: string]
  delete: [id: string]
}>()

const colorClasses = computed(() => {
  const colors: Record<CardColor, string> = {
    yellow: 'bg-primary-container text-on-primary',
    cyan: 'bg-secondary-container text-white',
    white: 'bg-white text-background',
    gray: 'bg-surface-container-high text-on-background',
    dark: 'bg-surface-container-lowest text-on-background',
  }
  return colors[props.note.card_color]
})

const formattedDate = computed(() => {
  const date = new Date(props.note.updated_at)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
})
</script>

<template>
  <article
    :class="[
      'group relative border-4 border-white rounded-none',
      'shadow-neo-black p-6',
      'hover:-translate-y-1 hover:-translate-x-1',
      'transition-all duration-150 cursor-pointer',
      colorClasses,
    ]"
    @click="emit('click', note.id)"
  >
    <!-- Category tag -->
    <div class="flex justify-between items-start mb-4">
      <span
        class="bg-primary-container text-on-primary text-[10px] font-black
               uppercase px-2 py-1 border-2 border-white -rotate-2"
      >
        {{ note.category_id }}
      </span>
      <span class="text-white/60 text-xs font-bold">
        {{ formattedDate }}
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-headline font-black text-2xl uppercase tracking-tighter -skew-x-1 mb-3">
      {{ note.title }}
    </h3>

    <!-- Content preview -->
    <p class="font-body text-sm leading-relaxed opacity-80 mb-6">
      {{ note.content.slice(0, 150) }}...
    </p>

    <!-- Hover actions -->
    <div
      class="absolute bottom-4 right-4 flex gap-2
             opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <button
        class="p-2 bg-black/20 border-2 border-current hover:bg-white/20"
        @click.stop="emit('edit', note.id)"
      >
        <span class="material-symbols-outlined text-sm">edit</span>
      </button>
      <button
        class="p-2 bg-black/20 border-2 border-current hover:bg-error-container"
        @click.stop="emit('archive', note.id)"
      >
        <span class="material-symbols-outlined text-sm">archive</span>
      </button>
    </div>
  </article>
</template>
```

---

## 10. 响应式布局实现

### 10.1 断点定义

| 断点 | 宽度 | 布局变化 |
|------|------|----------|
| Mobile | < 768px | 单列，底部导航，隐藏侧边栏 |
| Tablet | 768px - 1024px | 双列，侧边栏可选 |
| Desktop | >= 1024px | 三列，左侧固定导航 |

### 10.2 响应式组件

```vue
<!-- App.vue -->
<template>
  <div class="min-h-screen bg-background">
    <!-- Desktop: 左侧导航 -->
    <NavigationDrawer v-if="isDesktop" />

    <!-- Main content -->
    <main :class="[
      'transition-all duration-300',
      isDesktop ? 'ml-64' : ''
    ]">
      <TopAppBar />
      <router-view />
    </main>

    <!-- Mobile: 底部导航 -->
    <BottomNavBar v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
import { useResponsive } from '@/composables/useResponsive'
const { isMobile, isDesktop } = useResponsive()
</script>
```

### 10.3 Bento Grid响应式

```vue
<!-- 响应式网格 -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <NoteCard v-for="note in notes" :key="note.id" :note="note" />
</div>
```

---

## 11. 开发经验总结

### 11.1 Neo-Brutalist设计要点

1. **核心特征**：无圆角 (`border-radius: 0`)、粗边框 (`4px solid`)、硬偏移阴影
2. **Hover交互**：上移 (`-translate-y`) + 阴影增强
3. **标签旋转**：使用 `rotate(-3deg) ~ rotate(3deg)`，Hover归位
4. **字体选择**：Space Grotesk (标题) + Manrope (正文)

### 11.2 Repository模式优势

1. **存储无关性**：业务代码不直接操作IndexedDB
2. **云迁移友好**：只需替换Repository实现
3. **测试便利**：可注入Mock Repository

### 11.3 Vue3 Composition API最佳实践

1. **Composables封装**：逻辑复用，如 `useResponsive`, `useToast`
2. **Store分层**：Pinia按功能模块划分
3. **类型安全**：TypeScript strict mode + 接口定义

### 11.4 性能优化建议

1. **懒加载**：路由组件动态导入
2. **虚拟列表**：大数据量笔记列表
3. **缓存策略**：IndexedDB数据缓存

---

## 附录：文档引用

| 文档 | 路径 |
|------|------|
| PRD v1.1 | `产品方案/MiniAI记事本-PRD-v1.1-20260420.md` |
| 用户故事 | `产品方案/MiniAI记事本-用户故事-v1.1-20260420.md` |
| 技术选型报告 | `研发方案/技术选型报告.md` |
| ADR-001 | `研发方案/ADR-001-前端存储方案.md` |
| 系统架构设计 | `研发方案/系统架构设计.md` |
| 数据模型设计 | `研发方案/数据模型设计.md` |
| 编辑器模块方案 | `研发方案/功能实现方案/编辑器模块.md` |

---

**教程编写日期**：2026-04-20
**项目状态**：开发进行中