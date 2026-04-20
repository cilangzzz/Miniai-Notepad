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

const props = withDefaults(defineProps<Props>(), {
  items: () => [
    { id: 'notes', label: 'Notes', icon: 'sticky_note_2', route: '/notes' },
    { id: 'categories', label: 'Tags', icon: 'label', route: '/categories' },
    { id: 'archive', label: 'Archive', icon: 'archive', route: '/archive' },
    { id: 'finance', label: 'Finance', icon: 'account_balance_wallet', route: '/finance' },
    { id: 'news', label: 'News', icon: 'newspaper', route: '/news' },
    { id: 'settings', label: 'Settings', icon: 'settings', route: '/settings' },
  ],
  activeId: 'notes',
})

const emit = defineEmits<{
  navigate: [route: string]
}>()
</script>

<template>
  <!-- Mobile Bottom Navigation - Fixed at bottom, safe area -->
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50
           bg-background border-t-4 border-white
           flex justify-around items-center overflow-x-auto
           px-2 pt-2 pb-safe
           h-[72px]"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="[
        'flex flex-col items-center justify-center px-2 py-1 transition-all min-w-[56px]',
        item.id === activeId
          ? 'bg-primary-container text-on-primary border-2 border-white -translate-y-2 shadow-neo-small'
          : 'text-white/70 hover:bg-secondary-container',
      ]"
      @click="emit('navigate', item.route)"
    >
      <span class="material-symbols-outlined text-lg">{{ item.icon }}</span>
      <span class="font-headline font-bold text-[9px] uppercase">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

/* Safe area for mobile devices */
.pb-safe {
  padding-bottom: max(16px, env(safe-area-inset-bottom));
}
</style>