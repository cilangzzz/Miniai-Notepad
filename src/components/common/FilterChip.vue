<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  label: string
  active?: boolean
  color?: CardColor
  icon?: string
  removable?: boolean
  skew?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  color: 'cyan',
  removable: false,
  skew: true,
})

const emit = defineEmits<{
  click: []
  remove: []
}>()

const colorClasses = computed(() => {
  if (props.active) {
    return 'bg-primary-container text-on-primary'
  }
  const colors: Record<string, string> = {
    yellow: 'bg-primary-container text-on-primary',
    cyan: 'bg-secondary-container text-white',
    white: 'bg-white text-background',
    gray: 'bg-surface-container-high text-on-background',
    dark: 'bg-surface-container-lowest text-on-background',
  }
  return colors[props.color] || 'bg-surface-container-high text-white hover:bg-secondary-container'
})

const skewClass = computed(() => {
  return props.skew ? '-skew-x-6 hover:skew-x-0' : ''
})
</script>

<template>
  <button
    type="button"
    :class="[
      'px-6 py-2 border-2 border-white',
      'font-headline font-bold uppercase text-sm',
      'transition-all duration-150',
      skewClass,
      'hover:-translate-y-1',
      colorClasses,
      active && 'shadow-neo-teal',
    ]"
    @click="emit('click')"
  >
    <span
      v-if="icon"
      class="material-symbols-outlined mr-1 text-sm"
    >
      {{ icon }}
    </span>
    {{ label }}

    <button
      v-if="removable"
      type="button"
      class="ml-2 text-white/60 hover:text-primary-container"
      @click.stop="emit('remove')"
    >
      <span class="material-symbols-outlined text-xs">close</span>
    </button>
  </button>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>