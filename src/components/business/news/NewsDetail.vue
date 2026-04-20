<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseTag from '@/components/base/BaseTag.vue'
import type { NewsArticle, CardColor } from '@/types/entities'

interface Props {
  article: NewsArticle
}

const props = defineProps<Props>()

const emit = defineEmits<{
  back: []
  favorite: [article: NewsArticle]
  saveToNote: [article: NewsArticle]
}>()

const isFavorited = computed(() => props.article.is_favorite)

const formattedPublishTime = computed(() => {
  const date = new Date(props.article.published_at)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
})

const categoryColor = computed(() => {
  const colorMap: Record<string, CardColor> = {
    tech: 'yellow',
    finance: 'cyan',
    life: 'white',
    world: 'gray',
    entertainment: 'yellow',
  }
  return colorMap[props.article.category] || 'yellow'
})

const sanitizeHtml = (html: string): string => {
  // Basic sanitization - production should use DOMPurify
  const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form']
  let sanitized = html

  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gi')
    sanitized = sanitized.replace(regex, '')
  })

  return sanitized
}

const sanitizedContent = computed(() => sanitizeHtml(props.article.content))

function handleBack() {
  emit('back')
}

function handleFavorite() {
  emit('favorite', props.article)
}

function handleSaveToNote() {
  emit('saveToNote', props.article)
}
</script>

<template>
  <div class="news-detail-container min-h-screen flex flex-col">
    <!-- Header -->
    <header class="detail-header fixed top-0 left-0 right-0 h-60 bg-background border-b-4 border-white flex items-center justify-between px-16 z-100">
      <!-- Back button -->
      <button
        type="button"
        class="flex items-center gap-2 bg-transparent border-none text-white font-headline font-bold text-sm uppercase cursor-pointer hover:-translate-x-1 transition-transform"
        @click="handleBack"
      >
        <span class="material-symbols-outlined">arrow_back</span>
        <span>BACK</span>
      </button>

      <!-- Favorite button -->
      <BaseButton
        :variant="isFavorited ? 'secondary' : 'primary'"
        size="sm"
        :icon="isFavorited ? 'favorite' : 'favorite_border'"
        @click="handleFavorite"
      >
        {{ isFavorited ? 'FAVORITED' : 'FAVORITE' }}
      </BaseButton>
    </header>

    <!-- Content -->
    <article class="detail-content flex-1 px-16 pt-80 pb-100 max-w-800 mx-auto w-full">
      <!-- Cover image -->
      <div v-if="article.cover_image" class="detail-cover w-full h-300 overflow-hidden border-4 border-white shadow-[8px_8px_0_rgba(255,255,255,0.1)]">
        <img :src="article.cover_image" :alt="article.title" class="w-full h-full object-cover" />
      </div>

      <!-- Title -->
      <h1 class="detail-title font-headline font-bold text-3xl text-white m-0 mt-24 mb-16">
        {{ article.title }}
      </h1>

      <!-- Meta info -->
      <div class="detail-meta flex items-center gap-3 mb-24">
        <BaseTag :color="categoryColor" :rotation="-1" :label="article.source" />
        <span v-if="article.author" class="font-body text-sm text-white/70">BY {{ article.author }}</span>
        <span class="font-body text-sm text-white/70">{{ formattedPublishTime }}</span>
      </div>

      <!-- Article body -->
      <div class="detail-body font-body text-base text-white leading-relaxed">
        <div class="content-html" v-html="sanitizedContent" />
      </div>

      <!-- Source link -->
      <div class="detail-source mt-32 pt-24 border-t-4 border-white">
        <a
          :href="article.source_url"
          target="_blank"
          rel="noopener noreferrer"
          class="source-link flex items-center gap-2 font-headline font-bold text-sm text-primary uppercase hover:translate-x-1 transition-transform"
        >
          <span class="material-symbols-outlined">open_in_new</span>
          <span>READ ORIGINAL</span>
        </a>
      </div>
    </article>

    <!-- Footer -->
    <footer class="detail-footer fixed bottom-0 left-0 right-0 h-80 bg-background border-t-4 border-white flex items-center justify-center gap-4 px-16 z-100">
      <BaseButton variant="primary" size="md" icon="note_add" @click="handleSaveToNote">
        SAVE TO NOTE
      </BaseButton>
      <BaseButton variant="outline" size="md" icon="share">
        SHARE
      </BaseButton>
    </footer>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}

.h-60 {
  height: 60px;
}

.h-80 {
  height: 80px;
}

.h-300 {
  height: 300px;
}

.pt-80 {
  padding-top: 80px;
}

.pb-100 {
  padding-bottom: 100px;
}

.max-w-800 {
  max-width: 800px;
}

.z-100 {
  z-index: 100;
}

.content-html p {
  margin-bottom: 16px;
}

.content-html h2,
.content-html h3 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: #FFD700;
  margin-top: 24px;
  margin-bottom: 12px;
}

.content-html img {
  max-width: 100%;
  border: 4px solid #FFFFFF;
  box-shadow: 8px 8px 0 rgba(255, 255, 255, 0.1);
}
</style>