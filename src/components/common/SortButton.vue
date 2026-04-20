<script setup lang="ts">
import { ref, computed } from 'vue'

interface SortOption {
  value: string
  label: string
  icon?: string
}

interface Props {
  options?: SortOption[]
  activeValue?: string
}

const defaultOptions: SortOption[] = [
  { value: 'newest', label: 'Newest', icon: 'arrow_downward' },
  { value: 'oldest', label: 'Oldest', icon: 'arrow_upward' },
  { value: 'title', label: 'Title', icon: 'sort_by_alpha' },
]

const props = withDefaults(defineProps<Props>(), {
  options: defaultOptions,
  activeValue: 'newest',
})

const emit = defineEmits<{
  change: [value: string]
}>()

const isOpen = ref(false)

const activeOption = computed(() => {
  return props.options.find(o => o.value === props.activeValue) || props.options[0]
})

function handleSelect(value: string) {
  emit('change', value)
  isOpen.value = false
}

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div class="relative">
    <!-- Trigger button -->
    <button
      type="button"
      :class="[
        'px-4 py-2 border-2 border-white',
        'bg-surfaceHigh text-white',
        'font-headline font-bold uppercase text-xs tracking-wider',
        'flex items-center gap-2',
        'transition-all duration-150',
        'hover:bg-secondary',
      ]"
      @click="toggle"
    >
      <span
        v-if="activeOption.icon"
        class="material-symbols-outlined text-sm"
      >
        {{ activeOption.icon }}
      </span>
      {{ activeOption.label }}
      <span class="material-symbols-outlined text-sm">expand_more</span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute top-full left-0 mt-2 bg-background border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          :class="[
            'px-4 py-3 w-full',
            'font-headline font-bold uppercase text-xs',
            'flex items-center gap-2',
            'transition-colors duration-150',
            option.value === activeValue
              ? 'bg-secondary text-white'
              : 'bg-transparent text-white hover:bg-surfaceHigh',
          ]"
          @click="handleSelect(option.value)"
        >
          <span
            v-if="option.icon"
            class="material-symbols-outlined text-sm"
          >
            {{ option.icon }}
          </span>
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>