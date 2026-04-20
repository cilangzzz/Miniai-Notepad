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
  <div class="archive-page min-h-screen bg-background">
    <!-- Top App Bar -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
      @avatar-click="handleAvatarClick"
    />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="true" />

    <!-- Main Content -->
    <main class="pt-[72px] pb-[80px] px-4 md:px-12 md:ml-[288px]">
      <!-- Page Header -->
      <header class="mb-12">
        <h1 class="font-headline font-black text-4xl md:text-5xl text-primary uppercase tracking-tighter -skew-x-2">
          ARCHIVE SEARCH
        </h1>
        <p class="font-headline font-bold text-sm text-white/60 uppercase mt-2">
          SEARCH AND RESTORE YOUR ARCHIVED NOTES
        </p>
      </header>

      <!-- Search Bar -->
      <section class="mb-8">
        <SearchBar
          v-model="searchQuery"
          placeholder="QUERY THE ARCHIVE..."
          @execute="handleSearchExecute"
        />
      </section>

      <!-- Filter Chips -->
      <section class="mb-8">
        <FilterChips
          :active-time-filter="activeTimeFilter"
          :active-category-filters="activeCategoryFilters"
          @time-change="handleTimeChange"
          @category-change="handleCategoryChange"
          @reset="handleReset"
        />
      </section>

      <!-- Archive Results -->
      <section class="mb-16">
        <ArchiveResults
          :archived-notes="filteredNotes"
          :loading="loading"
          :has-more="hasMore"
          :total="total"
          @restore="handleRestore"
          @click="handleNoteClick"
          @load-more="handleLoadMore"
        />
      </section>

      <!-- Storage Capacity -->
      <section>
        <StorageCapacity :used="67" :total="50" />
      </section>
    </main>

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
</style>