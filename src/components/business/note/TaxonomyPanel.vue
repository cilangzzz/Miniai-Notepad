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
  <section class="bg-surface-container-high border-4 border-white p-6 relative">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary-container text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Taxonomy
    </span>

    <!-- Title -->
    <h3 class="font-headline font-bold text-xl mb-4 text-primary-container italic">
      TAGS_CATALOG
    </h3>

    <!-- Tags -->
    <div class="flex flex-wrap gap-2">
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
        v-if="editable"
        type="button"
        class="bg-transparent text-white/50 border-2 border-white/20 border-dashed px-3 py-1 font-headline font-bold text-xs hover:text-white hover:border-white transition-all rounded-none"
        @click="emit('create')"
      >
        + ADD TAG
      </button>
    </div>
  </section>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>