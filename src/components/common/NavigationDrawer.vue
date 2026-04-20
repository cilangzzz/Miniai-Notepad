<script setup lang="ts">
import { computed } from 'vue'
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
  'select': [categoryId: string]
  'navigate': [route: string]
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

function isNavActive(itemId: string): boolean {
  return props.activeId === itemId
}

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
    class="fixed left-0 top-[88px] h-[calc(100vh-88px)] w-[320px]
           flex flex-col py-8 px-6
           bg-background border-r-4 border-white
           overflow-y-auto"
    :class="mobile ? 'z-50 bg-surface-container' : 'z-30'"
  >
    <!-- Main Navigation -->
    <nav class="flex flex-col gap-3 mb-8">
      <span class="text-white/50 font-headline font-bold text-sm tracking-widest mb-3 px-2 uppercase">
        NAVIGATION
      </span>

      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        class="font-headline font-bold flex items-center gap-4 py-4 px-4 transition-all w-full text-left"
        :class="[
          isNavActive(item.id)
            ? 'bg-secondary-container text-white font-black border-4 border-white shadow-neo-white'
            : 'text-white/80 hover:bg-surface-container-high hover:text-primary-container border-2 border-transparent',
        ]"
        @click="handleNavClick(item.route)"
      >
        <span class="material-symbols-outlined text-2xl">{{ item.icon }}</span>
        <span class="uppercase text-base font-bold">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Divider -->
    <div class="border-t-4 border-white/30 mb-8" />

    <!-- Categories -->
    <nav class="flex flex-col gap-3 mb-8">
      <span class="text-white/50 font-headline font-bold text-sm tracking-widest mb-3 px-2 uppercase">
        CATEGORIES
      </span>

      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="font-headline font-bold flex items-center gap-4 py-4 px-4 transition-all w-full text-left"
        :class="[
          isCategoryActive(cat.id)
            ? 'bg-surface-container-high text-primary-container font-black border-4 border-primary-container shadow-neo-gold'
            : 'text-white/80 hover:bg-surface-container-high hover:text-primary-container border-2 border-transparent',
        ]"
        @click="handleCategorySelect(cat.id)"
      >
        <span class="material-symbols-outlined text-2xl text-primary-container">{{ cat.icon }}</span>
        <span class="uppercase text-base font-bold">{{ cat.name }}</span>
      </button>
    </nav>

    <!-- Spacer to push bottom content down -->
    <div class="flex-grow" />

    <!-- Bottom: Storage + Settings -->
    <div class="mt-auto">
      <!-- Storage -->
      <div class="p-6 bg-surface-container-high border-4 border-white mb-6 shadow-neo-white">
        <p class="font-headline font-bold text-sm uppercase mb-4 text-white/60">Storage</p>
        <div class="h-6 w-full bg-surface-container-lowest border-4 border-white">
          <div
            class="h-full bg-primary-container"
            :style="{ width: `${storageUsed}%` }"
          />
        </div>
        <p class="font-headline text-sm text-white/60 mt-3">{{ storageUsed }}% / 50MB</p>
      </div>

      <!-- Settings -->
      <button
        type="button"
        class="w-full font-headline font-bold flex items-center gap-4 py-4 px-4 transition-all text-left"
        :class="[
          props.activeId === 'settings'
            ? 'bg-secondary-container text-white font-black border-4 border-white shadow-neo-white'
            : 'text-white/60 hover:bg-surface-container-high hover:text-primary-container border-2 border-transparent',
        ]"
        @click="handleSettingsClick"
      >
        <span class="material-symbols-outlined text-2xl">settings</span>
        <span class="uppercase text-base font-bold">Settings</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

/* Custom scrollbar for sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: #FFD700;
}
</style>