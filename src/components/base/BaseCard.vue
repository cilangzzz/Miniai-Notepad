<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  variant?: 'primary' | 'secondary' | 'accent' | 'dark' | 'surface'
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  color?: CardColor
  shadowColor?: 'black' | 'white' | 'gold' | 'teal'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'surface',
  padding: 'md',
  hoverable: true,
  color: 'yellow',
  shadowColor: 'black',
})

const emit = defineEmits<{
  click: []
}>()

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    primary: 'bg-secondary-container text-white',
    secondary: 'bg-surface-container-high text-on-background',
    accent: 'bg-primary-container text-on-primary',
    dark: 'bg-surface-container-lowest text-on-background',
    surface: 'bg-surface-container-high text-on-background',
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
    black: 'shadow-neo-black',
    white: 'shadow-neo-white',
    gold: 'shadow-neo-gold',
    teal: 'shadow-neo-teal',
  }
  return shadows[props.shadowColor]
})

const colorOverride = computed(() => {
  if (props.color === 'cyan' && props.variant === 'accent') {
    return 'bg-secondary-container text-white'
  }
  return ''
})

function handleClick() {
  if (props.hoverable) {
    emit('click')
  }
}
</script>

<template>
  <article
    :class="[
      'relative border-4 border-white rounded-none',
      shadowClasses,
      paddingClasses,
      variantClasses,
      colorOverride,
      hoverable && 'hover:-translate-y-1 hover:-translate-x-1 transition-all duration-150 cursor-pointer',
      hoverable && 'active:translate-y-0 active:translate-x-0 active:shadow-none',
    ]"
    @click="handleClick"
  >
    <slot />
  </article>
</template>