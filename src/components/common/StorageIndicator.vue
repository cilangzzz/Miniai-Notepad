<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  used?: number
  total?: number
  showLabel?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  used: 0,
  total: 50,
  showLabel: true,
})

const percentage = computed(() => {
  return Math.min(Math.max((props.used / props.total) * 100, 0), 100)
})

const formatSize = (mb: number) => `${mb.toFixed(1)}MB`
</script>

<template>
  <div
    class="p-4 bg-surface-container-high border-2 border-white shadow-neo-white"
  >
    <p
      v-if="showLabel"
      class="font-headline font-bold text-xs uppercase mb-2 text-white/60 tracking-widest"
    >
      Storage
    </p>

    <div class="h-4 w-full bg-surface-container-lowest border-2 border-white">
      <div
        class="h-full bg-primary-container transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <p class="font-headline text-xs text-white/60 mt-2 uppercase">
      {{ formatSize(used) }} / {{ formatSize(total) }}MB
    </p>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>