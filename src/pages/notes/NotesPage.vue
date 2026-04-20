<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotes } from '@/composables/useNotes'
import { useResponsive } from '@/composables/useResponsive'
import NoteList from '@/components/business/note/NoteList.vue'
import BaseFab from '@/components/base/BaseFab.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const { isMobile } = useResponsive()
const { notes, loading, fetchNotes, createNote, archiveNote, pinNote, unpinNote } = useNotes()

// Search and sort
const searchQuery = ref('')
const sortOption = ref('newest')

// Computed filtered notes
const filteredNotes = computed(() => {
  let result = notes.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query)
    )
  }

  if (sortOption.value === 'newest') {
    result = [...result].sort((a, b) => b.updated_at - a.updated_at)
  } else if (sortOption.value === 'oldest') {
    result = [...result].sort((a, b) => a.updated_at - b.updated_at)
  }

  return result
})

// Handlers
function handleNoteClick(id: string) {
  router.push(`/notes/${id}`)
}

function handleEdit(id: string) {
  router.push(`/notes/${id}/edit`)
}

function handleArchive(id: string) {
  archiveNote(id)
}

function handlePin(id: string) {
  const note = notes.value.find(n => n.id === id)
  if (note?.is_pinned) {
    unpinNote(id)
  } else {
    pinNote(id)
  }
}

function handleCreateNote() {
  router.push('/notes/new')
}

onMounted(() => {
  fetchNotes()
})
</script>

<template>
  <div class="notes-page px-6 md:px-12">
    <!-- Header Section -->
    <section class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <span class="bg-secondary-container text-white px-4 py-1 font-headline font-bold text-sm mb-4 inline-block border-2 border-white uppercase">
          Your Feed
        </span>
        <h2 class="text-5xl md:text-7xl font-headline font-black text-white leading-none mt-2 -skew-x-1 uppercase">
          Recent<br /><span class="text-primary-container">Activity</span>
        </h2>
      </div>
      <div class="flex gap-4">
        <button
          type="button"
          class="px-6 py-2 bg-surface-container-lowest border-4 border-white text-white font-headline font-bold uppercase hover:-translate-y-1 transition-transform shadow-neo-black"
        >
          Filter
        </button>
        <button
          type="button"
          class="px-6 py-2 bg-primary-container border-4 border-white text-on-primary font-headline font-black uppercase hover:-translate-y-1 transition-transform shadow-neo-black"
        >
          Sort By
        </button>
      </div>
    </section>

    <!-- Notes Grid -->
    <NoteList
      :notes="filteredNotes"
      :loading="loading"
      @click="handleNoteClick"
      @edit="handleEdit"
      @archive="handleArchive"
      @pin="handlePin"
    />

    <!-- Empty State -->
    <EmptyState
      v-if="!loading && filteredNotes.length === 0"
      title="NO NOTES FOUND"
      description="Create your first note"
      icon="note_stack"
      action-label="CREATE NOTE"
      @action="handleCreateNote"
    />

    <!-- FAB - positioned to avoid bottom nav -->
    <BaseFab
      icon="add"
      color="gold"
      :class="isMobile ? 'bottom-[88px]' : 'bottom-8'"
      @click="handleCreateNote"
    />

    <!-- Decorative elements -->
    <div class="fixed top-24 right-0 w-32 h-32 bg-secondary-container/10 -z-10 -rotate-12 pointer-events-none"></div>
    <div class="fixed bottom-0 left-0 w-64 h-64 bg-primary-container/5 -z-10 rotate-45 pointer-events-none"></div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>