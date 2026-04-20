<script setup lang="ts">
import { computed } from 'vue'

interface MonthData {
  month: string
  income: number
  expense: number
}

interface Props {
  data: MonthData[]
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
})

const maxValue = computed(() => {
  return Math.max(...props.data.map(d => Math.max(d.income, d.expense)), 1)
})

const getBarHeight = (value: number) => {
  return (value / maxValue.value) * props.height
}

const monthLabel = (month: string) => {
  return month.split('-')[1] || month
}
</script>

<template>
  <div class="p-8 bg-surfaceLowest border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
    <!-- Title -->
    <h3 class="font-headline font-bold text-xs uppercase tracking-widest text-white/60 mb-8">
      6-MONTH TREND
    </h3>

    <!-- Chart area -->
    <div class="flex gap-4 items-end" :style="{ height: `${height}px` }">
      <div
        v-for="item in data"
        :key="item.month"
        class="flex-1 flex flex-col items-center gap-2"
      >
        <!-- Income bar -->
        <div
          class="w-full bg-secondary border-2 border-white rounded-none transition-all duration-300"
          :style="{ height: `${getBarHeight(item.income)}px` }"
        />

        <!-- Expense bar -->
        <div
          class="w-full bg-primary border-2 border-white rounded-none transition-all duration-300 -mt-2"
          :style="{ height: `${getBarHeight(item.expense)}px` }"
        />

        <!-- Month label -->
        <p class="font-headline font-bold text-xs text-white/60 uppercase mt-4">
          {{ monthLabel(item.month) }}
        </p>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex gap-8 mt-8 justify-center">
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-secondary border-2 border-white" />
        <span class="font-headline text-xs text-white/80 uppercase">Income</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-4 h-4 bg-primary border-2 border-white" />
        <span class="font-headline text-xs text-white/80 uppercase">Expense</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>