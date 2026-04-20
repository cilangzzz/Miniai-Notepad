<script setup lang="ts">
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
    class="p-4 bg-surfaceHigh border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
  >
    <p
      v-if="showLabel"
      class="font-headline font-bold text-xs uppercase mb-2 text-white/60"
    >
      Storage
    </p>

    <div class="h-4 w-full bg-black border-2 border-white">
      <div
        class="h-full bg-primary transition-all duration-300"
        :style="{ width: `${percentage}%` }"
      />
    </div>

    <p class="font-headline text-xs text-white/60 mt-2">
      {{ formatSize(used) }} / {{ formatSize(total) }}MB
    </p>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
</script>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>