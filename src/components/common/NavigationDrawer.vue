<script setup lang="ts">
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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
  mobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [
    { id: 'work', name: 'Work', icon: 'work', color: '#FFD700' },
    { id: 'personal', name: 'Personal', icon: 'person', color: '#007F7F' },
    { id: 'ideas', name: 'Ideas', icon: 'lightbulb' },
    { id: 'tasks', name: 'Tasks', icon: 'check_circle' },
  ],
  activeId: 'notes',
  storageUsed: 67,
  visible: true,
  mobile: false,
})

const emit = defineEmits<{
  select: [categoryId: string]
  navigate: [route: string]
}>()

const router = useRouter()
const route = useRoute()

// Navigation items
const navItems = computed(() => [
  { id: 'notes', label: 'Notes', icon: 'sticky_note_2', route: '/notes' },
  { id: 'categories', label: 'Categories', icon: 'label', route: '/categories' },
  { id: 'archive', label: 'Archive', icon: 'archive', route: '/archive' },
  { id: 'finance', label: 'Finance', icon: 'account_balance_wallet', route: '/finance' },
  { id: 'news', label: 'News', icon: 'newspaper', route: '/news' },
])

// Check if nav item is active
function isNavActive(itemId: string): boolean {
  return props.activeId === itemId
}

// Check if category is active
function isCategoryActive(catId: string): boolean {
  return route.query.category === catId
}

function handleNavClick(routePath: string) {
  emit('navigate', routePath)
  router.push(routePath)
}

function handleCategorySelect(categoryId: string) {
  emit('select', categoryId)
  router.push({ path: '/notes', query: { category: categoryId } })
}

function handleSettingsClick() {
  emit('navigate', '/settings')
  router.push('/settings')
}
</script>

<template>
  <aside
    v-if="visible"
    :class="[
      'fixed left-0 top-[80px] h-[calc(100vh-80px)] w-72',
      'flex flex-col p-6',
      'bg-background border-r-4 border-white',
      'shadow-sidebar z-50 overflow-y-auto',
      // Desktop: always visible, Mobile: controlled by parent
      mobile ? '' : 'hidden md:flex',
    ]"
  >
    <!-- Main Navigation -->
    <nav class="flex flex-col gap-1">
      <span class="text-white/50 font-headline font-bold text-[10px] tracking-widest mb-3 uppercase">
        NAVIGATION
      </span>

      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        :class="[
          'font-headline font-bold flex items-center gap-3 py-2 px-3 transition-all',
          'hover:translate-x-1 hover:text-primary-container',
          isNavActive(item.id)
            ? 'bg-secondary-container text-white font-black border-2 border-white'
            : 'text-white/80',
        ]"
        @click="handleNavClick(item.route)"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        <span class="uppercase text-sm">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Divider -->
    <div class="border-t-2 border-white/20 my-4" />

    <!-- Category navigation -->
    <nav class="flex flex-col gap-1">
      <span class="text-white/50 font-headline font-bold text-[10px] tracking-widest mb-3 uppercase">
        CATEGORIES
      </span>

      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        :class="[
          'font-headline font-bold flex items-center gap-3 py-2 px-3 transition-all',
          'hover:translate-x-1 hover:text-primary-container text-white/80',
          isCategoryActive(cat.id) && 'text-primary-container font-black',
        ]"
        @click="handleCategorySelect(cat.id)"
      >
        <span class="material-symbols-outlined text-primary-container">{{ cat.icon }}</span>
        <span class="uppercase text-sm">{{ cat.name }}</span>
      </button>
    </nav>

    <!-- Storage indicator -->
    <div class="mt-auto pt-6">
      <div class="p-4 bg-surface-container-high border-2 border-white shadow-neo-white mb-4">
        <p class="font-headline font-bold text-xs uppercase mb-2 text-white/60">Storage</p>
        <div class="h-4 w-full bg-surface-container-lowest border-2 border-white">
          <div
            class="h-full bg-primary-container transition-all duration-300"
            :style="{ width: `${storageUsed}%` }"
          />
        </div>
        <p class="font-headline text-xs text-white/60 mt-2">{{ storageUsed }}% of 50MB</p>
      </div>

      <!-- Settings link -->
      <button
        type="button"
        :class="[
          'w-full font-headline font-bold flex items-center gap-3 py-2 px-3 transition-all',
          'hover:translate-x-1 hover:text-primary-container',
          props.activeId === 'settings'
            ? 'bg-surface-container-high text-white font-black border-2 border-white'
            : 'text-white/60',
        ]"
        @click="handleSettingsClick"
      >
        <span class="material-symbols-outlined">settings</span>
        <span class="uppercase text-sm">Settings</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>