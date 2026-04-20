<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'dark'
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  color?: CardColor
  shadowColor?: 'black' | 'white' | 'gold' | 'teal'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  padding: 'md',
  hoverable: true,
  color: 'yellow',
  shadowColor: 'black',
})

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    primary: 'bg-secondary',
    secondary: 'bg-surfaceHigh',
    accent: 'bg-primary',
    dark: 'bg-surfaceLowest',
  }
  return variants[props.variant]
})

const paddingClasses = computed(() => {
  const paddings: Record<string, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }
  return paddings[props.padding]
})

const shadowClasses = computed(() => {
  const shadows: Record<string, string> = {
    black: 'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    white: 'shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]',
    gold: 'shadow-[8px_8px_0px_0px_rgba(255,215,0,1)]',
    teal: 'shadow-[8px_8px_0px_0px_rgba(0,127,127,1)]',
  }
  return shadows[props.shadowColor]
})

const colorOverride = computed(() => {
  if (props.color === 'cyan' && props.variant === 'accent') {
    return 'bg-secondary'
  }
  return ''
})
</script>

<template>
  <article
    :class="[
      'relative border-4 border-white rounded-none',
      shadowClasses,
      paddingClasses,
      variantClasses,
      colorOverride,
      hoverable && 'hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 cursor-pointer',
    ]"
  >
    <slot />
  </article>
</template>