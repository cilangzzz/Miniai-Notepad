import { computed, onMounted } from 'vue'
import { useFinanceStore } from '@/stores'
import type { Income, IncomeCreateDTO, IncomeUpdateDTO, Expense, ExpenseCreateDTO, ExpenseUpdateDTO } from '@/types'
import type { MonthlySummary, CategorySummary, SourceSummary, TrendData } from '@/repositories'

/**
 * 财务操作封装
 * 提供便捷的收入/支出CRUD和统计接口
 */
export function useFinance() {
  const financeStore = useFinanceStore()

  // Computed from store
  const incomes = computed(() => financeStore.incomes)
  const expenses = computed(() => financeStore.expenses)
  const selectedMonth = computed(() => financeStore.selectedMonth)
  const loading = computed(() => financeStore.loading)
  const error = computed(() => financeStore.error)

  // Monthly summary computed
  const monthlyIncome = computed(() => financeStore.monthlyIncome)
  const monthlyExpense = computed(() => financeStore.monthlyExpense)
  const monthlyBalance = computed(() => financeStore.monthlyBalance)
  const expenseByCategory = computed(() => financeStore.expenseByCategory)
  const expenseCategorySummary = computed(() => financeStore.expenseCategorySummary)
  const incomeBySource = computed(() => financeStore.incomeBySource)
  const incomeSourceSummary = computed(() => financeStore.incomeSourceSummary)
  const trendData = computed(() => financeStore.trendData)
  const recentTransactions = computed(() => financeStore.recentTransactions)

  // Income actions
  async function loadData() {
    await financeStore.loadData()
  }

  async function addIncome(dto: IncomeCreateDTO) {
    return await financeStore.addIncome(dto)
  }

  async function updateIncome(id: string, dto: IncomeUpdateDTO) {
    return await financeStore.updateIncome(id, dto)
  }

  async function deleteIncome(id: string) {
    await financeStore.deleteIncome(id)
  }

  // Expense actions
  async function addExpense(dto: ExpenseCreateDTO) {
    return await financeStore.addExpense(dto)
  }

  async function updateExpense(id: string, dto: ExpenseUpdateDTO) {
    return await financeStore.updateExpense(id, dto)
  }

  async function deleteExpense(id: string) {
    await financeStore.deleteExpense(id)
  }

  // Month navigation
  function setMonth(month: string) {
    financeStore.setMonth(month)
  }

  function prevMonth() {
    financeStore.prevMonth()
  }

  function nextMonth() {
    financeStore.nextMonth()
  }

  // Get monthly summary
  async function getMonthlySummary(month: string): Promise<MonthlySummary> {
    return await financeStore.getMonthlySummary(month)
  }

  // Helper functions
  function getIncomeById(id: string): Income | undefined {
    return incomes.value.find(i => i.id === id)
  }

  function getExpenseById(id: string): Expense | undefined {
    return expenses.value.find(e => e.id === id)
  }

  // Get incomes by date range
  function getIncomesByDateRange(startDate: string, endDate: string): Income[] {
    return incomes.value.filter(i => i.date >= startDate && i.date <= endDate)
  }

  // Get expenses by date range
  function getExpensesByDateRange(startDate: string, endDate: string): Expense[] {
    return expenses.value.filter(e => e.date >= startDate && e.date <= endDate)
  }

  // Get total for a date range
  function getTotalIncomeForRange(startDate: string, endDate: string): number {
    return getIncomesByDateRange(startDate, endDate).reduce((sum, i) => sum + i.amount, 0)
  }

  function getTotalExpenseForRange(startDate: string, endDate: string): number {
    return getExpensesByDateRange(startDate, endDate).reduce((sum, e) => sum + e.amount, 0)
  }

  // Format amount
  function formatAmount(amount: number): string {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Initialize on mount
  function initialize() {
    return financeStore.initialize()
  }

  onMounted(() => {
    if (incomes.value.length === 0 && expenses.value.length === 0) {
      loadData()
    }
  })

  return {
    // State
    incomes,
    expenses,
    selectedMonth,
    loading,
    error,

    // Computed
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
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    setMonth,
    prevMonth,
    nextMonth,
    getMonthlySummary,

    // Helpers
    getIncomeById,
    getExpenseById,
    getIncomesByDateRange,
    getExpensesByDateRange,
    getTotalIncomeForRange,
    getTotalExpenseForRange,
    formatAmount,

    // Lifecycle
    initialize,
  }
}