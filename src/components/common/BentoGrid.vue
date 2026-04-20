<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  columns?: 1 | 2 | 3 | 4
  gap?: number
}

const props = withDefaults(defineProps<Props>(), {
  columns: 3,
  gap: 8,
})

const columnClasses = computed(() => {
  const classes: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }
  return classes[props.columns]
})

const gapClasses = computed(() => {
  return `gap-${props.gap}`
})
</script>

<template>
  <div
    :class="[
      'grid',
      columnClasses,
      gapClasses,
    ]"
  >
    <slot />
  </div>
</template>