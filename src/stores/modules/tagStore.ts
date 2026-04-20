import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tag, TagCreateDTO, TagUpdateDTO } from '@/types'
import { tagRepo } from '@/repositories'

/**
 * 标签Store
 * 管理标签的CRUD、使用次数追踪、搜索等功能
 */
export const useTagStore = defineStore('tag', () => {
  // ========== State ==========

  /** 所有标签列表 */
  const tags = ref<Tag[]>([])

  /** 当前选中的标签ID列表 */
  const selectedTags = ref<string[]>([])

  /** 加载状态 */
  const loading = ref(false)

  /** 错误信息 */
  const error = ref<string | null>(null)

  /** 搜索关键词 */
  const searchKeyword = ref('')

  // ========== Computed ==========

  /**
   * 按使用次数排序的标签列表
   */
  const popularTags = computed(() => {
    return [...tags.value]
      .filter(tag => !tag.is_deleted)
      .sort((a, b) => b.usage_count - a.usage_count)
  })

  /**
   * 标签云（前20个最热门标签）
   */
  const tagCloud = computed(() => {
    return popularTags.value.slice(0, 20)
  })

  /**
   * 根据搜索关键词筛选的标签
   */
  const filteredTags = computed(() => {
    if (!searchKeyword.value) {
      return tags.value.filter(tag => !tag.is_deleted)
    }

    const keyword = searchKeyword.value.toLowerCase()
    return tags.value.filter(tag =>
      !tag.is_deleted && tag.name.toLowerCase().includes(keyword)
    )
  })

  /**
   * 选中标签的详情列表
   */
  const selectedTagDetails = computed(() => {
    return tags.value.filter(tag => selectedTags.value.includes(tag.id))
  })

  /**
   * 总标签数量
   */
  const totalTagCount = computed(() => {
    return tags.value.filter(tag => !tag.is_deleted).length
  })

  /**
   * 已使用标签数量（usage_count > 0）
   */
  const usedTagCount = computed(() => {
    return tags.value.filter(tag => !tag.is_deleted && tag.usage_count > 0).length
  })

  // ========== Actions ==========

  /**
   * 加载所有标签
   */
  async function fetchTags(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      tags.value = await tagRepo.findAllSortedByUsage()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load tags'
      console.error('Error fetching tags:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据ID获取单个标签
   */
  async function fetchTagById(id: string): Promise<Tag | null> {
    loading.value = true
    error.value = null

    try {
      const tag = await tagRepo.findById(id)
      return tag
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load tag'
      console.error('Error fetching tag:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建新标签
   */
  async function createTag(dto: TagCreateDTO): Promise<Tag> {
    loading.value = true
    error.value = null

    try {
      // 检查是否已存在同名标签
      const existing = await tagRepo.findByName(dto.name)
      if (existing) {
        return existing
      }

      // 创建新标签，自动生成随机旋转角度
      const newTag = await tagRepo.create({
        ...dto,
        rotation: dto.rotation ?? (Math.random() * 6 - 3),
        color: dto.color ?? 'yellow',
      })

      // 添加到列表
      tags.value.push(newTag)

      return newTag
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create tag'
      console.error('Error creating tag:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新标签
   */
  async function updateTag(id: string, dto: TagUpdateDTO): Promise<Tag> {
    loading.value = true
    error.value = null

    try {
      const updatedTag = await tagRepo.update(id, dto)

      // 更新列表中的标签
      const index = tags.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tags.value[index] = updatedTag
      }

      return updatedTag
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update tag'
      console.error('Error updating tag:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除标签（软删除）
   */
  async function deleteTag(id: string): Promise<void> {
    loading.value = true
    error.value = null

    try {
      await tagRepo.delete(id)

      // 从列表移除
      tags.value = tags.value.filter(t => t.id !== id)

      // 从选中列表移除
      selectedTags.value = selectedTags.value.filter(tagId => tagId !== id)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete tag'
      console.error('Error deleting tag:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 批量创建标签（跳过已存在的）
   */
  async function bulkCreateTags(names: string[]): Promise<Tag[]> {
    loading.value = true
    error.value = null

    try {
      const results: Tag[] = []
      for (const name of names) {
        const tag = await createTag({ name })
        results.push(tag)
      }
      return results
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create tags'
      console.error('Error bulk creating tags:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 增加标签使用次数
   */
  async function incrementTagUsage(id: string): Promise<void> {
    try {
      await tagRepo.incrementUsageCount(id)

      // 更新本地状态
      const tag = tags.value.find(t => t.id === id)
      if (tag) {
        tag.usage_count++
      }
    } catch (e) {
      console.error('Error incrementing tag usage:', e)
    }
  }

  /**
   * 减少标签使用次数
   */
  async function decrementTagUsage(id: string): Promise<void> {
    try {
      await tagRepo.decrementUsageCount(id)

      // 更新本地状态
      const tag = tags.value.find(t => t.id === id)
      if (tag && tag.usage_count > 0) {
        tag.usage_count--
      }
    } catch (e) {
      console.error('Error decrementing tag usage:', e)
    }
  }

  /**
   * 搜索标签
   */
  async function searchTags(keyword: string): Promise<Tag[]> {
    loading.value = true
    error.value = null

    try {
      const results = await tagRepo.searchByName(keyword)
      return results
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to search tags'
      console.error('Error searching tags:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * 查找或创建标签
   */
  async function findOrCreateTag(name: string): Promise<Tag> {
    const existing = await tagRepo.findByName(name)
    if (existing) {
      await incrementTagUsage(existing.id)
      return existing
    }
    return createTag({ name })
  }

  /**
   * 选择/取消选择标签
   */
  function toggleTagSelection(id: string): void {
    const index = selectedTags.value.indexOf(id)
    if (index === -1) {
      selectedTags.value.push(id)
    } else {
      selectedTags.value.splice(index, 1)
    }
  }

  /**
   * 设置选中的标签
   */
  function setSelectedTags(ids: string[]): void {
    selectedTags.value = ids
  }

  /**
   * 清空选中标签
   */
  function clearSelectedTags(): void {
    selectedTags.value = []
  }

  /**
   * 设置搜索关键词
   */
  function setSearchKeyword(keyword: string): void {
    searchKeyword.value = keyword
  }

  /**
   * 清空搜索关键词
   */
  function clearSearchKeyword(): void {
    searchKeyword.value = ''
  }

  /**
   * 刷新标签数据
   */
  async function refresh(): Promise<void> {
    await fetchTags()
  }

  /**
   * 初始化Store
   */
  async function initialize(): Promise<void> {
    await fetchTags()
  }

  // ========== Return ==========

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
    refresh,
    initialize,
  }
})