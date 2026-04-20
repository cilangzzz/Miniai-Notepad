<script setup lang="ts">
import { ref, computed } from 'vue'
import FilterChip from '@/components/common/FilterChip.vue'

interface TimeFilterOption {
  id: string
  label: string
  value: string
}

interface CategoryFilterOption {
  id: string
  label: string
  color: string
  icon?: string
}

interface Props {
  timeOptions?: TimeFilterOption[]
  categoryOptions?: CategoryFilterOption[]
  activeTimeFilter?: string
  activeCategoryFilters?: string[]
  multiSelect?: boolean
}

const defaultTimeOptions: TimeFilterOption[] = [
  { id: 'all', label: 'All Time', value: 'all' },
  { id: 'last30', label: 'Last 30 Days', value: '30d' },
  { id: 'last7', label: 'Last Week', value: '7d' },
  { id: 'today', label: 'Today', value: '1d' },
]

const defaultCategoryOptions: CategoryFilterOption[] = [
  { id: 'work', label: 'Work', color: 'yellow', icon: 'work' },
  { id: 'personal', label: 'Personal', color: 'cyan', icon: 'person' },
  { id: 'ideas', label: 'Ideas', color: 'white', icon: 'lightbulb' },
  { id: 'tasks', label: 'Tasks', color: 'gray', icon: 'check_circle' },
]

const props = withDefaults(defineProps<Props>(), {
  timeOptions: defaultTimeOptions,
  categoryOptions: defaultCategoryOptions,
  activeTimeFilter: 'all',
  activeCategoryFilters: () => [],
  multiSelect: true,
})

const emit = defineEmits<{
  timeChange: [filterId: string]
  categoryChange: [filterIds: string[]]
  reset: []
}>()

const localTimeFilter = ref(props.activeTimeFilter)
const localCategoryFilters = ref<string[]>([...props.activeCategoryFilters])

const activeCount = computed(() => {
  return localCategoryFilters.value.length + (localTimeFilter.value !== 'all' ? 1 : 0)
})

function handleTimeClick(filterId: string) {
  localTimeFilter.value = filterId
  emit('timeChange', filterId)
}

function handleCategoryClick(filterId: string) {
  if (props.multiSelect) {
    const index = localCategoryFilters.value.indexOf(filterId)
    if (index > -1) {
      localCategoryFilters.value.splice(index, 1)
    } else {
      localCategoryFilters.value.push(filterId)
    }
  } else {
    localCategoryFilters.value = [filterId]
  }
  emit('categoryChange', [...localCategoryFilters.value])
}

function handleReset() {
  localTimeFilter.value = 'all'
  localCategoryFilters.value = []
  emit('reset')
}

function isCategoryActive(filterId: string) {
  return localCategoryFilters.value.includes(filterId)
}
</script>

<template>
  <div class="neo-filter-chips">
    <!-- Filter title -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-headline font-bold uppercase tracking-wider text-sm text-white">
        FILTER BY
      </h3>

      <!-- Reset button -->
      <button
        v-if="activeCount > 0"
        type="button"
        class="text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors"
        @click="handleReset"
      >
        RESET
      </button>
    </div>

    <!-- Time filter group -->
    <div class="neo-filter-group mb-4">
      <div class="flex flex-wrap gap-2">
        <FilterChip
          v-for="option in timeOptions"
          :key="option.id"
          :label="option.label"
          :active="localTimeFilter === option.id"
          @click="handleTimeClick(option.id)"
        />
      </div>
    </div>

    <!-- Category filter group -->
    <div class="neo-filter-group">
      <div class="flex flex-wrap gap-2">
        <FilterChip
          v-for="option in categoryOptions"
          :key="option.id"
          :label="option.label"
          :icon="option.icon"
          :active="isCategoryActive(option.id)"
          @click="handleCategoryClick(option.id)"
        />
      </div>
    </div>

    <!-- Active filter count -->
    <div v-if="activeCount > 0" class="neo-filter-count mt-4 text-white/60 text-xs">
      {{ activeCount }} filter(s) active
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.neo-filter-chips {
  padding: 16px 0;
}
</style>