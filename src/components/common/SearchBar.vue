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
  placeholder: 'SEARCH THE ARCHIVE...',
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
  <!-- Double layer structure -->
  <div class="neo-search-wrapper relative">
    <!-- Background offset layer -->
    <div
      class="neo-search-bg absolute inset-0 bg-[#333333] border-4 border-white"
      aria-hidden="true"
    />

    <!-- Main input layer -->
    <div
      class="neo-search-main relative bg-[#131313] border-4 border-white focus-within:border-primary transition-colors duration-200"
    >
      <div class="flex items-stretch">
        <!-- Large input -->
        <input
          type="text"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          class="neo-search-input flex-1 bg-transparent text-white font-medium text-lg px-6 py-6 md:px-8 md:py-8 focus:outline-none"
          :class="{ 'opacity-50': disabled }"
          @input="handleInput"
          @keydown="handleKeydown"
        />

        <!-- Clear button -->
        <button
          v-if="modelValue.length > 0"
          type="button"
          class="neo-clear-btn px-4 text-white/60 hover:text-white transition-colors"
          @click="handleClear"
        >
          <span class="material-symbols-outlined">close</span>
        </button>

        <!-- Execute button -->
        <button
          v-if="showExecute"
          type="button"
          class="neo-execute-btn bg-primary border-4 border-white px-8 font-bold uppercase tracking-wider"
          :class="{
            'shadow-[8px_8px_0_#007F7F] hover:shadow-[12px_12px_0_#007F7F] hover:-translate-x-1 hover:-translate-y-1': modelValue.trim() && !loading,
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
  font-family: 'Manrope', sans-serif;
}

.neo-execute-btn {
  font-family: 'Space Grotesk', sans-serif;
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
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