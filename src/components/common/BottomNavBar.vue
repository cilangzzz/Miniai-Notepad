<script setup lang="ts">
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
  'navigate': [route: string]
}>()
</script>

<template>
  <!-- Mobile Bottom Navigation - Hidden on desktop (md:) -->
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50
           bg-background border-t-4 border-white
           flex justify-around items-center
           px-2 pt-2 h-[88px]"
    style="padding-bottom: max(20px, env(safe-area-inset-bottom));"
  >
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      :class="[
        'flex flex-col items-center justify-center px-3 py-2 transition-all min-w-[64px]',
        item.id === activeId
          ? 'bg-primary-container text-on-primary border-4 border-white -translate-y-3 shadow-neo-white'
          : 'text-white/70',
      ]"
      @click="emit('navigate', item.route)"
    >
      <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
      <span class="font-headline font-bold text-xs uppercase mt-1">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>