import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { NewsArticle, NewsCreateDTO } from '@/types'
import { newsRepo } from '@/repositories'

export const useNewsStore = defineStore('news', () => {
  // ========== State ==========
  const articles = ref<NewsArticle[]>([])
  const currentArticle = ref<NewsArticle | null>(null)
  const loading = ref(false)
  const refreshing = ref(false)
  const error = ref<string | null>(null)
  const page = ref(1)
  const pageSize = 10
  const hasMore = ref(true)
  const selectedCategory = ref<string | null>(null)

  // ========== Getters ==========
  const filteredArticles = computed(() => {
    if (!selectedCategory.value) {
      return articles.value
    }
    return articles.value.filter(a => a.category === selectedCategory.value)
  })

  const favoriteArticles = computed(() =>
    articles.value.filter(a => a.is_saved)
  )

  const unreadCount = computed(() =>
    articles.value.filter(a => !a.is_read).length
  )

  const savedCount = computed(() =>
    articles.value.filter(a => a.is_saved).length
  )

  const latestArticles = computed(() =>
    articles.value
      .sort((a, b) => b.published_at - a.published_at)
      .slice(0, 5)
  )

  // ========== Actions ==========
  async function fetchNews(pageNum: number = 1) {
    loading.value = true
    error.value = null
    try {
      const allArticles = await newsRepo.findLatest(pageNum * pageSize)

      if (pageNum === 1) {
        articles.value = allArticles
      } else {
        articles.value.push(...allArticles.slice(articles.value.length))
      }

      page.value = pageNum
      hasMore.value = allArticles.length >= pageNum * pageSize
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取新闻失败'
      await loadFromCache()
    } finally {
      loading.value = false
    }
  }

  async function refreshNews() {
    refreshing.value = true
    error.value = null
    page.value = 1
    articles.value = []
    hasMore.value = true
    try {
      await fetchNews(1)
    } finally {
      refreshing.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || loading.value) return
    await fetchNews(page.value + 1)
  }

  async function loadFromCache() {
    loading.value = true
    try {
      const cached = await newsRepo.findLatest(pageSize)
      articles.value = cached
    } catch (e) {
      error.value = '离线模式下无法加载新闻'
    } finally {
      loading.value = false
    }
  }

  async function toggleFavorite(id: string) {
    const article = articles.value.find(a => a.id === id)
    if (!article) return

    try {
      if (article.is_saved) {
        await newsRepo.unsaveFromNote(id)
        article.is_saved = false
        article.saved_at = undefined
      } else {
        await newsRepo.saveToNote(id)
        article.is_saved = true
        article.saved_at = Date.now()
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '收藏操作失败'
      throw e
    }
  }

  async function markAsRead(id: string) {
    const article = articles.value.find(a => a.id === id)
    if (!article || article.is_read) return

    try {
      await newsRepo.markAsRead(id)
      article.is_read = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : '标记已读失败'
      throw e
    }
  }

  async function bulkMarkAsRead(ids: string[]) {
    try {
      await newsRepo.bulkMarkAsRead(ids)
      for (const id of ids) {
        const article = articles.value.find(a => a.id === id)
        if (article) {
          article.is_read = true
        }
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : '批量标记已读失败'
      throw e
    }
  }

  function setCategory(category: string | null) {
    selectedCategory.value = category
  }

  function setCurrentArticle(article: NewsArticle) {
    currentArticle.value = article
    if (!article.is_read) {
      markAsRead(article.id)
    }
  }

  async function saveNewsToNote(article: NewsArticle): Promise<NewsArticle> {
    loading.value = true
    error.value = null
    try {
      const savedArticle = await newsRepo.create({
        title: article.title,
        content: article.content,
        summary: article.summary,
        source: article.source,
        author: article.author,
        url: article.url,
        image_url: article.image_url,
        published_at: article.published_at,
        category: article.category
      })
      return savedArticle
    } catch (e) {
      error.value = e instanceof Error ? e.message : '保存新闻失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function searchNews(keyword: string) {
    loading.value = true
    error.value = null
    try {
      const results = await newsRepo.searchByKeyword(keyword)
      return results
    } catch (e) {
      error.value = e instanceof Error ? e.message : '搜索新闻失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function clearExpiredCache() {
    try {
      const maxAge = 30 * 60 * 1000 // 30 minutes
      const count = await newsRepo.cleanExpiredCache(maxAge)
      return count
    } catch (e) {
      console.error('清理缓存失败:', e)
      return 0
    }
  }

  async function getCacheStats() {
    return newsRepo.getCacheStats()
  }

  async function initialize() {
    await fetchNews(1)
    await clearExpiredCache()
  }

  return {
    // State
    articles,
    currentArticle,
    loading,
    refreshing,
    error,
    page,
    hasMore,
    selectedCategory,
    // Getters
    filteredArticles,
    favoriteArticles,
    unreadCount,
    savedCount,
    latestArticles,
    // Actions
    fetchNews,
    refreshNews,
    loadMore,
    loadFromCache,
    toggleFavorite,
    markAsRead,
    bulkMarkAsRead,
    setCategory,
    setCurrentArticle,
    saveNewsToNote,
    searchNews,
    clearExpiredCache,
    getCacheStats,
    initialize
  }
})