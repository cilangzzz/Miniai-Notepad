<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import NewsCard from './NewsCard.vue'
import BaseLoading from '@/components/base/BaseLoading.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import type { NewsArticle } from '@/types/entities'

interface Props {
  articles?: NewsArticle[]
  loading?: boolean
  hasMore?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  articles: [],
  loading: false,
  hasMore: false,
})

const emit = defineEmits<{
  articleClick: [article: NewsArticle]
  refresh: []
  loadMore: []
}>()

const loadMoreTrigger = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const gridClass = computed(() => ({
  'grid-cols-1': true,
  'md:grid-cols-2': true,
  'lg:grid-cols-3': true,
  'gap-6': true,
}))

// Featured article logic (first article is large)
const featuredArticle = computed(() => props.articles[0])
const regularArticles = computed(() => props.articles.slice(1))

const getCardSize = (article: NewsArticle): 'normal' | 'large' => {
  if (featuredArticle.value && article.id === featuredArticle.value.id) {
    return 'large'
  }
  return 'normal'
}

// Infinite scroll observer
const observe = () => {
  if (!loadMoreTrigger.value) return

  observer.value = new IntersectionObserver(
    async (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && props.hasMore && !props.loading) {
        emit('loadMore')
      }
    },
    { rootMargin: '100px', threshold: 0 }
  )

  observer.value.observe(loadMoreTrigger.value)
}

onMounted(() => {
  if (props.articles.length === 0 && !props.loading) {
    emit('refresh')
  }
  observe()
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<template>
  <div class="news-list-container">
    <!-- News grid -->
    <div v-if="!loading && articles.length > 0" :class="['news-grid grid p-4', gridClass]">
      <!-- Featured card (first article) -->
      <NewsCard
        v-if="featuredArticle"
        :article="featuredArticle"
        :size="getCardSize(featuredArticle)"
        :featured="true"
        @click="emit('articleClick', featuredArticle)"
      />

      <!-- Regular cards -->
      <NewsCard
        v-for="article in regularArticles"
        :key="article.id"
        :article="article"
        :size="getCardSize(article)"
        @click="emit('articleClick', article)"
      />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-12">
      <BaseLoading size="lg" color="gold" />
    </div>

    <!-- Empty state -->
    <EmptyState
      v-if="!loading && articles.length === 0"
      title="NO NEWS AVAILABLE"
      description="Pull to refresh or check your connection"
      icon="newspaper"
      action-label="REFRESH"
      @action="emit('refresh')"
    />

    <!-- Load more trigger -->
    <div ref="loadMoreTrigger" class="load-more-trigger h-10 flex items-center justify-center">
      <span v-if="!hasMore && articles.length > 0" class="font-headline text-xs text-white/50 uppercase">
        NO MORE NEWS
      </span>
      <span v-if="hasMore && !loading" class="font-headline text-xs text-white/50 uppercase">
        LOAD MORE...
      </span>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.news-list-container {
  min-height: 100vh;
  padding-top: 80px;
  padding-bottom: 60px;
}
</style>