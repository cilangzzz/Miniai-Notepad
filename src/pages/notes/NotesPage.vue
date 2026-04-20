<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotes } from '@/composables/useNotes'
import { useResponsive } from '@/composables/useResponsive'
import NoteList from '@/components/business/note/NoteList.vue'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'
import BaseFab from '@/components/base/BaseFab.vue'
import SearchBar from '@/components/common/SearchBar.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const { isMobile } = useResponsive()
const { notes, loading, fetchNotes, createNote, archiveNote, pinNote, unpinNote } = useNotes()

// Search and sort
const searchQuery = ref('')
const sortOption = ref('newest')
const showSearch = ref(false)

// Computed filtered notes
const filteredNotes = computed(() => {
  let result = notes.value

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query)
    )
  }

  // Sort
  if (sortOption.value === 'newest') {
    result = [...result].sort((a, b) => b.updated_at - a.updated_at)
  } else if (sortOption.value === 'oldest') {
    result = [...result].sort((a, b) => a.updated_at - b.updated_at)
  } else if (sortOption.value === 'title') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title))
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

function handleSearchExecute(query: string) {
  searchQuery.value = query
}

function handleMenuClick() {
  // Toggle drawer
}

function handleSearchClick() {
  showSearch.value = !showSearch.value
}

// Navigation
const currentNav = 'notes'

onMounted(() => {
  fetchNotes()
})
</script>

<template>
  <div class="notes-page min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-black">
    <!-- Top App Bar -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
    />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="!isMobile" />

    <!-- Main Content -->
    <main class="md:ml-72 pt-24 pb-32 px-6 md:px-12">
      <!-- Header Section (matching reference) -->
      <section class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span class="text-primary-container font-headline font-black text-sm tracking-[0.3em] uppercase">Your Feed</span>
          <h2 class="text-5xl md:text-7xl font-headline font-black text-white leading-none mt-2 -skew-x-1 uppercase">
            Recent<br />Activity
          </h2>
        </div>
        <div class="flex gap-4">
          <button
            type="button"
            class="px-6 py-2 bg-surface-container-lowest border-4 border-white text-white font-headline font-bold uppercase hover:-translate-y-1 transition-transform shadow-neo-black rounded-none"
          >
            Filter
          </button>
          <button
            type="button"
            class="px-6 py-2 bg-primary-container border-4 border-white text-on-primary font-headline font-black uppercase hover:-translate-y-1 transition-transform shadow-neo-black rounded-none"
          >
            Sort By
          </button>
        </div>
      </section>

      <!-- Search Bar (toggleable) -->
      <section v-if="showSearch" class="mb-8">
        <SearchBar
          v-model="searchQuery"
          placeholder="SEARCH YOUR NOTES..."
          @execute="handleSearchExecute"
        />
      </section>

      <!-- Notes List (Bento Grid) -->
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
        description="Create your first note or adjust your search"
        icon="note_stack"
        action-label="CREATE NOTE"
        @action="handleCreateNote"
      />
    </main>

    <!-- FAB -->
    <BaseFab
      icon="add"
      color="gold"
      @click="handleCreateNote"
    />

    <!-- Mobile Bottom Navigation -->
    <BottomNavBar
      v-if="isMobile"
      :active-id="currentNav"
      @navigate="(route) => router.push(route)"
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
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>