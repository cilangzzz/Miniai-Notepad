import type { Income, IncomeCreateDTO, IncomeUpdateDTO } from '../../types/entities'
import type { Expense, ExpenseCreateDTO, ExpenseUpdateDTO } from '../../types/entities/expense.types'

/**
 * 月度汇总数据
 */
export interface MonthlySummary {
  month: string           // YYYY-MM 格式
  totalIncome: number     // 收入总额
  totalExpense: number    // 支出总额
  balance: number         // 结余（收入-支出）
}

/**
 * 分类汇总数据
 */
export interface CategorySummary {
  category: string        // 分类名称
  amount: number          // 金额总额
  count: number           // 记录数量
  percentage: number      // 占总支出的百分比
}

/**
 * 来源汇总数据
 */
export interface SourceSummary {
  source: string          // 来源名称
  amount: number          // 金额总额
  count: number           // 记录数量
  percentage: number      // 占总收入百分比
}

/**
 * 趋势数据
 */
export interface TrendData {
  month: string
  income: number
  expense: number
  balance: number
}

/**
 * 财务Repository接口
 * 提供收入和支出的统一管理接口
 */
export interface IFinanceRepository {
  // ========== 收入操作 ==========

  /**
   * 创建收入记录
   */
  createIncome(data: IncomeCreateDTO): Promise<Income>

  /**
   * 更新收入记录
   */
  updateIncome(id: string, data: IncomeUpdateDTO): Promise<Income>

  /**
   * 删除收入记录
   */
  deleteIncome(id: string): Promise<void>

  /**
   * 查找收入记录
   */
  findIncomeById(id: string): Promise<Income | null>

  /**
   * 查找所有收入记录
   */
  findAllIncomes(): Promise<Income[]>

  /**
   * 按日期范围查找收入
   */
  findIncomesByDateRange(startDate: string, endDate: string): Promise<Income[]>

  /**
   * 按来源查找收入
   */
  findIncomesBySource(source: string): Promise<Income[]>

  // ========== 支出操作 ==========

  /**
   * 创建支出记录
   */
  createExpense(data: ExpenseCreateDTO): Promise<Expense>

  /**
   * 更新支出记录
   */
  updateExpense(id: string, data: ExpenseUpdateDTO): Promise<Expense>

  /**
   * 删除支出记录
   */
  deleteExpense(id: string): Promise<void>

  /**
   * 查找支出记录
   */
  findExpenseById(id: string): Promise<Expense | null>

  /**
   * 查找所有支出记录
   */
  findAllExpenses(): Promise<Expense[]>

  /**
   * 按日期范围查找支出
   */
  findExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]>

  /**
   * 按分类查找支出
   */
  findExpensesByCategory(category: string): Promise<Expense[]>

  // ========== 统计汇总 ==========

  /**
   * 获取月度汇总
   * @param month YYYY-MM 格式的月份
   */
  getMonthlySummary(month: string): Promise<MonthlySummary>

  /**
   * 获取支出分类汇总
   * @param month YYYY-MM 格式的月份
   */
  getExpenseCategorySummary(month: string): Promise<CategorySummary[]>

  /**
   * 获取收入来源汇总
   * @param month YYYY-MM 格式的月份
   */
  getIncomeSourceSummary(month: string): Promise<SourceSummary[]>

  /**
   * 获取趋势数据
   * @param months 月份数量（向前追溯）
   */
  getTrendData(months: number): Promise<TrendData[]>

  /**
   * 获取年度汇总
   * @param year YYYY 格式的年份
   */
  getAnnualSummary(year: string): Promise<MonthlySummary>

  // ========== 计数 ==========

  /**
   * 收入记录数量
   */
  incomeCount(): Promise<number>

  /**
   * 支出记录数量
   */
  expenseCount(): Promise<number>
}