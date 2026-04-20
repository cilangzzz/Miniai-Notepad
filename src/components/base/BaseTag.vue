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
}

const props = withDefaults(defineProps<Props>(), {
  color: 'cyan',
  rotation: 0,
  selected: false,
  removable: false,
  size: 'md',
})

const emit = defineEmits<{
  click: []
  remove: []
}>()

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    yellow: 'bg-primary text-black border-white',
    cyan: 'bg-secondary text-white border-white',
    white: 'bg-white text-black border-black',
    gray: 'bg-surfaceHighest text-white border-white',
    dark: 'bg-surfaceLowest text-white border-white',
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

const rotationStyle = computed(() => `rotate(${props.rotation}deg)`)
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1',
      'border-2 rounded-none',
      'font-headline font-bold uppercase',
      'transition-transform duration-300',
      'hover:rotate-0 cursor-pointer',
      colorClasses,
      sizeClasses,
      selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
    ]"
    :style="{ transform: rotationStyle }"
    @click="emit('click')"
  >
    {{ label }}

    <button
      v-if="removable"
      type="button"
      class="ml-1 hover:text-primary transition-colors"
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