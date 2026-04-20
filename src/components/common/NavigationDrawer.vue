<script setup lang="ts">
import { computed } from 'vue'

interface Category {
  id: string
  name: string
  icon: string
  color?: string
}

interface Props {
  categories?: Category[]
  activeId?: string
  storageUsed?: number
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    { id: 'work', name: 'Work', icon: 'work', color: '#FFD700' },
    { id: 'personal', name: 'Personal', icon: 'person', color: '#007F7F' },
    { id: 'ideas', name: 'Ideas', icon: 'lightbulb' },
    { id: 'tasks', name: 'Tasks', icon: 'check_circle' },
  ],
  activeId: 'work',
  storageUsed: 67,
  visible: true,
})

const emit = defineEmits<{
  select: [categoryId: string]
  close: []
}>()

const drawerClasses = computed(() => [
  props.visible ? 'translate-x-0' : '-translate-x-full',
])
</script>

<template>
  <aside
    :class="[
      'hidden md:flex fixed left-0 top-[72px] h-full w-72',
      'flex-col gap-6 p-8',
      'bg-background border-r-4 border-white',
      'shadow-sidebar',
      'z-40 transition-transform duration-300',
      drawerClasses,
    ]"
  >
    <!-- Category navigation -->
    <div class="mt-4">
      <h2
        class="font-headline font-bold text-secondary-container text-xs uppercase tracking-widest mb-6"
      >
        CATEGORIES
      </h2>

      <nav class="flex flex-col gap-4">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="[
            'px-4 py-3 flex items-center gap-3 font-headline transition-transform duration-150',
            cat.id === activeId
              ? 'bg-secondary-container text-white font-black border-2 border-white translate-x-2'
              : 'text-white/80 hover:translate-x-1 hover:text-primary-container',
          ]"
          @click="emit('select', cat.id)"
        >
          <span class="material-symbols-outlined">{{ cat.icon }}</span>
          {{ cat.name }}
        </button>
      </nav>
    </div>

    <!-- Storage indicator -->
    <div class="mt-auto pb-24">
      <div
        class="p-4 bg-surface-container-high border-2 border-white shadow-neo-white"
      >
        <p class="font-headline font-bold text-xs uppercase mb-2 text-white/60">Storage</p>
        <div class="h-4 w-full bg-surface-container-lowest border-2 border-white">
          <div
            class="h-full bg-primary-container transition-all duration-300"
            :style="{ width: `${storageUsed}%` }"
          />
        </div>
        <p class="font-headline text-xs text-white/60 mt-2">{{ storageUsed }}% used</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>