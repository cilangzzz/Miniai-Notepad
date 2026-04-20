import type { Income, IncomeCreateDTO, IncomeUpdateDTO, INCOME_SOURCES } from './finance.types'

/**
 * 支出实体
 */
export interface Expense extends SyncableEntity {
  // 核心属性
  amount: number          // 支出金额
  category: string        // 支出分类
  date: string            // 支出日期 (YYYY-MM-DD)
  note?: string           // 备注

  // 预算关联
  budget_id?: string      // 预算ID（可选）
}

/**
 * 支出创建DTO
 */
export interface ExpenseCreateDTO {
  amount: number
  category: string
  date: string
  note?: string
  budget_id?: string
}

/**
 * 支出更新DTO
 */
export interface ExpenseUpdateDTO {
  amount?: number
  category?: string
  date?: string
  note?: string
  budget_id?: string
}

/**
 * 支出分类预设
 */
export const EXPENSE_CATEGORIES = [
  '餐饮', '交通', '购物', '娱乐', '居住', '医疗', '教育', '其他'
] as const

// Re-export from finance.types
export type { Income, IncomeCreateDTO, IncomeUpdateDTO }
export { INCOME_SOURCES }