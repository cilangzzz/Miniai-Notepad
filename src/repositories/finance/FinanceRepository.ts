import { getDB } from '../../storage/db'
import { BaseRepository } from '../base/BaseRepository'
import type { IFinanceRepository, MonthlySummary, CategorySummary, SourceSummary, TrendData } from './IFinanceRepository'
import type { Income, IncomeCreateDTO, IncomeUpdateDTO } from '../../types/entities'
import type { Expense, ExpenseCreateDTO, ExpenseUpdateDTO } from '../../types/entities/expense.types'

/**
 * 财务Repository实现
 * 提供收入和支出的统一管理和统计功能
 */
export class FinanceRepository implements IFinanceRepository {
  private incomeRepo: IncomeRepository
  private expenseRepo: ExpenseRepository

  constructor() {
    const db = getDB()
    this.incomeRepo = new IncomeRepository(db.incomes)
    this.expenseRepo = new ExpenseRepository(db.expenses)
  }

  // ========== 收入操作 ==========

  async createIncome(data: IncomeCreateDTO): Promise<Income> {
    return this.incomeRepo.create(data)
  }

  async updateIncome(id: string, data: IncomeUpdateDTO): Promise<Income> {
    return this.incomeRepo.update(id, data)
  }

  async deleteIncome(id: string): Promise<void> {
    await this.incomeRepo.delete(id)
  }

  async findIncomeById(id: string): Promise<Income | null> {
    return this.incomeRepo.findById(id)
  }

  async findAllIncomes(): Promise<Income[]> {
    return this.incomeRepo.findAllActive()
  }

  async findIncomesByDateRange(startDate: string, endDate: string): Promise<Income[]> {
    const db = getDB()
    return db.incomes
      .filter(income => income.date >= startDate && income.date <= endDate && !income.is_deleted)
      .toArray()
  }

  async findIncomesBySource(source: string): Promise<Income[]> {
    const db = getDB()
    return db.incomes
      .filter(income => income.source === source && !income.is_deleted)
      .toArray()
  }

  // ========== 支出操作 ==========

  async createExpense(data: ExpenseCreateDTO): Promise<Expense> {
    return this.expenseRepo.create(data)
  }

  async updateExpense(id: string, data: ExpenseUpdateDTO): Promise<Expense> {
    return this.expenseRepo.update(id, data)
  }

  async deleteExpense(id: string): Promise<void> {
    await this.expenseRepo.delete(id)
  }

  async findExpenseById(id: string): Promise<Expense | null> {
    return this.expenseRepo.findById(id)
  }

  async findAllExpenses(): Promise<Expense[]> {
    return this.expenseRepo.findAllActive()
  }

  async findExpensesByDateRange(startDate: string, endDate: string): Promise<Expense[]> {
    const db = getDB()
    return db.expenses
      .filter(expense => expense.date >= startDate && expense.date <= endDate && !expense.is_deleted)
      .toArray()
  }

  async findExpensesByCategory(category: string): Promise<Expense[]> {
    const db = getDB()
    return db.expenses
      .filter(expense => expense.category === category && !expense.is_deleted)
      .toArray()
  }

  // ========== 统计汇总 ==========

  async getMonthlySummary(month: string): Promise<MonthlySummary> {
    const incomes = await this.findIncomesByDateRange(
      `${month}-01`,
      `${month}-31`
    )
    const expenses = await this.findExpensesByDateRange(
      `${month}-01`,
      `${month}-31`
    )

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)

    return {
      month,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  }

  async getExpenseCategorySummary(month: string): Promise<CategorySummary[]> {
    const expenses = await this.findExpensesByDateRange(
      `${month}-01`,
      `${month}-31`
    )

    const categoryMap = new Map<string, { amount: number; count: number }>()
    for (const expense of expenses) {
      const current = categoryMap.get(expense.category) ?? { amount: 0, count: 0 }
      categoryMap.set(expense.category, {
        amount: current.amount + expense.amount,
        count: current.count + 1,
      })
    }

    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)

    return Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: totalExpense > 0 ? (data.amount / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  async getIncomeSourceSummary(month: string): Promise<SourceSummary[]> {
    const incomes = await this.findIncomesByDateRange(
      `${month}-01`,
      `${month}-31`
    )

    const sourceMap = new Map<string, { amount: number; count: number }>()
    for (const income of incomes) {
      const current = sourceMap.get(income.source) ?? { amount: 0, count: 0 }
      sourceMap.set(income.source, {
        amount: current.amount + income.amount,
        count: current.count + 1,
      })
    }

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)

    return Array.from(sourceMap.entries())
      .map(([source, data]) => ({
        source,
        amount: data.amount,
        count: data.count,
        percentage: totalIncome > 0 ? (data.amount / totalIncome) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
  }

  async getTrendData(months: number): Promise<TrendData[]> {
    const now = new Date()
    const results: TrendData[] = []

    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const summary = await this.getMonthlySummary(month)
      results.unshift({
        month,
        income: summary.totalIncome,
        expense: summary.totalExpense,
        balance: summary.balance,
      })
    }

    return results
  }

  async getAnnualSummary(year: string): Promise<MonthlySummary> {
    const incomes = await this.findIncomesByDateRange(
      `${year}-01-01`,
      `${year}-12-31`
    )
    const expenses = await this.findExpensesByDateRange(
      `${year}-01-01`,
      `${year}-12-31`
    )

    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0)
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)

    return {
      month: year,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    }
  }

  // ========== 计数 ==========

  async incomeCount(): Promise<number> {
    const db = getDB()
    return db.incomes.filter(i => !i.is_deleted).count()
  }

  async expenseCount(): Promise<number> {
    const db = getDB()
    return db.expenses.filter(e => !e.is_deleted).count()
  }

  // ========== 批量操作 ==========

  async bulkCreateIncomes(data: IncomeCreateDTO[]): Promise<Income[]> {
    return this.incomeRepo.bulkCreate(data)
  }

  async bulkCreateExpenses(data: ExpenseCreateDTO[]): Promise<Expense[]> {
    return this.expenseRepo.bulkCreate(data)
  }

  async bulkDeleteIncomes(ids: string[]): Promise<void> {
    await this.incomeRepo.bulkDelete(ids)
  }

  async bulkDeleteExpenses(ids: string[]): Promise<void> {
    await this.expenseRepo.bulkDelete(ids)
  }

  // ========== 同步预留 ==========

  async getPendingSyncIncomes(): Promise<Income[]> {
    return this.incomeRepo.getPendingSync()
  }

  async getPendingSyncExpenses(): Promise<Expense[]> {
    return this.expenseRepo.getPendingSync()
  }

  async markIncomeSynced(id: string, cloudId: string): Promise<void> {
    await this.incomeRepo.markSynced(id, cloudId)
  }

  async markExpenseSynced(id: string, cloudId: string): Promise<void> {
    await this.expenseRepo.markSynced(id, cloudId)
  }
}

/**
 * 收入Repository - 内部类
 */
class IncomeRepository extends BaseRepository<Income, IncomeCreateDTO, IncomeUpdateDTO> {
  constructor(table: any) {
    super(table)
  }

  async create(data: IncomeCreateDTO): Promise<Income> {
    const now = Date.now()
    const newIncome: Income = {
      id: crypto.randomUUID(),
      amount: data.amount,
      source: data.source,
      date: data.date,
      note: data.note,
      category: data.category,
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
    await this.table.add(newIncome)
    return newIncome
  }
}

/**
 * 支出Repository - 内部类
 */
class ExpenseRepository extends BaseRepository<Expense, ExpenseCreateDTO, ExpenseUpdateDTO> {
  constructor(table: any) {
    super(table)
  }

  async create(data: ExpenseCreateDTO): Promise<Expense> {
    const now = Date.now()
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: data.amount,
      category: data.category,
      date: data.date,
      note: data.note,
      budget_id: data.budget_id,
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
    await this.table.add(newExpense)
    return newExpense
  }
}