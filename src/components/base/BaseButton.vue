<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  color?: CardColor
  shadow?: 'black' | 'white' | 'gold' | 'teal' | 'none'
  disabled?: boolean
  loading?: boolean
  icon?: string
  iconOnly?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  color: 'yellow',
  shadow: 'black',
  disabled: false,
  loading: false,
  iconOnly: false,
  block: false,
})

const emit = defineEmits<{
  click: []
}>()

const variantClasses = computed(() => {
  const variants: Record<string, string> = {
    primary: 'bg-primary-container text-on-primary border-4 border-white',
    secondary: 'bg-secondary-container text-white border-4 border-white',
    outline: 'bg-transparent text-white border-4 border-white',
    ghost: 'bg-transparent text-white border-none underline underline-offset-4 decoration-white',
  }
  return variants[props.variant]
})

const shadowClasses = computed(() => {
  if (props.shadow === 'none' || props.variant === 'ghost') return ''
  const shadows: Record<string, string> = {
    black: 'shadow-neo-black',
    white: 'shadow-neo-white',
    gold: 'shadow-neo-gold',
    teal: 'shadow-neo-teal',
  }
  return shadows[props.shadow]
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: props.iconOnly ? 'w-10 h-10' : 'px-4 py-2 text-xs',
    md: props.iconOnly ? 'w-12 h-12' : 'px-6 py-2 text-sm',
    lg: props.iconOnly ? 'w-16 h-16' : 'px-8 py-3 text-base',
  }
  return sizes[props.size]
})

const colorOverride = computed(() => {
  if (props.color === 'cyan' && props.variant === 'primary') {
    return 'bg-secondary-container text-white'
  }
  return ''
})

function handleClick() {
  if (!props.disabled && !props.loading) {
    emit('click')
  }
}
</script>

<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center justify-center gap-2',
      'rounded-none font-headline font-bold uppercase',
      'transition-all duration-150',
      'hover:-translate-y-1 hover:skew-x-1',
      'active:translate-y-2 active:shadow-none',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-0 disabled:hover:skew-x-0',
      variantClasses,
      shadowClasses,
      sizeClasses,
      colorOverride,
      block && 'w-full',
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="material-symbols-outlined animate-spin"
    >
      progress_activity
    </span>
    <span
      v-else-if="icon"
      class="material-symbols-outlined"
    >
      {{ icon }}
    </span>
    <slot v-if="!iconOnly" />
  </button>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>