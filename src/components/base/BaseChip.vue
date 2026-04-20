<script setup lang="ts">
import type { CardColor } from '@/types/entities'

interface Props {
  label?: string
  color?: CardColor
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  color: 'yellow',
  size: 'md',
})

const colorClasses: Record<string, string> = {
  yellow: 'bg-primary text-black',
  cyan: 'bg-secondary text-white',
  white: 'bg-white text-black',
  gray: 'bg-surfaceHighest text-white',
  dark: 'bg-surfaceLowest text-white',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-[8px]',
  md: 'px-3 py-1 text-[10px]',
  lg: 'px-4 py-1.5 text-xs',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center justify-center',
      'border-2 border-white rounded-none',
      'font-headline font-bold uppercase',
      colorClasses[color],
      sizeClasses[size],
    ]"
  >
    {{ label }}
  </span>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>