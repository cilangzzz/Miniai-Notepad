<script setup lang="ts">
interface Props {
  icon: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  filled?: boolean
  weight?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  filled: false,
  weight: 400,
})

const sizeClasses: Record<string, string> = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}
</script>

<template>
  <span
    class="material-symbols-outlined"
    :class="sizeClasses[size]"
    :style="{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}` }"
  >
    {{ icon }}
  </span>
</template>