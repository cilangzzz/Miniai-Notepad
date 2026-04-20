import type { SyncableEntity } from './syncable.types'

/**
 * 收入实体
 */
export interface Income extends SyncableEntity {
  // 核心属性
  amount: number          // 收入金额
  source: string          // 收入来源
  date: string            // 收入日期 (YYYY-MM-DD)
  note?: string           // 备注

  // 分类
  category?: string       // 收入分类（可选）
}

/**
 * 收入创建DTO
 */
export interface IncomeCreateDTO {
  amount: number
  source: string
  date: string
  note?: string
  category?: string
}

/**
 * 收入更新DTO
 */
export interface IncomeUpdateDTO {
  amount?: number
  source?: string
  date?: string
  note?: string
  category?: string
}

/**
 * 收入来源预设
 */
export const INCOME_SOURCES = [
  '工资', '奖金', '投资', '兼职', '礼金', '其他'
] as const