import { computed, onMounted } from 'vue'
import { useArchiveStore } from '@/stores'
import type { Note } from '@/types'

/**
 * 归档搜索操作封装
 * 提供便捷的归档笔记搜索和恢复接口
 */
export function useArchive() {
  const archiveStore = useArchiveStore()

  // Computed from store
  const searchKeyword = computed(() => archiveStore.searchKeyword)
  const activeTimeFilter = computed(() => archiveStore.activeTimeFilter)
  const activeCategoryFilters = computed(() => archiveStore.activeCategoryFilters)
  const archivedNotes = computed(() => archiveStore.archivedNotes)
  const filteredArchivedNotes = computed(() => archiveStore.filteredArchivedNotes)
  const loading = computed(() => archiveStore.loading)
  const error = computed(() => archiveStore.error)

  // Additional computed
  const archivedCount = computed(() => archiveStore.archivedCount)
  const archivedNotesByCategory = computed(() => archiveStore.archivedNotesByCategory)

  // Actions
  async function loadArchivedNotes() {
    await archiveStore.loadArchivedNotes()
  }

  async function searchArchivedNotes(keyword: string) {
    await archiveStore.searchArchivedNotes(keyword)
  }

  async function restoreNote(id: string) {
    await archiveStore.restoreNote(id)
  }

  async function deletePermanently(id: string) {
    await archiveStore.deletePermanently(id)
  }

  function setSearchKeyword(keyword: string) {
    archiveStore.setSearchKeyword(keyword)
  }

  function setTimeFilter(filter: 'all' | 'week' | 'month' | 'year') {
    archiveStore.setTimeFilter(filter)
  }

  function setCategoryFilters(categoryIds: string[]) {
    archiveStore.setCategoryFilters(categoryIds)
  }

  function toggleCategoryFilter(categoryId: string) {
    archiveStore.toggleCategoryFilter(categoryId)
  }

  function clearFilters() {
    archiveStore.clearFilters()
  }

  // Helper functions
  function getArchivedNoteById(id: string): Note | undefined {
    return archivedNotes.value.find(n => n.id === id)
  }

  function isCategoryFilterActive(categoryId: string): boolean {
    return activeCategoryFilters.value.includes(categoryId)
  }

  function getArchivedNotesByCategory(categoryId: string): Note[] {
    return archivedNotes.value.filter(n => n.category_id === categoryId)
  }

  // Get archived notes count by category
  function getArchivedCountByCategory(categoryId: string): number {
    return getArchivedNotesByCategory(categoryId).length
  }

  // Initialize on mount
  function initialize() {
    return archiveStore.initialize()
  }

  onMounted(() => {
    if (archivedNotes.value.length === 0) {
      loadArchivedNotes()
    }
  })

  return {
    // State
    searchKeyword,
    activeTimeFilter,
    activeCategoryFilters,
    archivedNotes,
    filteredArchivedNotes,
    loading,
    error,

    // Computed
    archivedCount,
    archivedNotesByCategory,

    // Actions
    loadArchivedNotes,
    searchArchivedNotes,
    restoreNote,
    deletePermanently,
    setSearchKeyword,
    setTimeFilter,
    setCategoryFilters,
    toggleCategoryFilter,
    clearFilters,

    // Helpers
    getArchivedNoteById,
    isCategoryFilterActive,
    getArchivedNotesByCategory,
    getArchivedCountByCategory,

    // Lifecycle
    initialize,
  }
}