<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNews } from '@/composables/useNews'
import { useResponsive } from '@/composables/useResponsive'
import NewsList from '@/components/business/news/NewsList.vue'
import NewsDetail from '@/components/business/news/NewsDetail.vue'
import NewsRefreshBtn from '@/components/business/news/NewsRefreshBtn.vue'
import FilterChip from '@/components/common/FilterChip.vue'
import type { NewsArticle } from '@/types/entities'

const router = useRouter()
const { isMobile } = useResponsive()
const { articles, filteredArticles, loading, hasMore, selectedCategory, fetchNews, refreshNews, setCategory, toggleFavorite } = useNews()

// State
const showDetail = ref(false)
const selectedArticle = ref<NewsArticle | null>(null)

// Categories
const categories = [
  { value: 'all', label: 'ALL' },
  { value: 'tech', label: 'TECH' },
  { value: 'finance', label: 'FINANCE' },
  { value: 'life', label: 'LIFE' },
  { value: 'world', label: 'WORLD' },
]

// Computed display category
const displayCategory = computed(() => selectedCategory.value || 'all')

// Handlers
function handleArticleClick(article: NewsArticle) {
  selectedArticle.value = article
  showDetail.value = true
}

function handleRefresh() {
  refreshNews()
}

function handleLoadMore() {
  fetchNews()
}

function handleCategoryChange(category: string) {
  if (category === 'all') {
    setCategory(null)
  } else {
    setCategory(category as 'tech' | 'finance' | 'life' | 'world')
  }
}

function handleBack() {
  showDetail.value = false
  selectedArticle.value = null
}

async function handleFavorite(article: NewsArticle) {
  await toggleFavorite(article.id)
}

function handleSaveToNote(article: NewsArticle) {
  router.push(`/notes/new?source=news&id=${article.id}`)
}

onMounted(() => {
  if (articles.value.length === 0) {
    fetchNews()
  }
})
</script>

<template>
  <div class="news-page px-6 md:px-12 max-w-7xl mx-auto">
    <!-- Refresh Button - Fixed position -->
    <NewsRefreshBtn
      :loading="loading"
      :class="isMobile ? 'top-[96px]' : 'top-[96px]'"
      @click="handleRefresh"
    />

    <!-- Page Header -->
    <header class="mb-8">
      <span class="bg-secondary-container text-white px-4 py-1 font-headline font-bold text-sm mb-4 inline-block border-2 border-white uppercase">
        Daily Curation
      </span>
      <h1 class="font-headline font-black text-4xl md:text-6xl text-white uppercase tracking-tighter -skew-x-2">
        NEWS<br /><span class="text-primary-container">FEED</span>
      </h1>
    </header>

    <!-- Category Filter -->
    <section class="mb-8 flex flex-wrap gap-2">
      <FilterChip
        v-for="cat in categories"
        :key="cat.value"
        :label="cat.label"
        :active="displayCategory === cat.value"
        @click="handleCategoryChange(cat.value)"
      />
    </section>

    <!-- News List -->
    <NewsList
      :articles="filteredArticles"
      :loading="loading"
      :has-more="hasMore"
      @article-click="handleArticleClick"
      @refresh="handleRefresh"
      @load-more="handleLoadMore"
    />

    <!-- News Detail (overlay) -->
    <NewsDetail
      v-if="showDetail && selectedArticle"
      :article="selectedArticle"
      @back="handleBack"
      @favorite="handleFavorite"
      @save-to-note="handleSaveToNote"
    />
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>