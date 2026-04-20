import { computed, ref, onMounted } from 'vue'
import { useNoteStore } from '@/stores'
import type { Note, NoteCreateDTO, NoteUpdateDTO, NoteFilter, NoteSort } from '@/types'

/**
 * 笔记操作封装
 * 提供便捷的笔记CRUD和状态管理接口
 */
export function useNotes() {
  const noteStore = useNoteStore()

  // Local state for draft editing
  const isEditing = ref(false)
  const draftNote = ref<Partial<Note>>({})

  // Computed from store
  const notes = computed(() => noteStore.notes)
  const filteredNotes = computed(() => noteStore.filteredNotes)
  const pinnedNotes = computed(() => noteStore.pinnedNotes)
  const unpinnedNotes = computed(() => noteStore.unpinnedNotes)
  const currentNote = computed(() => noteStore.currentNote)
  const loading = computed(() => noteStore.loading)
  const error = computed(() => noteStore.error)
  const filter = computed(() => noteStore.filter)
  const sort = computed(() => noteStore.sort)
  const archivedCount = computed(() => noteStore.archivedCount)
  const totalActiveCount = computed(() => noteStore.totalActiveCount)

  // Actions wrappers
  async function fetchNotes() {
    await noteStore.fetchNotes()
  }

  async function fetchNoteById(id: string) {
    return await noteStore.fetchNoteById(id)
  }

  async function createNote(dto: NoteCreateDTO) {
    return await noteStore.createNote(dto)
  }

  async function updateNote(id: string, dto: NoteUpdateDTO) {
    return await noteStore.updateNote(id, dto)
  }

  async function archiveNote(id: string) {
    await noteStore.archiveNote(id)
  }

  async function restoreNote(id: string) {
    await noteStore.restoreNote(id)
  }

  async function pinNote(id: string) {
    await noteStore.pinNote(id)
  }

  async function unpinNote(id: string) {
    await noteStore.unpinNote(id)
  }

  async function deleteNote(id: string) {
    await noteStore.deleteNote(id)
  }

  async function bulkDeleteNotes(ids: string[]) {
    await noteStore.bulkDeleteNotes(ids)
  }

  async function bulkArchiveNotes(ids: string[]) {
    await noteStore.bulkArchiveNotes(ids)
  }

  async function searchNotes(keyword: string) {
    return await noteStore.searchNotes(keyword)
  }

  function setFilter(newFilter: Partial<NoteFilter>) {
    noteStore.setFilter(newFilter)
  }

  function setSort(newSort: Partial<NoteSort>) {
    noteStore.setSort(newSort)
  }

  function clearFilter() {
    noteStore.clearFilter()
  }

  function setCurrentNote(note: Note | null) {
    noteStore.setCurrentNote(note)
  }

  function clearCurrentNote() {
    noteStore.clearCurrentNote()
  }

  // Draft editing helpers
  function startEditing(note: Note) {
    isEditing.value = true
    draftNote.value = { ...note }
    setCurrentNote(note)
  }

  function cancelEditing() {
    isEditing.value = false
    draftNote.value = {}
    clearCurrentNote()
  }

  async function saveDraft() {
    if (!draftNote.value.id) {
      // Create new note
      const newNote = await createNote(draftNote.value as NoteCreateDTO)
      cancelEditing()
      return newNote
    } else {
      // Update existing note
      const updated = await updateNote(draftNote.value.id, draftNote.value as NoteUpdateDTO)
      cancelEditing()
      return updated
    }
  }

  function updateDraft(field: keyof Note, value: Note[keyof Note]) {
    draftNote.value[field] = value
  }

  // Check if a note is currently being saved
  function isSaving(id: string) {
    return noteStore.isSaving(id)
  }

  // Initialize notes on mount
  function initialize() {
    return noteStore.initialize()
  }

  // Auto-initialize on mount if needed
  onMounted(() => {
    if (notes.value.length === 0) {
      fetchNotes()
    }
  })

  return {
    // State
    notes,
    filteredNotes,
    pinnedNotes,
    unpinnedNotes,
    currentNote,
    loading,
    error,
    filter,
    sort,
    archivedCount,
    totalActiveCount,
    isEditing,
    draftNote,

    // Actions
    fetchNotes,
    fetchNoteById,
    createNote,
    updateNote,
    archiveNote,
    restoreNote,
    pinNote,
    unpinNote,
    deleteNote,
    bulkDeleteNotes,
    bulkArchiveNotes,
    searchNotes,
    setFilter,
    setSort,
    clearFilter,
    setCurrentNote,
    clearCurrentNote,
    isSaving,

    // Draft editing
    startEditing,
    cancelEditing,
    saveDraft,
    updateDraft,

    // Lifecycle
    initialize,
  }
}