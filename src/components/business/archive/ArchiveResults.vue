<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Note } from '@/types/entities'

interface Props {
  archivedNotes?: Note[]
  loading?: boolean
  hasMore?: boolean
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  archivedNotes: [],
  loading: false,
  hasMore: false,
  total: 0,
})

const emit = defineEmits<{
  restore: [noteId: string]
  click: [noteId: string]
  loadMore: []
}>()

const hoveredCardId = ref<string | null>(null)

const truncatedContent = (content: string) => {
  return content.slice(0, 100) + (content.length > 100 ? '...' : '')
}

const formatArchivedTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
</script>

<template>
  <div class="neo-archive-results">
    <!-- Loading state -->
    <div v-if="loading" class="neo-loading-state py-12">
      <div class="flex justify-center items-center">
        <span class="material-symbols-outlined text-4xl text-primary-container animate-spin">progress_activity</span>
        <span class="ml-4 font-headline uppercase tracking-wider text-white/60">Loading archive...</span>
      </div>
    </div>

    <!-- Archive cards grid -->
    <div v-else-if="archivedNotes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="note in archivedNotes"
        :key="note.id"
        class="group relative"
      >
        <!-- Background shadow layer -->
        <div class="absolute inset-0 bg-surface-container-high translate-x-2 translate-y-2 border-2 border-white opacity-20" />

        <!-- Main card -->
        <div
          :class="[
            'relative bg-surface-container-lowest border-4 border-white p-6 transition-all duration-150 cursor-pointer flex flex-col h-full',
            hoveredCardId !== note.id && 'grayscale opacity-70',
            hoveredCardId === note.id && 'grayscale-0 opacity-100 group-hover:-translate-y-2 group-hover:-translate-x-2',
          ]"
          @mouseenter="hoveredCardId = note.id"
          @mouseleave="hoveredCardId = null"
          @click="emit('click', note.id)"
        >
          <!-- Header -->
          <div class="flex justify-between items-start mb-6">
            <span class="bg-surface-container-high text-white/60 font-headline font-bold text-[10px] px-3 py-1 uppercase tracking-widest border border-white/20">
              Archived {{ formatArchivedTime(note.archived_at || 0) }}
            </span>
            <span class="material-symbols-outlined text-white/40 group-hover:text-primary-container transition-colors">
              unarchive
            </span>
          </div>

          <!-- Title -->
          <h3 class="font-headline text-2xl font-black mb-4 leading-none text-white/80 group-hover:text-white uppercase">
            {{ note.title }}
          </h3>

          <!-- Content summary -->
          <p class="font-body text-on-surface-variant text-sm flex-grow mb-8">
            {{ truncatedContent(note.content) }}
          </p>

          <!-- Footer -->
          <div class="flex gap-2 mt-auto">
            <span class="text-[10px] font-bold uppercase tracking-tighter text-secondary-container">#{{ note.card_color }}</span>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else class="py-24 text-center">
      <div class="inline-block p-12 border-4 border-dashed border-white/20">
        <span class="material-symbols-outlined text-white/20 text-6xl mb-4">inventory_2</span>
        <p class="font-headline text-xl font-bold text-white/30 uppercase tracking-tighter">
          End of Archive Search Results
        </p>
        <p class="font-body text-white/20 text-sm mt-2 uppercase tracking-widest">
          Adjust query parameters for deeper excavation
        </p>
      </div>
    </div>

    <!-- Load more -->
    <div v-if="hasMore && !loading" class="py-8 text-center">
      <button
        type="button"
        class="bg-surface-container-high border-4 border-white px-8 py-3 font-headline font-bold uppercase tracking-wider text-white shadow-neo-black hover:-translate-x-1 hover:-translate-y-1 transition-all"
        @click="emit('loadMore')"
      >
        LOAD MORE
      </button>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>