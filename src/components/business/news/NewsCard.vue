<script setup lang="ts">
import { ref, computed } from 'vue'
import BaseTag from '@/components/base/BaseTag.vue'
import type { NewsArticle, CardColor } from '@/types/entities'

interface Props {
  article: NewsArticle
  size?: 'normal' | 'large'
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'normal',
  featured: false,
})

const emit = defineEmits<{
  click: [article: NewsArticle]
}>()

const isHovered = ref(false)

const cardClass = computed(() => ({
  'news-card--normal': props.size === 'normal',
  'news-card--large': props.size === 'large',
  'news-card--featured': props.featured,
  'is-read': props.article.is_read,
}))

const showCover = computed(() => props.size === 'large' || props.featured)
const showSummary = computed(() => props.size === 'large' || props.featured)

const truncatedSummary = computed(() => {
  const maxLen = props.size === 'large' ? 150 : 100
  if (props.article.summary.length <= maxLen) {
    return props.article.summary
  }
  return props.article.summary.slice(0, maxLen) + '...'
})

const formattedTime = computed(() => {
  return formatRelativeTime(props.article.published_at)
})

const tagColor = computed(() => {
  const colorMap: Record<string, CardColor> = {
    tech: 'yellow',
    finance: 'cyan',
    life: 'white',
    world: 'gray',
    entertainment: 'yellow',
  }
  return colorMap[props.article.category] || 'yellow'
})

function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const minutes = Math.floor(diff / (60 * 1000))
  const hours = Math.floor(diff / (60 * 60 * 1000))
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))

  if (minutes < 1) return 'JUST NOW'
  if (minutes < 60) return `${minutes} MIN AGO`
  if (hours < 24) return `${hours} HOUR AGO`
  if (days < 7) return `${days} DAY AGO`

  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN')
}

function handleClick() {
  emit('click', props.article)
}
</script>

<template>
  <article
    :class="[
      'news-card relative bg-background border-4 border-white rounded-none cursor-pointer overflow-hidden',
      'transition-all duration-200',
      isHovered ? 'shadow-[12px_12px_0_rgba(255,255,255,0.2)] -translate-x-1 -translate-y-1' : 'shadow-[8px_8px_0_rgba(255,255,255,0.1)]',
      cardClass,
      article.is_read && 'opacity-70 hover:opacity-100',
    ]"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @click="handleClick"
  >
    <!-- Cover image (for large cards) -->
    <div v-if="showCover && article.cover_image" class="card-cover relative h-160 overflow-hidden">
      <img
        :src="article.cover_image"
        :alt="article.title"
        class="cover-image w-full h-full object-cover"
        loading="lazy"
      />
      <!-- Source tag -->
      <BaseTag
        :color="tagColor"
        :rotation="-2"
        :label="article.source"
        class="source-tag absolute top-12 left-12 z-10"
      />
    </div>

    <!-- Content -->
    <div :class="['card-content flex flex-col gap-2', size === 'large' ? 'p-6' : 'p-4']">
      <!-- Title -->
      <h3 :class="['card-title font-headline font-bold text-white m-0', size === 'large' ? 'text-xl' : 'text-base']">
        {{ article.title }}
      </h3>

      <!-- Summary -->
      <p v-if="showSummary" class="card-summary font-body text-white/80 text-sm leading-relaxed m-0">
        {{ truncatedSummary }}
      </p>

      <!-- Meta info -->
      <div class="card-meta flex items-center gap-3 font-body text-xs text-white/60">
        <!-- Source (for small cards) -->
        <span v-if="!showCover" class="meta-source font-semibold">
          {{ article.source }}
        </span>

        <!-- Time -->
        <span class="meta-time opacity-70">
          {{ formattedTime }}
        </span>

        <!-- Status indicators -->
        <div class="meta-status flex gap-1">
          <span v-if="article.is_favorite" class="material-symbols-outlined text-xs text-primary">favorite</span>
          <span v-if="!article.is_read" class="material-symbols-outlined text-xs text-secondary">fiber_manual_record</span>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}

.news-card--normal {
  min-height: 120px;
}

.news-card--large {
  min-height: 200px;
}

.news-card--featured {
  grid-column: span 2;
  min-height: 280px;
}

@media (max-width: 768px) {
  .news-card--featured {
    grid-column: span 1;
    min-height: 200px;
  }
}

.h-160 {
  height: 160px;
}

.top-12 {
  top: 12px;
}

.left-12 {
  left: 12px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>