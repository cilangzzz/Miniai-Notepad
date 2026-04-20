<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Note } from '@/types/entities'

interface Props {
  notes?: Note[]
  loading?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  notes: [],
  loading: false,
  showActions: true,
})

const emit = defineEmits<{
  click: [id: string]
  edit: [id: string]
  archive: [id: string]
  delete: [id: string]
  pin: [id: string]
}>()

const hoveredId = ref<string | null>(null)

const pinnedNotes = computed(() => props.notes.filter(n => n.is_pinned))
const regularNotes = computed(() => props.notes.filter(n => !n.is_pinned))
</script>

<template>
  <div class="notes-list">
    <!-- Loading state -->
    <div
      v-if="loading"
      class="flex justify-center py-12"
    >
      <span class="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
    </div>

    <!-- Pinned notes section -->
    <section
      v-if="pinnedNotes.length > 0"
      class="mb-8"
    >
      <h2 class="font-headline font-bold text-xs uppercase text-secondary tracking-widest mb-4">
        PINNED
      </h2>
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <NoteCard
          v-for="note in pinnedNotes"
          :key="note.id"
          :note="note"
          :show-actions="showActions"
          @click="emit('click', note.id)"
          @edit="emit('edit', note.id)"
          @archive="emit('archive', note.id)"
          @pin="emit('pin', note.id)"
        />
      </div>
    </section>

    <!-- Regular notes -->
    <section v-if="regularNotes.length > 0">
      <h2
        v-if="pinnedNotes.length > 0"
        class="font-headline font-bold text-xs uppercase text-white/60 tracking-widest mb-4"
      >
        OTHERS
      </h2>
      <div class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <NoteCard
          v-for="note in regularNotes"
          :key="note.id"
          :note="note"
          :show-actions="showActions"
          @click="emit('click', note.id)"
          @edit="emit('edit', note.id)"
          @archive="emit('archive', note.id)"
          @pin="emit('pin', note.id)"
        />
      </div>
    </section>

    <!-- Empty state -->
    <div
      v-if="!loading && notes.length === 0"
      class="py-12 text-center"
    >
      <span class="material-symbols-outlined text-5xl text-white/40 mb-4 block">note_stack</span>
      <p class="font-headline font-bold text-lg uppercase text-white/60">
        NO NOTES YET
      </p>
      <p class="font-body text-sm text-white/40 mt-2">
        Create your first note to get started
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import NoteCard from './NoteCard.vue'
</script>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>