import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Income, IncomeCreateDTO, IncomeUpdateDTO, Expense, ExpenseCreateDTO, ExpenseUpdateDTO } from '@/types'
import type { MonthlySummary, CategorySummary, SourceSummary, TrendData } from '@/repositories'
import { financeRepo } from '@/repositories'

export const useFinanceStore = defineStore('finance', () => {
  // ========== State ==========
  const incomes = ref<Income[]>([])
  const expenses = ref<Expense[]>([])
  const selectedMonth = ref<string>(getCurrentMonth())
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const monthlyIncome = computed(() => {
    return incomes.value
      .filter(i => i.date.startsWith(selectedMonth.value))
      .reduce((sum, i) => sum + i.amount, 0)
  })

  const monthlyExpense = computed(() => {
    return expenses.value
      .filter(e => e.date.startsWith(selectedMonth.value))
      .reduce((sum, e) => sum + e.amount, 0)
  })

  const monthlyBalance = computed(() => {
    return monthlyIncome.value - monthlyExpense.value
  })

  const expenseByCategory = computed(() => {
    const monthlyExpenses = expenses.value.filter(
      e => e.date.startsWith(selectedMonth.value)
    )
    const grouped = new Map<string, number>()
    for (const exp of monthlyExpenses) {
      const current = grouped.get(exp.category) || 0
      grouped.set(exp.category, current + exp.amount)
    }
    return grouped
  })

  const expenseCategorySummary = computed<CategorySummary[]>(() => {
    const total = monthlyExpense.value
    const summary: CategorySummary[] = []
    for (const [category, amount] of expenseByCategory.value) {
      summary.push({
        category,
        amount,
        count: expenses.value.filter(e => e.date.startsWith(selectedMonth.value) && e.category === category).length,
        percentage: total > 0 ? (amount / total) * 100 : 0
      })
    }
    return summary.sort((a, b) => b.amount - a.amount)
  })

  const incomeBySource = computed(() => {
    const monthlyIncomes = incomes.value.filter(
      i => i.date.startsWith(selectedMonth.value)
    )
    const grouped = new Map<string, number>()
    for (const inc of monthlyIncomes) {
      const current = grouped.get(inc.source) || 0
      grouped.set(inc.source, current + inc.amount)
    }
    return grouped
  })

  const incomeSourceSummary = computed<SourceSummary[]>(() => {
    const total = monthlyIncome.value
    const summary: SourceSummary[] = []
    for (const [source, amount] of incomeBySource.value) {
      summary.push({
        source,
        amount,
        count: incomes.value.filter(i => i.date.startsWith(selectedMonth.value) && i.source === source).length,
        percentage: total > 0 ? (amount / total) * 100 : 0
      })
    }
    return summary.sort((a, b) => b.amount - a.amount)
  })

  const trendData = computed<TrendData[]>(() => {
    const months = getLast6Months()
    return months.map(month => ({
      month,
      income: incomes.value
        .filter(i => i.date.startsWith(month))
        .reduce((sum, i) => sum + i.amount, 0),
      expense: expenses.value
        .filter(e => e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0),
      balance: incomes.value
        .filter(i => i.date.startsWith(month))
        .reduce((sum, i) => sum + i.amount, 0) -
        expenses.value
          .filter(e => e.date.startsWith(month))
          .reduce((sum, e) => sum + e.amount, 0)
    }))
  })

  const recentTransactions = computed(() => {
    const transactions = [
      ...incomes.value.map(i => ({ ...i, type: 'income' as const })),
      ...expenses.value.map(e => ({ ...e, type: 'expense' as const }))
    ]
    return transactions
      .sort((a, b) => {
        const dateA = typeof a.date === 'number' ? a.date : new Date(a.date).getTime()
        const dateB = typeof b.date === 'number' ? b.date : new Date(b.date).getTime()
        return dateB - dateA
      })
      .slice(0, 10)
  })

  // ========== Actions ==========
  async function loadData() {
    loading.value = true
    error.value = null
    try {
      incomes.value = await financeRepo.findAllIncomes()
      expenses.value = await financeRepo.findAllExpenses()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载财务数据失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addIncome(data: IncomeCreateDTO) {
    loading.value = true
    error.value = null
    try {
      const newIncome = await financeRepo.createIncome(data)
      incomes.value.push(newIncome)
      return newIncome
    } catch (e) {
      error.value = e instanceof Error ? e.message : '添加收入失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addExpense(data: ExpenseCreateDTO) {
    loading.value = true
    error.value = null
    try {
      const newExpense = await financeRepo.createExpense(data)
      expenses.value.push(newExpense)
      return newExpense
    } catch (e) {
      error.value = e instanceof Error ? e.message : '添加支出失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateIncome(id: string, data: IncomeUpdateDTO) {
    loading.value = true
    error.value = null
    try {
      const updated = await financeRepo.updateIncome(id, data)
      const index = incomes.value.findIndex(i => i.id === id)
      if (index !== -1) {
        incomes.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新收入失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateExpense(id: string, data: ExpenseUpdateDTO) {
    loading.value = true
    error.value = null
    try {
      const updated = await financeRepo.updateExpense(id, data)
      const index = expenses.value.findIndex(e => e.id === id)
      if (index !== -1) {
        expenses.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新支出失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteIncome(id: string) {
    loading.value = true
    error.value = null
    try {
      await financeRepo.deleteIncome(id)
      incomes.value = incomes.value.filter(i => i.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除收入失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteExpense(id: string) {
    loading.value = true
    error.value = null
    try {
      await financeRepo.deleteExpense(id)
      expenses.value = expenses.value.filter(e => e.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除支出失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setMonth(month: string) {
    selectedMonth.value = month
  }

  function prevMonth() {
    const parts = selectedMonth.value.split('-')
    const year = Number(parts[0])
    const month = Number(parts[1])
    const prevMonthDate = new Date(year, month - 2, 1)
    selectedMonth.value = formatMonth(prevMonthDate)
  }

  function nextMonth() {
    const parts = selectedMonth.value.split('-')
    const year = Number(parts[0])
    const month = Number(parts[1])
    const nextMonthDate = new Date(year, month, 1)
    selectedMonth.value = formatMonth(nextMonthDate)
  }

  async function getMonthlySummary(month: string): Promise<MonthlySummary> {
    return financeRepo.getMonthlySummary(month)
  }

  async function initialize() {
    await loadData()
  }

  return {
    // State
    incomes,
    expenses,
    selectedMonth,
    loading,
    error,
    // Getters
    monthlyIncome,
    monthlyExpense,
    monthlyBalance,
    expenseByCategory,
    expenseCategorySummary,
    incomeBySource,
    incomeSourceSummary,
    trendData,
    recentTransactions,
    // Actions
    loadData,
    addIncome,
    addExpense,
    updateIncome,
    updateExpense,
    deleteIncome,
    deleteExpense,
    setMonth,
    prevMonth,
    nextMonth,
    getMonthlySummary,
    initialize
  }
})

// ========== Helper Functions ==========
function getCurrentMonth(): string {
  const now = new Date()
  return formatMonth(now)
}

function formatMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function getLast6Months(): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(formatMonth(d))
  }
  return months
}