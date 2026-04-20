<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  max?: number
  color?: 'gold' | 'white' | 'teal'
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  color: 'gold',
  showLabel: true,
  size: 'md',
})

const percentage = computed(() => {
  return Math.min(Math.max((props.value / props.max) * 100, 0), 100)
})

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    gold: 'bg-primary-container',
    white: 'bg-white',
    teal: 'bg-secondary-container',
  }
  return colors[props.color]
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  }
  return sizes[props.size]
})
</script>

<template>
  <div class="w-full">
    <!-- Track -->
    <div
      :class="[
        'w-full bg-surface-container-lowest border-2 border-white rounded-none',
        sizeClasses,
      ]"
    >
      <!-- Fill -->
      <div
        :class="[
          'h-full transition-all duration-300',
          colorClasses,
        ]"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <!-- Label -->
    <p
      v-if="showLabel"
      class="font-headline text-xs text-white/60 mt-2 uppercase tracking-widest"
    >
      {{ Math.round(percentage) }}%
    </p>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>