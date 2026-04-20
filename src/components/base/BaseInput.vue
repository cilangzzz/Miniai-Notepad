<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue?: string
  placeholder?: string
  label?: string
  badge?: string
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
  'bg-surface-container-lowest border-4 border-white',
  'text-on-background placeholder:text-surface-container-highest',
  'font-body',
  'focus:border-primary-container focus:outline-none',
  'transition-colors duration-150',
  sizeClasses.value,
  props.disabled && 'opacity-50 cursor-not-allowed',
  props.error && 'border-error-container focus:border-error-container',
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
    <!-- Badge label -->
    <div v-if="badge" class="relative">
      <span
        class="absolute -top-3 -left-2 bg-secondary-container text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
      >
        {{ badge }}
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

    <!-- Regular label -->
    <label
      v-if="label && !badge"
      class="block mb-2 font-headline font-bold text-xs uppercase text-white/60 tracking-widest"
    >
      {{ label }}
    </label>

    <!-- Input without badge -->
    <input
      v-if="!badge"
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

    <!-- Error message -->
    <p
      v-if="error && errorMessage"
      class="mt-2 text-xs text-error-container font-headline uppercase"
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