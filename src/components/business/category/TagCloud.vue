<script setup lang="ts">
import { computed } from 'vue'
import type { Tag } from '@/types/entities'
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

// Get rotation for each tag (cycle through -3 to 3)
const getRotation = (index: number) => {
  const rotations = [-3, -2, -1, 0, 1, 2, 3]
  return rotations[index % rotations.length]
}

// Get shadow variant for visual variety
const getShadow = (index: number): 'none' | 'teal' | 'yellow' | 'black' => {
  const shadows = ['none', 'teal', 'yellow', 'black']
  return shadows[index % shadows.length]
}
</script>

<template>
  <div class="relative p-8 bg-surface-container-lowest border-4 border-white min-h-[500px]">
    <!-- Title bar -->
    <div class="flex justify-between items-center mb-8">
      <h2 class="font-headline font-black text-4xl text-white uppercase tracking-tighter italic">
        Tag Cloud
      </h2>

      <div class="flex gap-2">
        <button
          type="button"
          class="bg-surface-container-highest border-2 border-white p-2 hover:bg-secondary-container transition-colors"
        >
          <span class="material-symbols-outlined text-white">filter_list</span>
        </button>
        <button
          type="button"
          class="bg-surface-container-highest border-2 border-white p-2 hover:bg-secondary-container transition-colors"
        >
          <span class="material-symbols-outlined text-white">sort_by_alpha</span>
        </button>
      </div>
    </div>

    <!-- Tag cloud -->
    <div class="flex flex-wrap gap-4 items-center">
      <BaseTag
        v-for="(tag, index) in tags"
        :key="tag.id"
        :label="`#${tag.name}`"
        :color="tag.color"
        :rotation="getRotation(index)"
        :shadow="getShadow(index)"
        :selected="selectedIds.includes(tag.id)"
        :removable="editable"
        size="lg"
        @click="emit('select', tag.id)"
        @remove="emit('remove', tag.id)"
      />
    </div>

    <!-- Drop zone -->
    <div
      v-if="editable"
      class="mt-16 bg-surface-container-lowest border-dashed border-4 border-outline-variant p-10 flex flex-col items-center justify-center text-center"
    >
      <span class="material-symbols-outlined text-6xl text-outline-variant mb-4">add_circle</span>
      <p class="font-headline font-black text-xl text-outline-variant uppercase">
        Drop new tags here to categorize instantly
      </p>
    </div>

    <!-- Empty state -->
    <div
      v-if="tags.length === 0 && !editable"
      class="py-12 text-center"
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