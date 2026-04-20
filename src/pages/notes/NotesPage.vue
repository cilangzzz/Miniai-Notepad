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
import SortButton from '@/components/common/SortButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const router = useRouter()
const { isMobile } = useResponsive()
const { notes, loading, loadNotes, createNote, archiveNote, togglePin } = useNotes()

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
  togglePin(id)
}

function handleCreateNote() {
  router.push('/notes/new')
}

function handleSortChange(value: string) {
  sortOption.value = value
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
  loadNotes()
})
</script>

<template>
  <div class="notes-page min-h-screen bg-background">
    <!-- Top App Bar -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
    />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="!isMobile" />

    <!-- Main Content -->
    <main class="pt-[72px] pb-[80px] px-4 md:px-12 md:ml-[288px]">
      <!-- Page Header -->
      <header class="mb-8">
        <h1 class="font-headline font-black text-4xl md:text-5xl text-primary uppercase tracking-tighter -skew-x-2">
          NOTES
        </h1>
        <p class="font-headline font-bold text-sm text-white/60 uppercase mt-2">
          YOUR COLLECTION OF IDEAS
        </p>
      </header>

      <!-- Search Bar (toggleable) -->
      <section v-if="showSearch" class="mb-8">
        <SearchBar
          v-model="searchQuery"
          placeholder="SEARCH YOUR NOTES..."
          @execute="handleSearchExecute"
        />
      </section>

      <!-- Sort Controls -->
      <section class="mb-8 flex items-center gap-4">
        <SortButton
          :active-value="sortOption"
          @change="handleSortChange"
        />
        <span class="font-headline text-xs text-white/60 uppercase">
          {{ filteredNotes.length }} notes
        </span>
      </section>

      <!-- Notes List -->
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
      :active-id="currentNav"
      @navigate="(route) => router.push(route)"
    />
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>