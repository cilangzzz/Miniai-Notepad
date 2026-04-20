<script setup lang="ts">
import { computed } from 'vue'
import BaseProgress from '@/components/base/BaseProgress.vue'

interface Props {
  used?: number
  total?: number
}

const props = withDefaults(defineProps<Props>(), {
  used: 0,
  total: 50,
})

const emit = defineEmits<{
  clear: []
}>()

const percentage = computed(() => Math.min((props.used / props.total) * 100, 100))
const formatSize = (mb: number) => `${mb.toFixed(1)}MB`
</script>

<template>
  <div class="bg-secondary-container p-4 border-2 border-white -rotate-2">
    <p class="font-headline font-black text-white uppercase text-xs">Archive Capacity</p>
    <p class="font-headline text-3xl font-black text-white italic">{{ Math.round(percentage) }}%</p>

    <div class="h-3 bg-surface-container-lowest border border-white mt-2">
      <div
        class="h-full bg-primary-container transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>