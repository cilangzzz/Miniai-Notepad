import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, NoteCreateDTO, NoteUpdateDTO, NoteFilter, NoteSort } from '@/types'
import { noteRepo } from '@/repositories'

export const useNoteStore = defineStore('note', () => {
  // ========== State ==========
  const notes = ref<Note[]>([])
  const currentNote = ref<Note | null>(null)
  const filter = ref<NoteFilter>({
    category_id: null,
    tags: [],
    is_archived: false,
    keyword: undefined
  })
  const sort = ref<NoteSort>({
    field: 'updated_at',
    order: 'desc'
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const filteredNotes = computed(() => {
    let result = notes.value.filter(n => !n.is_archived)

    if (filter.value.category_id) {
      result = result.filter(n => n.category_id === filter.value.category_id)
    }

    if (filter.value.tags.length > 0) {
      result = result.filter(n =>
        filter.value.tags.some(tag => n.tags.includes(tag))
      )
    }

    if (filter.value.keyword) {
      const keyword = filter.value.keyword.toLowerCase()
      result = result.filter(n =>
        n.title.toLowerCase().includes(keyword) ||
        n.content.toLowerCase().includes(keyword)
      )
    }

    return sortNotes(result, sort.value)
  })

  const notesByCategory = computed(() => {
    return notes.value
      .filter(n => !n.is_archived)
      .reduce((acc, note) => {
        const cat = note.category_id
        if (!acc[cat]) acc[cat] = []
        acc[cat].push(note)
        return acc
      }, {} as Record<string, Note[]>)
  })

  const pinnedNotes = computed(() =>
    notes.value.filter(n => n.is_pinned && !n.is_archived)
      .sort((a, b) => (b.pinned_at || 0) - (a.pinned_at || 0))
  )

  const recentNotes = computed(() =>
    notes.value
      .filter(n => !n.is_archived && !n.is_pinned)
      .sort((a, b) => b.updated_at - a.updated_at)
      .slice(0, 10)
  )

  // ========== Actions ==========
  async function fetchNotes() {
    loading.value = true
    error.value = null
    try {
      notes.value = await noteRepo.findAll()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取笔记列表失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function fetchNoteById(id: string) {
    loading.value = true
    error.value = null
    try {
      const note = await noteRepo.findById(id)
      currentNote.value = note
      return note
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取笔记详情失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createNote(data: NoteCreateDTO) {
    loading.value = true
    error.value = null
    try {
      const newNote = await noteRepo.create(data)
      notes.value.unshift(newNote)
      return newNote
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateNote(id: string, data: NoteUpdateDTO) {
    loading.value = true
    error.value = null
    try {
      const updated = await noteRepo.update(id, data)
      const index = notes.value.findIndex(n => n.id === id)
      if (index !== -1) {
        notes.value[index] = updated
      }
      if (currentNote.value?.id === id) {
        currentNote.value = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function archiveNote(id: string) {
    loading.value = true
    error.value = null
    try {
      await noteRepo.archive(id)
      const note = notes.value.find(n => n.id === id)
      if (note) {
        note.is_archived = true
        note.archived_at = Date.now()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '归档笔记失败'
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
      const note = notes.value.find(n => n.id === id)
      if (note) {
        note.is_archived = false
        note.archived_at = undefined
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '恢复笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteNote(id: string) {
    loading.value = true
    error.value = null
    try {
      await noteRepo.delete(id)
      notes.value = notes.value.filter(n => n.id !== id)
      if (currentNote.value?.id === id) {
        currentNote.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function pinNote(id: string) {
    try {
      await noteRepo.pin(id)
      const note = notes.value.find(n => n.id === id)
      if (note) {
        note.is_pinned = true
        note.pinned_at = Date.now()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '置顶笔记失败'
      throw e
    }
  }

  async function unpinNote(id: string) {
    try {
      await noteRepo.unpin(id)
      const note = notes.value.find(n => n.id === id)
      if (note) {
        note.is_pinned = false
        note.pinned_at = undefined
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '取消置顶失败'
      throw e
    }
  }

  async function searchNotes(keyword: string) {
    loading.value = true
    error.value = null
    try {
      const results = await noteRepo.searchByKeyword(keyword)
      return results
    } catch (e) {
      error.value = e instanceof Error ? e.message : '搜索笔记失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  function setFilter(newFilter: Partial<NoteFilter>) {
    filter.value = { ...filter.value, ...newFilter }
  }

  function setSort(newSort: Partial<NoteSort>) {
    sort.value = { ...sort.value, ...newSort }
  }

  function clearFilter() {
    filter.value = {
      category_id: null,
      tags: [],
      is_archived: false,
      keyword: undefined
    }
  }

  function setCurrentNote(note: Note | null) {
    currentNote.value = note
  }

  // ========== Helper Functions ==========
  function sortNotes(noteList: Note[], sortConfig: NoteSort): Note[] {
    return [...noteList].sort((a, b) => {
      let fieldA: number | string
      let fieldB: number | string

      switch (sortConfig.field) {
        case 'created_at':
          fieldA = a.created_at
          fieldB = b.created_at
          break
        case 'updated_at':
          fieldA = a.updated_at
          fieldB = b.updated_at
          break
        case 'title':
          fieldA = a.title
          fieldB = b.title
          break
        default:
          fieldA = a.updated_at
          fieldB = b.updated_at
      }

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortConfig.order === 'desc'
          ? fieldB.localeCompare(fieldA)
          : fieldA.localeCompare(fieldB)
      }

      return sortConfig.order === 'desc'
        ? (fieldB as number) - (fieldA as number)
        : (fieldA as number) - (fieldB as number)
    })
  }

  return {
    // State
    notes,
    currentNote,
    filter,
    sort,
    loading,
    error,
    // Getters
    filteredNotes,
    notesByCategory,
    pinnedNotes,
    recentNotes,
    // Actions
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    archiveNote,
    restoreNote,
    deleteNote,
    pinNote,
    unpinNote,
    searchNotes,
    setFilter,
    setSort,
    clearFilter,
    setCurrentNote
  }
})