// Repository层总导出

// 基类
export type {
  IRepository,
  QuerySpec,
  FilterCondition,
  SortSpec,
  ConflictResolution
} from './base'
export { BaseRepository } from './base'

// 笔记
export type { INoteRepository } from './note'
export { NoteRepository, noteRepo } from './note'

// 分类
export type { ICategoryRepository } from './category'
export { CategoryRepository, categoryRepo } from './category'

// 标签
export type { ITagRepository } from './tag'
export { TagRepository, tagRepo } from './tag'

// 财务
export type {
  IFinanceRepository,
  MonthlySummary,
  CategorySummary,
  SourceSummary,
  TrendData
} from './finance'
export { FinanceRepository, financeRepo } from './finance'

// 新闻
export type { INewsRepository, NewsCacheConfig } from './news'
export { NewsRepository, newsRepo } from './news'