<script setup lang="ts">
interface Props {
  modelValue: string
  maxLength?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  maxLength: 50,
  placeholder: 'THE UNTITLED MANIFESTO...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const characterCount = computed(() => props.modelValue.length)
const isOverLimit = computed(() => characterCount > props.maxLength)
</script>

<template>
  <div class="relative">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Note Title
    </span>

    <!-- Title input -->
    <input
      type="text"
      :value="modelValue"
      :maxlength="maxLength"
      :placeholder="placeholder"
      :class="[
        'w-full bg-surfaceLowest border-4 border-white p-6',
        'font-headline font-black text-3xl md:text-5xl uppercase tracking-tighter text-white',
        'focus:outline-none focus:border-primary',
        'placeholder:text-surfaceHighest transition-colors resize-none',
        isOverLimit && 'border-error focus:border-error',
      ]"
      @input="(e) => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      @change="(e) => emit('change', (e.target as HTMLInputElement).value)"
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
</style>