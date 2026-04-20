<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  label: string
  active?: boolean
  color?: CardColor
  icon?: string
  removable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  color: 'cyan',
  removable: false,
})

const emit = defineEmits<{
  click: []
  remove: []
}>()

const colorClasses = computed(() => {
  if (props.active) {
    return 'bg-secondary text-white'
  }
  return 'bg-surfaceHigh text-white hover:bg-secondary'
})
</script>

<template>
  <button
    type="button"
    :class="[
      'px-4 py-2 border-2 border-white',
      'font-headline font-bold uppercase text-xs tracking-wider',
      'transition-all duration-150',
      'hover:-translate-y-1',
      colorClasses,
      active && 'shadow-[4px_4px_0_rgba(255,255,255,0.1)]',
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
      class="ml-2 text-white/60 hover:text-primary"
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