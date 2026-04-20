import { computed, onMounted } from 'vue'
import { useTagStore } from '@/stores'
import type { Tag, TagCreateDTO, TagUpdateDTO } from '@/types'

/**
 * 标签操作封装
 * 提供便捷的标签CRUD和状态管理接口
 */
export function useTags() {
  const tagStore = useTagStore()

  // Computed from store
  const tags = computed(() => tagStore.tags)
  const selectedTags = computed(() => tagStore.selectedTags)
  const loading = computed(() => tagStore.loading)
  const error = computed(() => tagStore.error)
  const searchKeyword = computed(() => tagStore.searchKeyword)

  // Computed helpers
  const popularTags = computed(() => tagStore.popularTags)
  const tagCloud = computed(() => tagStore.tagCloud)
  const filteredTags = computed(() => tagStore.filteredTags)
  const selectedTagDetails = computed(() => tagStore.selectedTagDetails)
  const totalTagCount = computed(() => tagStore.totalTagCount)
  const usedTagCount = computed(() => tagStore.usedTagCount)

  // Actions
  async function fetchTags() {
    await tagStore.fetchTags()
  }

  async function fetchTagById(id: string) {
    return await tagStore.fetchTagById(id)
  }

  async function createTag(dto: TagCreateDTO) {
    return await tagStore.createTag(dto)
  }

  async function updateTag(id: string, dto: TagUpdateDTO) {
    return await tagStore.updateTag(id, dto)
  }

  async function deleteTag(id: string) {
    await tagStore.deleteTag(id)
  }

  async function bulkCreateTags(names: string[]) {
    return await tagStore.bulkCreateTags(names)
  }

  async function incrementTagUsage(id: string) {
    await tagStore.incrementTagUsage(id)
  }

  async function decrementTagUsage(id: string) {
    await tagStore.decrementTagUsage(id)
  }

  async function searchTags(keyword: string) {
    return await tagStore.searchTags(keyword)
  }

  async function findOrCreateTag(name: string): Promise<Tag> {
    return await tagStore.findOrCreateTag(name)
  }

  function toggleTagSelection(id: string) {
    tagStore.toggleTagSelection(id)
  }

  function setSelectedTags(ids: string[]) {
    tagStore.setSelectedTags(ids)
  }

  function clearSelectedTags() {
    tagStore.clearSelectedTags()
  }

  function setSearchKeyword(keyword: string) {
    tagStore.setSearchKeyword(keyword)
  }

  function clearSearchKeyword() {
    tagStore.clearSearchKeyword()
  }

  // Helper functions
  function getTagById(id: string): Tag | undefined {
    return tags.value.find(t => t.id === id)
  }

  function getTagByName(name: string): Tag | undefined {
    return tags.value.find(t => t.name === name)
  }

  function isTagSelected(tagId: string): boolean {
    return selectedTags.value.includes(tagId)
  }

  function getTagsByIds(ids: string[]): Tag[] {
    return tags.value.filter(t => ids.includes(t.id))
  }

  function getTagNamesByIds(ids: string[]): string[] {
    return getTagsByIds(ids).map(t => t.name)
  }

  // Get tags sorted by usage count
  function getTopTags(limit: number = 10): Tag[] {
    return popularTags.value.slice(0, limit)
  }

  // Initialize on mount
  function initialize() {
    return tagStore.initialize()
  }

  onMounted(() => {
    if (tags.value.length === 0) {
      fetchTags()
    }
  })

  return {
    // State
    tags,
    selectedTags,
    loading,
    error,
    searchKeyword,

    // Computed
    popularTags,
    tagCloud,
    filteredTags,
    selectedTagDetails,
    totalTagCount,
    usedTagCount,

    // Actions
    fetchTags,
    fetchTagById,
    createTag,
    updateTag,
    deleteTag,
    bulkCreateTags,
    incrementTagUsage,
    decrementTagUsage,
    searchTags,
    findOrCreateTag,
    toggleTagSelection,
    setSelectedTags,
    clearSelectedTags,
    setSearchKeyword,
    clearSearchKeyword,

    // Helpers
    getTagById,
    getTagByName,
    isTagSelected,
    getTagsByIds,
    getTagNamesByIds,
    getTopTags,

    // Lifecycle
    initialize,
  }
}