<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@/types/entities'
import BaseProgress from '@/components/base/BaseProgress.vue'

interface Props {
  stats: {
    totalNotes: number
    archivedNotes: number
    pinnedNotes: number
    categoryDistribution: Map<string, number>
    storageUsed: number
  }
  categories?: Category[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  categoryClick: [categoryId: string]
}>()

const categoryColors: Record<string, string> = {
  Work: '#FFD700',
  Personal: '#007F7F',
  Ideas: '#FFFFFF',
  Tasks: '#353535',
}

const distributionArray = computed(() => {
  return Array.from(props.stats.categoryDistribution.entries())
})
</script>

<template>
  <div class="p-6 bg-surfaceHigh border-4 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
    <!-- Overview stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <!-- Total -->
      <div class="border-2 border-white p-4 bg-background">
        <p class="font-headline font-bold text-xs uppercase text-white/60 mb-2">TOTAL</p>
        <p class="font-headline font-black text-2xl text-primary">{{ stats.totalNotes }}</p>
      </div>

      <!-- Archived -->
      <div class="border-2 border-white p-4 bg-background">
        <p class="font-headline font-bold text-xs uppercase text-white/60 mb-2">ARCHIVED</p>
        <p class="font-headline font-black text-2xl text-white">{{ stats.archivedNotes }}</p>
      </div>

      <!-- Pinned -->
      <div class="border-2 border-white p-4 bg-background">
        <p class="font-headline font-bold text-xs uppercase text-white/60 mb-2">PINNED</p>
        <p class="font-headline font-black text-2xl text-secondary">{{ stats.pinnedNotes }}</p>
      </div>
    </div>

    <!-- Category distribution -->
    <div class="mb-8">
      <p class="font-headline font-bold text-xs uppercase text-white/60 mb-4">CATEGORY DISTRIBUTION</p>

      <div class="h-8 flex border-2 border-white overflow-hidden">
        <div
          v-for="[category, count] in distributionArray"
          :key="category"
          :style="{
            width: `${(count / stats.totalNotes) * 100}%`,
            backgroundColor: categoryColors[category] || '#353535'
          }"
          class="border-r-2 border-white last:border-r-0 cursor-pointer hover:opacity-80 transition-opacity"
          @click="emit('categoryClick', category)"
        />
      </div>

      <!-- Category labels -->
      <div class="flex flex-wrap gap-2 mt-2">
        <span
          v-for="[category, count] in distributionArray"
          :key="category"
          class="font-headline font-bold text-xs uppercase"
          :style="{ color: categoryColors[category] || '#353535' }"
        >
          {{ category }}: {{ count }}
        </span>
      </div>
    </div>

    <!-- Storage capacity -->
    <div>
      <p class="font-headline font-bold text-xs uppercase text-white/60 mb-4">STORAGE USED</p>
      <BaseProgress :value="stats.storageUsed" :max="100" color="gold" />
      <p class="font-headline text-xs text-white/60 mt-2">{{ stats.storageUsed }}% of 50MB</p>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>