<script setup lang="ts">
import { computed, ref } from 'vue'

interface CategoryData {
  category: string
  amount: number
  percentage: number
  color: string
}

interface Props {
  data: CategoryData[]
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 200,
})

const emit = defineEmits<{
  click: [category: string]
}>()

const hoveredCategory = ref<string | null>(null)

// Calculate arc paths for pie chart
const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const radians = (angle - 90) * Math.PI / 180
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  }
}

const calculateArcPath = (startAngle: number, endAngle: number, radius: number) => {
  const start = polarToCartesian(radius, radius, radius, startAngle)
  const end = polarToCartesian(radius, radius, radius, endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${radius} ${radius}`,
    `L ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}

const arcs = computed(() => {
  let currentAngle = 0
  return props.data.map(item => {
    const startAngle = currentAngle
    const endAngle = currentAngle + (item.percentage * 360 / 100)
    currentAngle = endAngle
    return {
      path: calculateArcPath(startAngle, endAngle, props.size / 2),
      ...item,
      startAngle,
      endAngle,
    }
  })
})

const handleArcClick = (category: string) => {
  emit('click', category)
}
</script>

<template>
  <div class="p-8 bg-surfaceLowest border-4 border-white">
    <!-- Title -->
    <h3 class="font-headline font-bold text-xs uppercase tracking-widest text-white/60 mb-8">
      EXPENSE BREAKDOWN
    </h3>

    <!-- Pie chart and legend -->
    <div class="flex items-center gap-8">
      <!-- SVG Pie Chart -->
      <svg
        :width="size"
        :height="size"
        class="border-4 border-white rounded-none"
      >
        <g>
          <path
            v-for="arc in arcs"
            :key="arc.category"
            :d="arc.path"
            :fill="arc.color"
            :class="[
              'stroke-white stroke-2 hover:opacity-80 transition-opacity cursor-pointer',
              hoveredCategory === arc.category && 'opacity-100',
            ]"
            @mouseenter="hoveredCategory = arc.category"
            @mouseleave="hoveredCategory = null"
            @click="handleArcClick(arc.category)"
          />
        </g>
      </svg>

      <!-- Category list -->
      <div class="flex flex-col gap-3">
        <div
          v-for="item in data"
          :key="item.category"
          :class="[
            'flex items-center gap-4 cursor-pointer',
            hoveredCategory === item.category && 'bg-surfaceHigh p-1',
          ]"
          @mouseenter="hoveredCategory = item.category"
          @mouseleave="hoveredCategory = null"
        >
          <div
            class="w-4 h-4 border-2 border-white rounded-none"
            :style="{ backgroundColor: item.color }"
          />
          <span class="font-headline text-sm text-white uppercase">
            {{ item.category }}
          </span>
          <span class="font-headline font-bold text-sm text-primary">
            {{ item.percentage.toFixed(1) }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>