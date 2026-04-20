<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  showExecute?: boolean
  executeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'QUERY THE ARCHIVE...',
  size: 'md',
  disabled: false,
  loading: false,
  showExecute: true,
  executeLabel: 'EXECUTE',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  execute: [keyword: string]
  input: [keyword: string]
  clear: []
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('input', target.value)
}

function handleExecute() {
  if (props.modelValue.trim()) {
    emit('execute', props.modelValue.trim())
  }
}

function handleClear() {
  emit('update:modelValue', '')
  emit('clear')
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleExecute()
  }
}
</script>

<template>
  <!-- Double layer structure matching reference -->
  <div class="neo-search-wrapper relative">
    <!-- Background offset layer -->
    <div
      class="neo-search-bg absolute inset-0 bg-secondary-container border-4 border-white"
      aria-hidden="true"
    />

    <!-- Main input layer -->
    <div
      class="neo-search-main relative bg-surface-container-lowest border-4 border-white focus-within:border-primary-container transition-colors duration-150"
    >
      <div class="flex items-stretch">
        <!-- Search icon -->
        <span class="material-symbols-outlined text-white px-4 text-3xl self-center">search</span>

        <!-- Large input -->
        <input
          type="text"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="neo-search-input flex-1 bg-transparent text-white font-headline font-bold text-xl md:text-2xl uppercase px-4 py-4 md:py-6 focus:outline-none"
          :class="{ 'opacity-50': disabled }"
          @input="handleInput"
          @keydown="handleKeydown"
        />

        <!-- Clear button -->
        <button
          v-if="modelValue.length > 0"
          type="button"
          class="neo-clear-btn px-4 text-white/60 hover:text-white transition-colors self-center"
          @click="handleClear"
        >
          <span class="material-symbols-outlined">close</span>
        </button>

        <!-- Execute button -->
        <button
          v-if="showExecute"
          type="button"
          class="neo-execute-btn bg-primary-container border-l-4 border-white px-8 font-headline font-black uppercase"
          :class="{
            'shadow-neo-teal hover:shadow-neo-hover hover:-translate-x-1 hover:-translate-y-1': modelValue.trim() && !loading,
            'opacity-50 cursor-not-allowed': !modelValue.trim() || loading,
          }"
          :disabled="!modelValue.trim() || loading"
          @click="handleExecute"
        >
          <span v-if="!loading">{{ executeLabel }}</span>
          <span v-else class="flex items-center gap-2">
            <span class="material-symbols-outlined animate-spin">progress_activity</span>
            SEARCHING...
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.neo-search-wrapper {
  min-height: 80px;
}

.neo-search-bg {
  transform: translate(8px, 8px);
  z-index: 0;
}

.neo-search-main {
  z-index: 1;
}

.neo-search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-family: 'Space Grotesk', sans-serif;
}

.neo-execute-btn {
  font-family: 'Space Grotesk', sans-serif;
  color: #3a3000;
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
}

@media (max-width: 768px) {
  .neo-search-wrapper {
    min-height: 60px;
  }

  .neo-execute-btn {
    padding: 12px 16px;
  }
}
</style>