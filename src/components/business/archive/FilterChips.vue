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

const props = withDefaults(defineProps<Props>(), {
  timeOptions: () => [
    { id: 'all', label: 'All Time', value: 'all' },
    { id: 'last30', label: 'Last 30 Days', value: '30d' },
    { id: 'last7', label: 'Last Week', value: '7d' },
    { id: 'today', label: 'Today', value: '1d' },
  ],
  categoryOptions: () => [
    { id: 'work', label: 'Work', color: 'yellow', icon: 'work' },
    { id: 'personal', label: 'Personal', color: 'cyan', icon: 'person' },
    { id: 'ideas', label: 'Ideas', color: 'white', icon: 'lightbulb' },
    { id: 'tasks', label: 'Tasks', color: 'gray', icon: 'check_circle' },
  ],
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
    <!-- Filter chips -->
    <div class="flex flex-wrap gap-4">
      <FilterChip
        v-for="option in timeOptions"
        :key="option.id"
        :label="option.label"
        :active="localTimeFilter === option.id"
        :skew="true"
        @click="handleTimeClick(option.id)"
      />

      <FilterChip
        v-for="option in categoryOptions"
        :key="option.id"
        :label="option.label"
        :icon="option.icon"
        :active="isCategoryActive(option.id)"
        :color="option.color as any"
        :skew="true"
        @click="handleCategoryClick(option.id)"
      />
    </div>

    <!-- Active filter count -->
    <div v-if="activeCount > 0" class="mt-4 text-white/60 text-xs uppercase">
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