<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  error?: boolean
  errorMessage?: string
  type?: 'text' | 'password' | 'email' | 'search'
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  size: 'md',
  disabled: false,
  error: false,
  type: 'text',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: []
  enter: []
}>()

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg',
  }
  return sizes[props.size]
})

const inputClasses = computed(() => [
  'w-full rounded-none',
  'bg-surfaceLowest border-4 border-white',
  'text-text placeholder:text-surfaceHighest',
  'font-body',
  'focus:border-primary focus:outline-none',
  'focus:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.5)]',
  'transition-all duration-200',
  sizeClasses.value,
  props.disabled && 'opacity-50 cursor-not-allowed',
  props.error && 'border-error focus:border-error',
])

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function handleFocus() {
  emit('focus')
}

function handleBlur() {
  emit('blur')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    emit('enter')
  }
}
</script>

<template>
  <div class="base-input-wrapper">
    <!-- Label -->
    <label
      v-if="label"
      class="block mb-2 font-headline font-bold text-xs uppercase text-white/60 tracking-wider"
    >
      {{ label }}
    </label>

    <!-- Input container with Neo badge -->
    <div class="relative">
      <span
        v-if="label"
        class="absolute -top-3 -left-2 bg-secondary text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
      >
        {{ label }}
      </span>

      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
    </div>

    <!-- Error message -->
    <p
      v-if="error && errorMessage"
      class="mt-2 text-xs text-error font-body uppercase"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>