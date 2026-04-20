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
  'w-20 h-20',
  'flex items-center justify-center',
  'border-4 border-white rounded-none',
  'transition-all duration-200',
  props.isSaving || !props.isValid
    ? 'opacity-50 cursor-not-allowed'
    : 'hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]',
  'active:scale-95',
  'bg-primary text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
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