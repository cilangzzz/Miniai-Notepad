<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  color?: CardColor
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
    primary: 'bg-primary text-black border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    secondary: 'bg-secondary text-white border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    outline: 'bg-transparent text-white border-4 border-white',
    ghost: 'bg-transparent text-white border-none underline underline-offset-4 decoration-white',
  }
  return variants[props.variant]
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: props.iconOnly ? 'w-10 h-10' : 'px-4 py-2 text-xs',
    md: props.iconOnly ? 'w-12 h-12' : 'px-6 py-3 text-sm',
    lg: props.iconOnly ? 'w-16 h-16' : 'px-8 py-4 text-base',
  }
  return sizes[props.size]
})

const colorOverride = computed(() => {
  if (props.variant === 'primary' && props.color === 'cyan') {
    return 'bg-secondary text-white'
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
      'transition-all duration-200',
      'hover:-translate-y-1 hover:-translate-x-1',
      'active:translate-y-2 active:shadow-none',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-0',
      variantClasses,
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