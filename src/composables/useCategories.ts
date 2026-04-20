import { computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores'
import type { Category, CategoryCreateDTO, CategoryUpdateDTO, Tag, TagCreateDTO, TagUpdateDTO } from '@/types'

/**
 * 分类和标签操作封装
 * 提供便捷的分类/标签CRUD和状态管理接口
 */
export function useCategories() {
  const categoryStore = useCategoryStore()

  // Computed from store
  const categories = computed(() => categoryStore.categories)
  const tags = computed(() => categoryStore.tags)
  const activeCategory = computed(() => categoryStore.activeCategory)
  const selectedTags = computed(() => categoryStore.selectedTags)
  const loading = computed(() => categoryStore.loading)
  const error = computed(() => categoryStore.error)

  // Category computed helpers
  const categoryOptions = computed(() => categoryStore.categoryOptions)
  const presetCategories = computed(() => categoryStore.presetCategories)
  const customCategories = computed(() => categoryStore.customCategories)
  const activeCategoryInfo = computed(() => categoryStore.activeCategoryInfo)

  // Tag computed helpers
  const tagCloud = computed(() => categoryStore.tagCloud)
  const popularTags = computed(() => categoryStore.popularTags)

  // Category actions
  async function loadCategories() {
    await categoryStore.loadCategories()
  }

  async function createCategory(dto: CategoryCreateDTO) {
    return await categoryStore.createCategory(dto)
  }

  async function updateCategory(id: string, dto: CategoryUpdateDTO) {
    return await categoryStore.updateCategory(id, dto)
  }

  async function deleteCategory(id: string) {
    await categoryStore.deleteCategory(id)
  }

  function selectCategory(categoryId: string | null) {
    categoryStore.selectCategory(categoryId)
  }

  // Tag actions
  async function loadTags() {
    await categoryStore.loadTags()
  }

  async function createTag(dto: TagCreateDTO) {
    return await categoryStore.createTag(dto)
  }

  async function updateTag(id: string, dto: TagUpdateDTO) {
    return await categoryStore.updateTag(id, dto)
  }

  async function deleteTag(id: string) {
    await categoryStore.deleteTag(id)
  }

  async function searchTags(keyword: string) {
    return await categoryStore.searchTags(keyword)
  }

  async function findOrCreateTag(name: string): Promise<Tag> {
    return await categoryStore.findOrCreateTag(name)
  }

  function toggleTag(tagId: string) {
    categoryStore.toggleTag(tagId)
  }

  function setSelectedTags(tagIds: string[]) {
    categoryStore.setSelectedTags(tagIds)
  }

  function clearSelection() {
    categoryStore.clearSelection()
  }

  // Get category by ID
  function getCategoryById(id: string): Category | undefined {
    return categories.value.find(c => c.id === id)
  }

  // Get category by slug
  function getCategoryBySlug(slug: string): Category | undefined {
    return categories.value.find(c => c.slug === slug)
  }

  // Get tag by ID
  function getTagById(id: string): Tag | undefined {
    return tags.value.find(t => t.id === id)
  }

  // Get tag by name
  function getTagByName(name: string): Tag | undefined {
    return tags.value.find(t => t.name === name)
  }

  // Check if category is active
  function isCategoryActive(categoryId: string): boolean {
    return activeCategory.value === categoryId
  }

  // Check if tag is selected
  function isTagSelected(tagId: string): boolean {
    return selectedTags.value.includes(tagId)
  }

  // Initialize on mount
  function initialize() {
    return categoryStore.initialize()
  }

  onMounted(() => {
    if (categories.value.length === 0 || tags.value.length === 0) {
      initialize()
    }
  })

  return {
    // State
    categories,
    tags,
    activeCategory,
    selectedTags,
    loading,
    error,

    // Computed
    categoryOptions,
    presetCategories,
    customCategories,
    activeCategoryInfo,
    tagCloud,
    popularTags,

    // Category actions
    loadCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategory,

    // Tag actions
    loadTags,
    createTag,
    updateTag,
    deleteTag,
    searchTags,
    findOrCreateTag,
    toggleTag,
    setSelectedTags,
    clearSelection,

    // Helpers
    getCategoryById,
    getCategoryBySlug,
    getTagById,
    getTagByName,
    isCategoryActive,
    isTagSelected,

    // Lifecycle
    initialize,
  }
}