<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  icon?: string
  color?: 'gold' | 'white' | 'teal'
  size?: 'sm' | 'md' | 'lg'
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'add',
  color: 'gold',
  size: 'lg',
  position: 'bottom-right',
  disabled: false,
})

const emit = defineEmits<{
  click: []
}>()

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    gold: 'bg-primary text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    white: 'bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    teal: 'bg-secondary text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
  }
  return colors[props.color]
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  }
  return sizes[props.size]
})

const positionClasses = computed(() => {
  const positions: Record<string, string> = {
    'bottom-right': 'bottom-32 right-8',
    'bottom-left': 'bottom-32 left-8',
    'top-right': 'top-32 right-8',
    'top-left': 'top-32 left-8',
  }
  return positions[props.position]
})

const iconSize = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }
  return sizes[props.size]
})
</script>

<template>
  <button
    type="button"
    :class="[
      'fixed z-[60]',
      'border-4 border-white rounded-none',
      'flex items-center justify-center',
      'hover:scale-105 transition-all duration-200',
      'active:translate-y-2 active:shadow-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      colorClasses,
      positionClasses,
    ]"
    :disabled="disabled"
    @click="emit('click')"
  >
    <span
      class="material-symbols-outlined font-bold"
      :class="iconSize"
    >
      {{ icon }}
    </span>
  </button>
</template>