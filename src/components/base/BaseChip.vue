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
  yellow: 'bg-primary-container text-on-primary',
  cyan: 'bg-secondary-container text-white',
  white: 'bg-white text-background',
  gray: 'bg-surface-container-highest text-on-background',
  dark: 'bg-surface-container-lowest text-on-background',
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
      'font-headline font-black uppercase',
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