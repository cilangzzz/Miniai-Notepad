<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: 'gold' | 'white' | 'teal'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'gold',
})

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  }
  return sizes[props.size]
})

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    gold: 'border-primary',
    white: 'border-white',
    teal: 'border-secondary',
  }
  return colors[props.color]
})
</script>

<template>
  <div
    :class="[
      'rounded-full',
      'border-t-transparent',
      'animate-spin',
      sizeClasses,
      colorClasses,
    ]"
    style="border-top-color: transparent"
  />
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>