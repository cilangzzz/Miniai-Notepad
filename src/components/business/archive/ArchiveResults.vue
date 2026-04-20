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
    <!-- Results header -->
    <div class="neo-results-header mb-6">
      <h3 class="font-headline font-bold uppercase tracking-wider text-sm text-white">
        ARCHIVE RESULTS
        <span v-if="total > 0" class="text-white/60 ml-2">({{ total }} items)</span>
      </h3>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="neo-loading-state py-12">
      <div class="flex justify-center items-center">
        <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
        <span class="ml-4 font-headline uppercase tracking-wider text-white/60">Loading archive...</span>
      </div>
    </div>

    <!-- Archive cards grid -->
    <div v-else-if="archivedNotes.length > 0" class="neo-results-grid">
      <article
        v-for="note in archivedNotes"
        :key="note.id"
        :class="[
          'relative bg-background border-4 border-white transition-all duration-200 cursor-pointer',
          hoveredCardId === note.id
            ? 'shadow-[12px_12px_0_rgba(255,255,255,0.2)] -translate-x-1 -translate-y-1'
            : 'shadow-[8px_8px_0_rgba(255,255,255,0.1)]',
        ]"
        @mouseenter="hoveredCardId = note.id"
        @mouseleave="hoveredCardId = null"
        @click="emit('click', note.id)"
      >
        <div
          :class="[
            'neo-card-content p-4 transition-all duration-200',
            hoveredCardId !== note.id && 'grayscale opacity-70',
            hoveredCardId === note.id && 'grayscale-0 opacity-100',
          ]"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-headline font-semibold text-lg text-white line-clamp-2">
              {{ note.title }}
            </h4>

            <!-- Restore button -->
            <button
              type="button"
              class="bg-secondary border-2 border-white p-2 transition-colors duration-150 hover:bg-primary"
              @click.stop="emit('restore', note.id)"
            >
              <span class="material-symbols-outlined text-white text-sm">unarchive</span>
            </button>
          </div>

          <!-- Content summary -->
          <p class="font-body text-white/80 text-sm line-clamp-3 mb-4">
            {{ truncatedContent(note.content) }}
          </p>

          <!-- Footer -->
          <div class="flex items-center justify-between">
            <span class="font-headline font-bold uppercase text-xs px-3 py-1 bg-secondary text-white">
              {{ note.card_color }}
            </span>
            <span class="font-headline text-xs text-white/60">
              Archived: {{ formatArchivedTime(note.archived_at || 0) }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty state -->
    <div v-else class="neo-empty-state py-12 text-center">
      <div class="bg-surfaceHigh border-4 border-white p-8 max-w-md mx-auto">
        <span class="material-symbols-outlined text-5xl text-white/40 mx-auto mb-4 block">archive</span>
        <p class="font-headline font-bold uppercase tracking-wider mb-2 text-white">NO ARCHIVED NOTES FOUND</p>
        <p class="font-body text-white/60 text-sm">Adjust your query to find what you're looking for</p>
      </div>
    </div>

    <!-- Load more -->
    <div v-if="hasMore && !loading" class="neo-load-more py-8 text-center">
      <button
        type="button"
        class="bg-surfaceHigh border-4 border-white px-8 py-3 font-headline font-bold uppercase tracking-wider text-white shadow-[8px_8px_0_rgba(255,255,255,0.1)] hover:-translate-x-1 hover:-translate-y-1 transition-all"
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

.neo-results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 768px) {
  .neo-results-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .neo-results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>