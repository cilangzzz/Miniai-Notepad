import { computed, onMounted } from 'vue'
import { useNewsStore } from '@/stores'
import type { NewsArticle } from '@/types'

/**
 * 新闻数据操作封装
 * 提供便捷的新闻获取、缓存和状态管理接口
 */
export function useNews() {
  const newsStore = useNewsStore()

  // Computed from store
  const articles = computed(() => newsStore.articles)
  const currentArticle = computed(() => newsStore.currentArticle)
  const filteredArticles = computed(() => newsStore.filteredArticles)
  const favoriteArticles = computed(() => newsStore.favoriteArticles)
  const loading = computed(() => newsStore.loading)
  const refreshing = computed(() => newsStore.refreshing)
  const error = computed(() => newsStore.error)
  const page = computed(() => newsStore.page)
  const hasMore = computed(() => newsStore.hasMore)
  const selectedCategory = computed(() => newsStore.selectedCategory)

  // Additional computed
  const unreadCount = computed(() => newsStore.unreadCount)
  const savedCount = computed(() => newsStore.savedCount)
  const latestArticles = computed(() => newsStore.latestArticles)

  // Actions
  async function fetchNews(pageNum: number = 1) {
    await newsStore.fetchNews(pageNum)
  }

  async function refreshNews() {
    await newsStore.refreshNews()
  }

  async function loadMore() {
    await newsStore.loadMore()
  }

  async function loadFromCache() {
    await newsStore.loadFromCache()
  }

  async function toggleFavorite(id: string) {
    await newsStore.toggleFavorite(id)
  }

  async function markAsRead(id: string) {
    await newsStore.markAsRead(id)
  }

  async function bulkMarkAsRead(ids: string[]) {
    await newsStore.bulkMarkAsRead(ids)
  }

  function setCategory(category: string | null) {
    newsStore.setCategory(category)
  }

  function setCurrentArticle(article: NewsArticle) {
    newsStore.setCurrentArticle(article)
  }

  async function saveNewsToNote(article: NewsArticle) {
    return await newsStore.saveNewsToNote(article)
  }

  async function searchNews(keyword: string) {
    return await newsStore.searchNews(keyword)
  }

  async function clearExpiredCache() {
    return await newsStore.clearExpiredCache()
  }

  async function getCacheStats() {
    return await newsStore.getCacheStats()
  }

  // Helper functions
  function getArticleById(id: string): NewsArticle | undefined {
    return articles.value.find(a => a.id === id)
  }

  function isArticleFavorite(id: string): boolean {
    const article = getArticleById(id)
    return article?.is_saved ?? false
  }

  function isArticleRead(id: string): boolean {
    const article = getArticleById(id)
    return article?.is_read ?? false
  }

  function getArticlesByCategory(category: string): NewsArticle[] {
    return articles.value.filter(a => a.category === category)
  }

  // Initialize on mount
  function initialize() {
    return newsStore.initialize()
  }

  onMounted(() => {
    if (articles.value.length === 0) {
      fetchNews()
    }
  })

  return {
    // State
    articles,
    currentArticle,
    filteredArticles,
    favoriteArticles,
    loading,
    refreshing,
    error,
    page,
    hasMore,
    selectedCategory,

    // Computed
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

    // Helpers
    getArticleById,
    isArticleFavorite,
    isArticleRead,
    getArticlesByCategory,

    // Lifecycle
    initialize,
  }
}