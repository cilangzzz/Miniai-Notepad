<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isSaving?: boolean
  isValid?: boolean
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  isSaving: false,
  isValid: true,
  icon: 'check',
})

const emit = defineEmits<{
  save: []
}>()

const buttonClasses = computed(() => [
  'fixed bottom-8 right-8',
  'w-16 h-16',
  'flex items-center justify-center',
  'border-4 border-white rounded-none',
  'transition-all duration-150',
  props.isSaving || !props.isValid
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:-translate-y-1 hover:-translate-x-1 hover:shadow-neo-hover',
  'active:scale-95',
  'bg-primary-container text-on-primary shadow-neo-black',
  'z-[60]',
])
</script>

<template>
  <button
    type="button"
    :class="buttonClasses"
    :disabled="isSaving || !isValid"
    @click="emit('save')"
  >
    <span
      v-if="isSaving"
      class="material-symbols-outlined text-3xl animate-spin"
    >
      progress_activity
    </span>
    <span
      v-else
      class="material-symbols-outlined text-3xl font-bold"
      style="font-variation-settings: 'FILL' 0, 'wght' 700;"
    >
      {{ icon }}
    </span>
  </button>
</template>