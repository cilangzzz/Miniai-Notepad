<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNews } from '@/composables/useNews'
import NewsList from '@/components/business/news/NewsList.vue'
import NewsDetail from '@/components/business/news/NewsDetail.vue'
import NewsRefreshBtn from '@/components/business/news/NewsRefreshBtn.vue'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'
import FilterChip from '@/components/common/FilterChip.vue'
import type { NewsArticle } from '@/types/entities'

const router = useRouter()
const { articles, loading, hasMore, selectedCategory, fetchNews, refreshNews, setCategory, toggleFavorite } = useNews()

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
  setCategory(category as 'all' | 'tech' | 'finance' | 'life' | 'world')
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

function handleMenuClick() {}

const currentNav = 'news'

onMounted(() => {
  if (articles.value.length === 0) {
    fetchNews()
  }
})
</script>

<template>
  <div class="news-page min-h-screen bg-background">
    <!-- Top App Bar -->
    <TopAppBar @menu-click="handleMenuClick" />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="true" />

    <!-- Refresh Button -->
    <NewsRefreshBtn :loading="loading" @click="handleRefresh" />

    <!-- Main Content -->
    <main class="pt-[72px] pb-[80px] px-4 md:px-12 md:ml-[288px]">
      <!-- Page Header -->
      <header class="mb-8">
        <h1 class="font-headline font-black text-4xl md:text-5xl text-primary uppercase tracking-tighter -skew-x-2">
          NEWS
        </h1>
        <p class="font-headline font-bold text-sm text-white/60 uppercase mt-2">
          DAILY INFORMATION CURATION
        </p>
      </header>

      <!-- Category Filter -->
      <section class="mb-8 flex gap-2">
        <FilterChip
          v-for="cat in categories"
          :key="cat.value"
          :label="cat.label"
          :active="selectedCategory === cat.value"
          @click="handleCategoryChange(cat.value)"
        />
      </section>

      <!-- News List -->
      <NewsList
        :articles="articles"
        :loading="loading"
        :has-more="hasMore"
        @article-click="handleArticleClick"
        @refresh="handleRefresh"
        @load-more="handleLoadMore"
      />
    </main>

    <!-- News Detail (overlay) -->
    <NewsDetail
      v-if="showDetail && selectedArticle"
      :article="selectedArticle"
      @back="handleBack"
      @favorite="handleFavorite"
      @save-to-note="handleSaveToNote"
    />

    <!-- Mobile Bottom Navigation -->
    <BottomNavBar
      :active-id="currentNav"
      @navigate="(route) => router.push(route)"
    />
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>