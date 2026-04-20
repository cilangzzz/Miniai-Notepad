<script setup lang="ts">
import { computed } from 'vue'
import type { Category, CardColor } from '@/types/entities'

interface Props {
  category: Category
  isActive?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  select: [categoryId: string]
}>()

const colorClasses = computed(() => {
  const colors: Record<CardColor, string> = {
    yellow: 'bg-primary text-black',
    cyan: 'bg-secondary text-white',
    white: 'bg-white text-black',
    gray: 'bg-surfaceHighest text-white',
    dark: 'bg-surfaceLowest text-white',
  }
  return colors[props.category.color]
})
</script>

<template>
  <article
    :class="[
      'relative border-4 border-white rounded-none',
      'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
      'p-8 flex flex-col gap-4',
      'hover:-translate-y-1 hover:-translate-x-1',
      'transition-all duration-200 cursor-pointer',
      isActive && 'ring-4 ring-primary ring-offset-4',
      colorClasses,
    ]"
    @click="emit('select', category.id)"
  >
    <!-- Icon -->
    <span class="material-symbols-outlined text-5xl font-bold -skew-x-1">
      {{ category.icon || 'folder' }}
    </span>

    <!-- Category name -->
    <h3 class="font-headline font-black text-2xl uppercase tracking-tighter -skew-x-2">
      {{ category.name }}
    </h3>

    <!-- Note count -->
    <div class="mt-auto border-2 border-current px-4 py-2 font-headline font-bold text-sm uppercase">
      {{ category.note_count }} NOTES
    </div>

    <!-- Active indicator -->
    <div
      v-if="isActive"
      class="absolute -top-2 -right-2 w-6 h-6 bg-primary border-2 border-white"
    >
      <span class="material-symbols-outlined text-xs text-black">check</span>
    </div>
  </article>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>