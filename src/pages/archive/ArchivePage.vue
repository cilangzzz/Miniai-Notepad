<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArchive } from '@/composables/useArchive'
import SearchBar from '@/components/common/SearchBar.vue'
import ArchiveResults from '@/components/business/archive/ArchiveResults.vue'
import FilterChips from '@/components/business/archive/FilterChips.vue'
import StorageCapacity from '@/components/business/archive/StorageCapacity.vue'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'
import BaseToast from '@/components/base/BaseToast.vue'
import type { Note } from '@/types/entities'

const router = useRouter()
const { archivedNotes, loading, hasMore, total, loadArchivedNotes, restoreNote, searchArchive } = useArchive()

// State
const searchQuery = ref('')
const activeTimeFilter = ref('all')
const activeCategoryFilters = ref<string[]>([])
const showToast = ref(false)
const toastMessage = ref('')

// Computed
const filteredNotes = computed(() => {
  let result = archivedNotes.value

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.content.toLowerCase().includes(query)
    )
  }

  return result
})

// Handlers
function handleSearchExecute(query: string) {
  searchQuery.value = query
  searchArchive(query)
}

function handleTimeChange(filterId: string) {
  activeTimeFilter.value = filterId
  loadArchivedNotes()
}

function handleCategoryChange(filterIds: string[]) {
  activeCategoryFilters.value = filterIds
  loadArchivedNotes()
}

function handleReset() {
  searchQuery.value = ''
  activeTimeFilter.value = 'all'
  activeCategoryFilters.value = []
  loadArchivedNotes()
}

async function handleRestore(noteId: string) {
  await restoreNote(noteId)
  toastMessage.value = 'Note restored successfully'
  showToast.value = true
}

function handleNoteClick(noteId: string) {
  router.push(`/archive/${noteId}`)
}

function handleLoadMore() {
  loadArchivedNotes()
}

function handleMenuClick() {}
function handleSearchClick() {}
function handleAvatarClick() {}

const currentNav = 'archive'

onMounted(() => {
  loadArchivedNotes()
})
</script>

<template>
  <div class="archive-page min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-black">
    <!-- TopAppBar -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
      @avatar-click="handleAvatarClick"
    />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="true" />

    <!-- Main Content -->
    <main class="min-h-screen pb-32 md:ml-80">
      <!-- Search Section -->
      <section class="px-6 pt-12 max-w-6xl mx-auto">
        <!-- Header -->
        <div class="mb-12">
          <h2 class="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            ARCHIVE <span class="text-primary-container">VAULT</span>
          </h2>
          <p class="font-headline text-sm uppercase tracking-widest text-secondary-container font-bold">
            Cold storage for your kinetic thoughts
          </p>
        </div>

        <!-- Prominent Search Bar -->
        <div class="relative mb-16">
          <div class="absolute inset-0 bg-secondary-container translate-x-2 translate-y-2" />
          <div class="relative bg-surface-container-lowest border-4 border-white flex items-center p-2 group transition-transform hover:-translate-y-1 hover:-translate-x-1">
            <span class="material-symbols-outlined text-white px-4 text-3xl">search</span>
            <input
              v-model="searchQuery"
              type="text"
              class="w-full bg-transparent border-none text-white font-headline text-2xl md:text-3xl font-bold placeholder:text-surface-container-highest focus:ring-0 uppercase py-4 rounded-none"
              placeholder="QUERY THE ARCHIVE..."
              @keydown.enter="handleSearchExecute(searchQuery)"
            />
            <button
              type="button"
              class="bg-primary-container text-on-primary font-headline font-black px-8 py-4 border-l-4 border-white hover:bg-white transition-colors uppercase rounded-none"
              @click="handleSearchExecute(searchQuery)"
            >
              Execute
            </button>
          </div>
        </div>

        <!-- Filter Chips -->
        <FilterChips
          :active-time-filter="activeTimeFilter"
          :active-category-filters="activeCategoryFilters"
          @time-change="handleTimeChange"
          @category-change="handleCategoryChange"
          @reset="handleReset"
        />

        <!-- Archive Results -->
        <ArchiveResults
          class="mt-12"
          :archived-notes="filteredNotes"
          :loading="loading"
          :has-more="hasMore"
          :total="total"
          @restore="handleRestore"
          @click="handleNoteClick"
          @load-more="handleLoadMore"
        />
      </section>

      <!-- Empty State Meta-Instruction -->
      <div v-if="!loading && filteredNotes.length === 0" class="mt-24 px-6 text-center max-w-2xl mx-auto">
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
    </main>

    <!-- Sidebar Storage Capacity -->
    <aside class="hidden lg:flex fixed left-0 top-[80px] h-full w-80 bg-surface-container-lowest border-r-4 border-white flex-col gap-4 p-8 z-[90] shadow-sidebar">
      <h2 class="font-headline font-bold text-white text-xl uppercase mb-4 tracking-tighter">
        CATEGORIES
      </h2>
      <nav class="flex flex-col gap-2">
        <a
          class="flex items-center gap-4 text-white/80 hover:translate-x-1 transition-transform hover:text-primary-container p-3"
          href="#"
        >
          <span class="material-symbols-outlined">work</span>
          <span class="font-headline font-bold uppercase">Work</span>
        </a>
        <a
          class="flex items-center gap-4 text-white/80 hover:translate-x-1 transition-transform hover:text-primary-container p-3"
          href="#"
        >
          <span class="material-symbols-outlined">person</span>
          <span class="font-headline font-bold uppercase">Personal</span>
        </a>
        <a
          class="flex items-center gap-4 text-white/80 hover:translate-x-1 transition-transform hover:text-primary-container p-3"
          href="#"
        >
          <span class="material-symbols-outlined">lightbulb</span>
          <span class="font-headline font-bold uppercase">Ideas</span>
        </a>
        <a
          class="flex items-center gap-4 text-white/80 hover:translate-x-1 transition-transform hover:text-primary-container p-3"
          href="#"
        >
          <span class="material-symbols-outlined">check_circle</span>
          <span class="font-headline font-bold uppercase">Tasks</span>
        </a>
      </nav>

      <div class="mt-auto pt-8 border-t-2 border-white/10">
        <StorageCapacity :used="84" :total="100" />
      </div>
    </aside>

    <!-- Toast -->
    <BaseToast
      v-if="showToast"
      :message="toastMessage"
      type="success"
      @close="showToast = false"
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
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>