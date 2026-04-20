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
  <div class="relative group">
    <!-- Background offset -->
    <div class="absolute inset-0 bg-white translate-x-2 translate-y-2 -z-10" />

    <div class="relative bg-primary-container border-4 border-white p-8 text-on-primary">
      <h3 class="font-headline font-black text-3xl mb-2 italic">STATS</h3>

      <div class="grid grid-cols-2 gap-4">
        <!-- Total -->
        <div>
          <div class="font-headline text-4xl font-black">{{ stats.totalNotes }}</div>
          <div class="text-xs font-bold uppercase tracking-widest opacity-70">Total Tags</div>
        </div>

        <!-- Tagged Notes -->
        <div>
          <div class="font-headline text-4xl font-black">{{ stats.totalNotes }}</div>
          <div class="text-xs font-bold uppercase tracking-widest opacity-70">Tagged Notes</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>