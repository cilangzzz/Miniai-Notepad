<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArchive } from '@/composables/useArchive'
import { useResponsive } from '@/composables/useResponsive'
import ArchiveResults from '@/components/business/archive/ArchiveResults.vue'
import FilterChips from '@/components/business/archive/FilterChips.vue'
import BaseToast from '@/components/base/BaseToast.vue'

const router = useRouter()
const { isMobile } = useResponsive()
const { archivedNotes, loading, archivedCount, loadArchivedNotes, restoreNote, searchArchivedNotes } = useArchive()

// State
const searchQuery = ref('')
const activeTimeFilter = ref('all')
const activeCategoryFilters = ref<string[]>([])
const showToast = ref(false)
const toastMessage = ref('')

// Computed
const filteredNotes = computed(() => {
  let result = archivedNotes.value

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
  searchArchivedNotes(query)
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

onMounted(() => {
  loadArchivedNotes()
})
</script>

<template>
  <div class="archive-page px-6 md:px-12 max-w-6xl mx-auto">
    <!-- Header -->
    <section class="mb-12">
      <h2 class="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
        ARCHIVE <span class="text-primary-container">VAULT</span>
      </h2>
      <p class="font-headline text-sm uppercase tracking-widest text-secondary-container font-bold">
        Cold storage for your kinetic thoughts
      </p>
    </section>

    <!-- Prominent Search Bar -->
    <div class="relative mb-16">
      <div class="absolute inset-0 bg-secondary-container translate-x-2 translate-y-2" />
      <div class="relative bg-surface-container-lowest border-4 border-white flex items-center p-2 group transition-transform hover:-translate-y-1 hover:-translate-x-1">
        <span class="material-symbols-outlined text-white px-4 text-3xl">search</span>
        <input
          v-model="searchQuery"
          type="text"
          class="w-full bg-transparent border-none text-white font-headline text-2xl md:text-3xl font-bold placeholder:text-surface-container-highest focus:ring-0 uppercase py-4"
          placeholder="QUERY THE ARCHIVE..."
          @keydown.enter="handleSearchExecute(searchQuery)"
        />
        <button
          type="button"
          class="bg-primary-container text-on-primary font-headline font-black px-8 py-4 border-l-4 border-white hover:bg-white transition-colors uppercase"
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
      :has-more="false"
      :total="archivedCount"
      @restore="handleRestore"
      @click="handleNoteClick"
      @load-more="handleLoadMore"
    />

    <!-- Empty State -->
    <div v-if="!loading && filteredNotes.length === 0" class="mt-24 text-center">
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

    <!-- Toast -->
    <BaseToast
      v-if="showToast"
      :message="toastMessage"
      type="success"
      @close="showToast = false"
    />
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>