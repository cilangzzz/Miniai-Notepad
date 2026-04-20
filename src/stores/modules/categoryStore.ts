import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, CategoryCreateDTO, CategoryUpdateDTO, Tag, TagCreateDTO, TagUpdateDTO } from '@/types'
import { categoryRepo, tagRepo } from '@/repositories'

export const useCategoryStore = defineStore('category', () => {
  // ========== State ==========
  const categories = ref<Category[]>([])
  const tags = ref<Tag[]>([])
  const activeCategory = ref<string | null>(null)
  const selectedTags = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // ========== Getters ==========
  const categoryOptions = computed(() =>
    categories.value
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        color: c.color,
        icon: c.icon,
        note_count: c.note_count,
        is_preset: c.is_preset
      }))
  )

  const presetCategories = computed(() =>
    categories.value.filter(c => c.is_preset).sort((a, b) => a.sort_order - b.sort_order)
  )

  const customCategories = computed(() =>
    categories.value.filter(c => !c.is_preset).sort((a, b) => a.sort_order - b.sort_order)
  )

  const tagCloud = computed(() =>
    tags.value
      .sort((a, b) => b.usage_count - a.usage_count)
      .slice(0, 20)
      .map(t => ({
        id: t.id,
        name: t.name,
        color: t.color,
        rotation: t.rotation,
        usage_count: t.usage_count
      }))
  )

  const popularTags = computed(() =>
    tags.value.sort((a, b) => b.usage_count - a.usage_count)
  )

  const activeCategoryInfo = computed(() =>
    categories.value.find(c => c.id === activeCategory.value)
  )

  // ========== Actions ==========
  async function loadCategories() {
    loading.value = true
    error.value = null
    try {
      categories.value = await categoryRepo.findAllSorted()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载分类失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function loadTags() {
    loading.value = true
    error.value = null
    try {
      tags.value = await tagRepo.findAllSortedByUsage()
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载标签失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data: CategoryCreateDTO) {
    loading.value = true
    error.value = null
    try {
      const newCategory = await categoryRepo.create(data)
      categories.value.push(newCategory)
      categories.value.sort((a, b) => a.sort_order - b.sort_order)
      return newCategory
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建分类失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id: string, data: CategoryUpdateDTO) {
    loading.value = true
    error.value = null
    try {
      const updated = await categoryRepo.update(id, data)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新分类失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: string) {
    loading.value = true
    error.value = null
    try {
      const category = categories.value.find(c => c.id === id)
      if (category?.is_preset) {
        throw new Error('预设分类不可删除')
      }
      await categoryRepo.delete(id)
      categories.value = categories.value.filter(c => c.id !== id)
      if (activeCategory.value === id) {
        activeCategory.value = null
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除分类失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function createTag(data: TagCreateDTO) {
    loading.value = true
    error.value = null
    try {
      const existingTag = await tagRepo.findByName(data.name)
      if (existingTag) {
        return existingTag
      }
      const newTag = await tagRepo.create({
        ...data,
        rotation: data.rotation ?? (Math.random() * 6 - 3),
        color: data.color ?? 'yellow'
      })
      tags.value.push(newTag)
      return newTag
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建标签失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateTag(id: string, data: TagUpdateDTO) {
    loading.value = true
    error.value = null
    try {
      const updated = await tagRepo.update(id, data)
      const index = tags.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tags.value[index] = updated
      }
      return updated
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新标签失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteTag(id: string) {
    loading.value = true
    error.value = null
    try {
      await tagRepo.delete(id)
      tags.value = tags.value.filter(t => t.id !== id)
      selectedTags.value = selectedTags.value.filter(tId => tId !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '删除标签失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  function selectCategory(categoryId: string | null) {
    activeCategory.value = categoryId
  }

  function toggleTag(tagId: string) {
    const index = selectedTags.value.indexOf(tagId)
    if (index === -1) {
      selectedTags.value.push(tagId)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  function setSelectedTags(tagIds: string[]) {
    selectedTags.value = tagIds
  }

  function clearSelection() {
    activeCategory.value = null
    selectedTags.value = []
  }

  async function searchTags(keyword: string) {
    loading.value = true
    error.value = null
    try {
      const results = await tagRepo.searchByName(keyword)
      return results
    } catch (e) {
      error.value = e instanceof Error ? e.message : '搜索标签失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function findOrCreateTag(name: string): Promise<Tag> {
    const existing = await tagRepo.findByName(name)
    if (existing) {
      await tagRepo.incrementUsageCount(existing.id)
      return existing
    }
    return createTag({ name })
  }

  async function initialize() {
    await Promise.all([loadCategories(), loadTags()])
  }

  return {
    // State
    categories,
    tags,
    activeCategory,
    selectedTags,
    loading,
    error,
    // Getters
    categoryOptions,
    presetCategories,
    customCategories,
    tagCloud,
    popularTags,
    activeCategoryInfo,
    // Actions
    loadCategories,
    loadTags,
    createCategory,
    updateCategory,
    deleteCategory,
    createTag,
    updateTag,
    deleteTag,
    selectCategory,
    toggleTag,
    setSelectedTags,
    clearSelection,
    searchTags,
    findOrCreateTag,
    initialize
  }
})