<script setup lang="ts">
interface Props {
  transaction: {
    id: string
    type: 'income' | 'expense'
    amount: number
    category: string
    source?: string
    date: string
    note?: string
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [id: string]
  delete: [id: string]
}>()

const typeIndicator = computed(() => {
  return props.transaction.type === 'income'
    ? { color: 'bg-secondary', icon: 'add', text: 'text-white' }
    : { color: 'bg-primary', icon: 'remove', text: 'text-black' }
})

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN').format(amount)
}

const formattedDate = computed(() => {
  const date = new Date(props.transaction.date)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
})
</script>

<template>
  <div
    class="flex items-center gap-6 px-6 py-4 border-b-2 border-white/20 hover:bg-surfaceHigh transition-colors duration-150"
  >
    <!-- Type indicator -->
    <div
      :class="[
        'w-12 h-12 border-2 border-white rounded-none',
        'flex items-center justify-center',
        typeIndicator.color,
        typeIndicator.text,
      ]"
    >
      <span class="material-symbols-outlined text-xl font-bold">
        {{ typeIndicator.icon }}
      </span>
    </div>

    <!-- Amount -->
    <div class="flex-1">
      <p
        :class="[
          'font-headline font-black text-2xl',
          transaction.type === 'income' ? 'text-secondary' : 'text-primary',
        ]"
      >
        {{ transaction.type === 'income' ? '+' : '-' }}
        {{ formatAmount(transaction.amount) }}
      </p>
      <p class="font-headline text-xs text-white/60 uppercase mt-1">
        {{ transaction.category || transaction.source }}
      </p>
    </div>

    <!-- Date -->
    <div class="text-right">
      <p class="font-headline text-sm text-white/80">{{ formattedDate }}</p>
      <p v-if="transaction.note" class="font-body text-xs text-white/50 mt-1">
        {{ transaction.note }}
      </p>
    </div>

    <!-- Action buttons -->
    <div class="flex gap-2">
      <button
        type="button"
        class="p-2 border-2 border-white/40 hover:border-white hover:bg-surfaceHighest transition-all duration-150"
        @click="emit('edit', transaction.id)"
      >
        <span class="material-symbols-outlined text-white text-sm">edit</span>
      </button>
      <button
        type="button"
        class="p-2 border-2 border-white/40 hover:border-error hover:bg-error transition-all duration-150"
        @click="emit('delete', transaction.id)"
      >
        <span class="material-symbols-outlined text-white text-sm">delete</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>