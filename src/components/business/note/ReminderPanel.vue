<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '@/types/entities'

interface Props {
  tags?: string[]
  availableTags?: { id: string; name: string }[]
  lastEdited?: string
}

const props = withDefaults(defineProps<Props>(), {
  tags: [],
  availableTags: [],
  lastEdited: '2 mins ago',
})

const emit = defineEmits<{
  setReminder: []
  addTag: [tagName: string]
  removeTag: [tagId: string]
}>()

const formattedTags = computed(() => {
  return props.tags.map(tagId => {
    const tag = props.availableTags.find(t => t.id === tagId)
    return tag ? { id: tagId, name: tag.name } : { id: tagId, name: tagId }
  })
})
</script>

<template>
  <section class="bg-surface-container-high border-4 border-white p-6 relative">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary-container text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Temporal
    </span>

    <!-- Title -->
    <h3 class="font-headline font-bold text-xl mb-4 text-primary-container italic">
      REMIND_ME
    </h3>

    <!-- Set reminder button -->
    <div class="flex flex-col gap-3">
      <button
        type="button"
        class="w-full bg-surface-container-lowest border-2 border-white p-3 flex justify-between items-center hover:bg-secondary-container transition-colors group rounded-none"
        @click="emit('setReminder')"
      >
        <span class="font-headline font-bold text-sm uppercase">SET ALERT</span>
        <span class="material-symbols-outlined text-primary-container group-hover:text-white">notifications_active</span>
      </button>

      <!-- Last edited info -->
      <div class="flex items-center gap-2 text-surface-container-highest font-headline font-bold text-[10px] uppercase">
        <span class="material-symbols-outlined text-sm">history</span>
        Last Edited: {{ lastEdited }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>