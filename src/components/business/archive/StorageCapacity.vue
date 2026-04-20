<script setup lang="ts">
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
  <div class="p-4 bg-surfaceHigh border-2 border-white shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]">
    <p class="font-headline font-bold text-xs uppercase mb-2 text-white/60">Storage</p>

    <BaseProgress :value="percentage" :max="100" :show-label="false" />

    <div class="flex justify-between mt-2">
      <p class="font-headline text-xs text-white/60">{{ formatSize(used) }} / {{ formatSize(total) }}MB</p>
      <button
        v-if="used > 0"
        type="button"
        class="font-headline text-xs text-primary uppercase hover:underline"
        @click="emit('clear')"
      >
        Clear Cache
      </button>
    </div>
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