import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note } from '@/types'
import { noteRepo } from '@/repositories'

export const useArchiveStore = defineStore('archive', () => {
  // ========== State ==========
  const searchKeyword = ref('')
  const activeTimeFilter = ref<'all' | 'week' | 'month' | 'year'>('all')
  const activeCategoryFilters = ref<string[]>([])
  const archivedNotes = ref<Note[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const filteredArchivedNotes = computed(() => {
    let result = archivedNotes.value

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(keyword) ||
        n.content.toLowerCase().includes(keyword)
      )
    }

    if (activeTimeFilter.value !== 'all') {
      const now = Date.now()
      let threshold: number
      switch (activeTimeFilter.value) {
        case 'week':
          threshold = now - 7 * 24 * 60 * 60 * 1000
          break
        case 'month':
          threshold = now - 30 * 24 * 60 * 60 * 1000
          break
        case 'year':
          threshold = now - 365 * 24 * 60 * 60 * 1000
          break
        default:
          threshold = 0
      }
      result = result.filter(n => (n.archived_at || 0) >= threshold)
    }

    if (activeCategoryFilters.value.length > 0) {
      result = result.filter(n =>
        activeCategoryFilters.value.includes(n.category_id)
      )
    }

    return result.sort((a, b) => (b.archived_at || 0) - (a.archived_at || 0))
  })

  const archivedNotesByCategory = computed(() =>
    archivedNotes.value.reduce((acc, note) => {
      const cat = note.category_id
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(note)
      return acc
    }, {} as Record<string, Note[]>)
  )

  const archivedCount = computed(() => archivedNotes.value.length)

  // ========== Actions ==========
  async function loadArchivedNotes() {
    loading.value = true
    error.value = null
    try {
      archivedNotes.value = await noteRepo.findArchived()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载归档笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function searchArchivedNotes(keyword: string) {
    loading.value = true
    error.value = null
    try {
      const results = await noteRepo.searchByKeyword(keyword)
      archivedNotes.value = results.filter(n => n.is_archived)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '搜索归档笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function restoreNote(id: string) {
    loading.value = true
    error.value = null
    try {
      await noteRepo.unarchive(id)
      archivedNotes.value = archivedNotes.value.filter(n => n.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '恢复笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deletePermanently(id: string) {
    loading.value = true
    error.value = null
    try {
      await noteRepo.delete(id)
      archivedNotes.value = archivedNotes.value.filter(n => n.id !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '永久删除笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setSearchKeyword(keyword: string) {
    searchKeyword.value = keyword
  }

  function setTimeFilter(filter: 'all' | 'week' | 'month' | 'year') {
    activeTimeFilter.value = filter
  }

  function setCategoryFilters(categoryIds: string[]) {
    activeCategoryFilters.value = categoryIds
  }

  function toggleCategoryFilter(categoryId: string) {
    const index = activeCategoryFilters.value.indexOf(categoryId)
    if (index === -1) {
      activeCategoryFilters.value.push(categoryId)
    } else {
      activeCategoryFilters.value.splice(index, 1)
    }
  }

  function clearFilters() {
    searchKeyword.value = ''
    activeTimeFilter.value = 'all'
    activeCategoryFilters.value = []
  }

  async function initialize() {
    await loadArchivedNotes()
  }

  return {
    // State
    searchKeyword,
    activeTimeFilter,
    activeCategoryFilters,
    archivedNotes,
    loading,
    error,
    // Getters
    filteredArchivedNotes,
    archivedNotesByCategory,
    archivedCount,
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
    initialize
  }
})