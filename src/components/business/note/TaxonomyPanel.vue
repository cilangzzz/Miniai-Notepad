<script setup lang="ts">
import { computed } from 'vue'
import type { Tag, CardColor } from '@/types/entities'
import BaseTag from '@/components/base/BaseTag.vue'

interface Props {
  tags?: Tag[]
  selectedIds?: string[]
  editable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tags: [],
  selectedIds: [],
  editable: true,
})

const emit = defineEmits<{
  select: [tagId: string]
  create: []
  remove: [tagId: string]
}>()

// Calculate rotation for each tag (cycling through -3 to 3)
const getRotation = (index: number) => {
  const rotations = [-3, -2, -1, 0, 1, 2, 3]
  return rotations[index % rotations.length]
}
</script>

<template>
  <div class="relative p-6 bg-surfaceLowest border-4 border-white">
    <!-- Title bar -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="font-headline font-black text-xl uppercase tracking-tighter text-primary -skew-x-2">
        TAGS_CATALOG
      </h2>

      <button
        v-if="editable"
        type="button"
        class="px-4 py-2 bg-secondary border-2 border-white text-white font-headline font-bold uppercase text-xs hover:bg-primary hover:text-black transition-all duration-150"
        @click="emit('create')"
      >
        <span class="material-symbols-outlined text-sm mr-1">add</span>
        NEW TAG
      </button>
    </div>

    <!-- Tag grid -->
    <div class="flex flex-wrap gap-4 items-center">
      <BaseTag
        v-for="(tag, index) in tags"
        :key="tag.id"
        :label="tag.name"
        :color="tag.color"
        :rotation="getRotation(index)"
        :selected="selectedIds.includes(tag.id)"
        :removable="editable"
        @click="emit('select', tag.id)"
        @remove="emit('remove', tag.id)"
      />

      <!-- Add tag button inline -->
      <button
        v-if="editable && tags.length === 0"
        type="button"
        class="bg-transparent text-white/50 border-2 border-white/20 border-dashed px-4 py-2 font-headline font-bold text-xs uppercase hover:text-white hover:border-white transition-all"
        @click="emit('create')"
      >
        + ADD FIRST TAG
      </button>
    </div>

    <!-- Empty state -->
    <div
      v-if="tags.length === 0 && !editable"
      class="py-8 text-center"
    >
      <span class="material-symbols-outlined text-4xl mb-4 block text-white/40">label_off</span>
      <p class="font-headline text-sm uppercase text-white/50">No tags yet</p>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>