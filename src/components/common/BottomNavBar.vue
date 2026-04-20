<script setup lang="ts">
import { computed } from 'vue'

interface NavItem {
  id: string
  label: string
  icon: string
  route: string
}

interface Props {
  items?: NavItem[]
  activeId?: string
}

const defaultItems: NavItem[] = [
  { id: 'notes', label: 'Notes', icon: 'sticky_note_2', route: '/notes' },
  { id: 'categories', label: 'Tags', icon: 'label', route: '/categories' },
  { id: 'archive', label: 'Archive', icon: 'archive', route: '/archive' },
  { id: 'finance', label: 'Finance', icon: 'account_balance_wallet', route: '/finance' },
  { id: 'news', label: 'News', icon: 'newspaper', route: '/news' },
  { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
]

const props = withDefaults(defineProps<Props>(), {
  items: defaultItems,
  activeId: 'notes',
})

const emit = defineEmits<{
  navigate: [route: string]
}>()
</script>

<template>
  <nav
    class="md:hidden fixed bottom-0 left-0 z-50 w-full bg-background border-t-4 border-white flex justify-around items-center px-4 pb-6 pt-2"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="[
        'flex flex-col items-center justify-center px-4 py-1 transition-all duration-200',
        item.id === activeId
          ? 'bg-primary text-black border-2 border-white -translate-y-2 -translate-x-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]'
          : 'text-white/70 hover:bg-secondary',
      ]"
      @click="emit('navigate', item.route)"
    >
      <span class="material-symbols-outlined">{{ item.icon }}</span>
      <span class="font-headline font-bold text-[10px] uppercase">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>