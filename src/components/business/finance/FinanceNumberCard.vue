<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type: 'income' | 'expense' | 'balance'
  amount: number
  label: string
  trend?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const typeStyles = computed(() => {
  const styles: Record<string, { bg: string; text: string; border: string; icon: string; iconColor: string }> = {
    income: {
      bg: 'bg-secondary',
      text: 'text-white',
      border: 'border-secondary',
      icon: 'arrow_upward',
      iconColor: 'text-cyan',
    },
    expense: {
      bg: 'bg-surfaceHigh',
      text: 'text-primary',
      border: 'border-primary',
      icon: 'arrow_downward',
      iconColor: 'text-primary',
    },
    balance: {
      bg: 'bg-background',
      text: props.amount >= 0 ? 'text-secondary' : 'text-error',
      border: 'border-white',
      icon: props.amount >= 0 ? 'trending_up' : 'trending_down',
      iconColor: props.amount >= 0 ? 'text-secondary' : 'text-error',
    },
  }
  return styles[props.type]
})

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <article
    :class="[
      'relative border-4 rounded-none',
      'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
      'p-8 flex flex-col gap-4',
      'hover:-translate-y-1 hover:-translate-x-1',
      'transition-all duration-200 cursor-pointer',
      typeStyles.bg,
      typeStyles.border,
    ]"
    @click="emit('click')"
  >
    <!-- Label -->
    <p class="font-headline font-bold text-xs uppercase tracking-widest text-white/60">
      {{ label }}
    </p>

    <!-- Amount -->
    <div class="flex items-baseline gap-4">
      <span :class="['font-headline font-black text-5xl', typeStyles.text, '-skew-x-1']">
        {{ formatAmount(amount) }}
      </span>

      <!-- Trend indicator -->
      <span
        v-if="trend !== undefined"
        :class="[
          'font-headline font-bold text-sm',
          trend >= 0 ? 'text-secondary' : 'text-error',
        ]"
      >
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>

    <!-- Icon indicator -->
    <div class="absolute top-4 right-4 w-8 h-8 border-2 border-white flex items-center justify-center">
      <span :class="['material-symbols-outlined text-xl', typeStyles.iconColor]">
        {{ typeStyles.icon }}
      </span>
    </div>
  </article>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>