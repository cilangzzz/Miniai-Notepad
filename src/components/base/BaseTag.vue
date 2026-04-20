<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  label: string
  color?: CardColor
  rotation?: number
  selected?: boolean
  removable?: boolean
  size?: 'sm' | 'md' | 'lg'
  shadow?: 'none' | 'teal' | 'yellow' | 'black'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'cyan',
  rotation: 0,
  selected: false,
  removable: false,
  size: 'md',
  shadow: 'none',
})

const emit = defineEmits<{
  click: []
  remove: []
}>()

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    yellow: 'bg-primary-container text-on-primary border-white',
    cyan: 'bg-secondary-container text-white border-white',
    white: 'bg-white text-background border-background',
    gray: 'bg-surface-container-highest text-on-background border-white',
    dark: 'bg-surface-container-lowest text-on-background border-white',
  }
  return colors[props.color]
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'px-2 py-0.5 text-[8px]',
    md: 'px-2 py-1 text-[10px]',
    lg: 'px-3 py-1.5 text-xs',
  }
  return sizes[props.size]
})

const shadowClasses = computed(() => {
  const shadows: Record<string, string> = {
    none: '',
    teal: 'shadow-neo-teal',
    yellow: 'shadow-neo-gold',
    black: 'shadow-neo-black',
  }
  return shadows[props.shadow]
})

const rotationStyle = computed(() => {
  if (props.rotation !== 0) {
    return `rotate(${props.rotation}deg)`
  }
  return ''
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1',
      'border-2 rounded-none',
      'font-headline font-black uppercase',
      'transition-transform duration-150',
      'hover:rotate-0 cursor-pointer',
      shadowClasses,
      colorClasses,
      sizeClasses,
      selected && 'ring-2 ring-primary-container ring-offset-2 ring-offset-background',
    ]"
    :style="{ transform: rotationStyle }"
    @click="emit('click')"
  >
    {{ label }}

    <button
      v-if="removable"
      type="button"
      class="ml-1 hover:text-primary-container transition-colors"
      @click.stop="emit('remove')"
    >
      <span class="material-symbols-outlined text-xs">close</span>
    </button>
  </span>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>