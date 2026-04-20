<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFinance } from '@/composables/useFinance'
import { useResponsive } from '@/composables/useResponsive'
import FinanceNumberCard from '@/components/business/finance/FinanceNumberCard.vue'
import TrendChart from '@/components/business/finance/TrendChart.vue'
import CategoryPieChart from '@/components/business/finance/CategoryPieChart.vue'
import TransactionItem from '@/components/business/finance/TransactionItem.vue'
import BaseFab from '@/components/base/BaseFab.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import FilterChip from '@/components/common/FilterChip.vue'

const router = useRouter()
const { isMobile } = useResponsive()
const {
  incomes,
  expenses,
  selectedMonth,
  monthlyIncome,
  monthlyExpense,
  monthlyBalance,
  expenseByCategory,
  trendData,
  loadData,
  addIncome,
  addExpense,
  setMonth,
} = useFinance()

// State
const showAddModal = ref(false)
const addType = ref<'income' | 'expense'>('expense')
const newAmount = ref('')
const newCategory = ref('')
const newSource = ref('')
const newNote = ref('')
const newDate = ref(new Date().toISOString().split('T')[0])

// Months for selector
const months = computed(() => {
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return result
})

// Pie chart data
const pieData = computed(() => {
  const total = monthlyExpense.value || 1
  const data: { category: string; amount: number; percentage: number; color: string }[] = []

  const categoryColors: Record<string, string> = {
    '餐饮': '#FFD700',
    '交通': '#007F7F',
    '购物': '#FFFFFF',
    '娱乐': '#00f1ff',
    '居住': '#353535',
    '医疗': '#93000a',
    '教育': '#007F7F',
    '其他': '#2a2a2a',
  }

  expenseByCategory.value.forEach((amount, category) => {
    data.push({
      category,
      amount,
      percentage: (amount / total) * 100,
      color: categoryColors[category] || '#353535',
    })
  })

  return data.sort((a, b) => b.amount - a.amount)
})

// Recent transactions
const recentTransactions = computed(() => {
  const all: { id: string; type: 'income' | 'expense'; amount: number; category: string; source?: string; date: string; note?: string }[] = []

  incomes.value.forEach(i => {
    const dateStr = typeof i.date === 'number'
      ? new Date(i.date).toISOString().split('T')[0]
      : i.date
    all.push({
      id: i.id,
      type: 'income',
      amount: i.amount,
      category: '',
      source: i.source,
      date: dateStr,
      note: i.note,
    })
  })

  expenses.value.forEach(e => {
    const dateStr = typeof e.date === 'number'
      ? new Date(e.date).toISOString().split('T')[0]
      : e.date
    all.push({
      id: e.id,
      type: 'expense',
      amount: e.amount,
      category: e.category,
      date: dateStr,
      note: e.note,
    })
  })

  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
})

// Handlers
function handleMonthChange(month: string) {
  setMonth(month)
}

function handleAddRecord() {
  showAddModal.value = true
}

async function handleSaveRecord() {
  const amount = parseFloat(newAmount.value)
  if (!amount) return

  if (addType.value === 'income') {
    await addIncome({
      amount,
      source: newSource.value,
      date: newDate.value,
      note: newNote.value,
    })
  } else {
    await addExpense({
      amount,
      category: newCategory.value,
      date: newDate.value,
      note: newNote.value,
    })
  }

  showAddModal.value = false
  newAmount.value = ''
  newCategory.value = ''
  newSource.value = ''
  newNote.value = ''
}

function handleEdit(id: string) {
  // Open edit modal
}

function handleDelete(id: string) {
  // Delete transaction
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="finance-page px-6 md:px-12 max-w-7xl mx-auto">
    <!-- Page Header -->
    <header class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <span class="bg-secondary-container text-white px-4 py-1 font-headline font-bold text-sm mb-4 inline-block border-2 border-white uppercase">
          Financial Overview
        </span>
        <h1 class="font-headline font-black text-4xl md:text-6xl text-white uppercase tracking-tighter -skew-x-2">
          FINANCE<br /><span class="text-primary-container">TRACKER</span>
        </h1>
      </div>

      <!-- Month Selector -->
      <div class="flex gap-2">
        <FilterChip
          v-for="m in months"
          :key="m"
          :label="m.split('-')[1]"
          :active="selectedMonth === m"
          @click="handleMonthChange(m)"
        />
      </div>
    </header>

    <!-- Summary Cards -->
    <section class="grid gap-8 mb-16 grid-cols-1 md:grid-cols-3">
      <FinanceNumberCard type="income" :amount="monthlyIncome" label="MONTHLY INCOME" />
      <FinanceNumberCard type="expense" :amount="monthlyExpense" label="MONTHLY EXPENSE" />
      <FinanceNumberCard type="balance" :amount="monthlyBalance" label="BALANCE" />
    </section>

    <!-- Trend Chart -->
    <section class="mb-16">
      <TrendChart :data="trendData" />
    </section>

    <!-- Category Pie Chart -->
    <section class="mb-16">
      <CategoryPieChart :data="pieData" />
    </section>

    <!-- Recent Transactions -->
    <section class="mb-16">
      <h2 class="font-headline font-bold text-xs text-secondary-container uppercase tracking-widest mb-8">
        RECENT TRANSACTIONS
      </h2>
      <div class="bg-surface-container-lowest border-4 border-white shadow-neo-white">
        <TransactionItem
          v-for="tx in recentTransactions"
          :key="tx.id"
          :transaction="tx"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>
    </section>

    <!-- FAB -->
    <BaseFab
      icon="add"
      color="gold"
      :class="isMobile ? 'bottom-[88px]' : 'bottom-8'"
      @click="handleAddRecord"
    />

    <!-- Add Record Modal -->
    <BaseModal v-model:visible="showAddModal" title="ADD RECORD">
      <!-- Type toggle -->
      <div class="flex gap-4 mb-6">
        <BaseButton
          :variant="addType === 'expense' ? 'primary' : 'outline'"
          size="sm"
          @click="addType = 'expense'"
        >
          EXPENSE
        </BaseButton>
        <BaseButton
          :variant="addType === 'income' ? 'primary' : 'outline'"
          size="sm"
          @click="addType = 'income'"
        >
          INCOME
        </BaseButton>
      </div>

      <BaseInput v-model="newAmount" placeholder="Amount" type="text" />
      <BaseInput v-if="addType === 'expense'" v-model="newCategory" placeholder="Category" />
      <BaseInput v-if="addType === 'income'" v-model="newSource" placeholder="Source" />
      <BaseInput v-model="newDate" placeholder="Date" type="text" />
      <BaseInput v-model="newNote" placeholder="Note (optional)" />

      <div class="flex justify-end gap-4 mt-6">
        <BaseButton variant="outline" @click="showAddModal = false">CANCEL</BaseButton>
        <BaseButton variant="primary" @click="handleSaveRecord">SAVE</BaseButton>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>