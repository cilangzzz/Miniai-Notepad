<script setup lang="ts">
interface Props {
  modelValue: string
  maxLength?: number
  minHeight?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  maxLength: 5000,
  minHeight: 530,
  placeholder: 'Begin typing the next big thing here...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const characterCount = computed(() => props.modelValue.length)
const isOverLimit = computed(() => characterCount > props.maxLength)
</script>

<template>
  <div class="relative flex-grow">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Manuscript
    </span>

    <!-- Content textarea -->
    <textarea
      :value="modelValue"
      :maxlength="maxLength"
      :placeholder="placeholder"
      :style="{ minHeight: `${minHeight}px` }"
      :class="[
        'w-full bg-surfaceLowest border-4 border-white p-8',
        'font-body text-lg leading-relaxed text-white',
        'focus:outline-none focus:border-primary',
        'placeholder:text-surfaceHighest content-editor resize-none',
        isOverLimit && 'border-error focus:border-error',
      ]"
      @input="(e) => emit('update:modelValue', (e.target as HTMLTextAreaElement).value)"
      @change="(e) => emit('change', (e.target as HTMLTextAreaElement).value)"
    />

    <!-- Character count -->
    <div
      class="absolute bottom-2 right-4 font-headline text-xs"
      :class="isOverLimit ? 'text-error' : 'text-surfaceHighest'"
    >
      {{ characterCount }} / {{ maxLength }}
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
.font-body {
  font-family: 'Manrope', sans-serif;
}

.content-editor::-webkit-scrollbar {
  width: 8px;
}

.content-editor::-webkit-scrollbar-track {
  background: #0e0e0e;
}

.content-editor::-webkit-scrollbar-thumb {
  background: #FFD700;
  border: 4px solid white;
}

.content-editor::-webkit-scrollbar-thumb:hover {
  background: #007F7F;
}
</style>