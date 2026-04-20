<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  click: []
}>()

const buttonText = computed(() => props.loading ? 'REFRESHING...' : 'REFRESH')
</script>

<template>
  <button
    type="button"
    :class="[
      'refresh-btn fixed top-16 right-16 z-50',
      'flex items-center gap-2 px-5 py-3',
      'bg-primary border-4 border-white rounded-none',
      'font-headline font-bold uppercase text-xs text-black',
      'shadow-[8px_8px_0_#007F7F]',
      'transition-all duration-200',
      !loading && 'hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0_#007F7F]',
      loading && 'bg-secondary text-white cursor-not-allowed',
    ]"
    :disabled="loading"
    @click="emit('click')"
  >
    <span
      :class="[
        'material-symbols-outlined',
        loading && 'animate-spin',
      ]"
    >
      {{ loading ? 'progress_activity' : 'refresh' }}
    </span>
    <span>{{ buttonText }}</span>
  </button>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>