<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'

const route = useRoute()
const router = useRouter()
const { isMobile, isDesktop } = useResponsive()

// Current navigation item based on route
const currentNav = computed(() => {
  const path = route.path
  if (path.startsWith('/notes')) return 'notes'
  if (path.startsWith('/categories')) return 'categories'
  if (path.startsWith('/archive')) return 'archive'
  if (path.startsWith('/finance')) return 'finance'
  if (path.startsWith('/news')) return 'news'
  if (path.startsWith('/settings')) return 'settings'
  return 'notes'
})

// Handlers
function handleMenuClick() {
  // Toggle drawer - could use a uiStore
}

function handleSearchClick() {
  router.push('/archive')
}

function handleAvatarClick() {
  router.push('/settings')
}

function handleNavigate(path: string) {
  router.push(path)
}

function handleCategorySelect(categoryId: string) {
  // Navigate to notes filtered by category
  router.push({ path: '/notes', query: { category: categoryId } })
}
</script>

<template>
  <div
    class="app-container min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-black"
    :class="{ 'has-drawer': isDesktop }"
  >
    <!-- Top App Bar -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
      @avatar-click="handleAvatarClick"
    />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer
      v-if="isDesktop"
      :visible="true"
      :active-id="currentNav"
      @select="handleCategorySelect"
    />

    <!-- Main Content -->
    <main
      :class="[
        'pt-[72px]',
        isDesktop && 'md:ml-72',
        isMobile && 'pb-[80px]',
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNavBar
      v-if="isMobile"
      :active-id="currentNav"
      @navigate="handleNavigate"
    />
  </div>
</template>

<style>
/* Global styles */
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&family=Manrope:wght@200;300;400;500;600;700;800&display=swap');

/* Material Symbols */
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

/* Neo-Brutalist base styles */
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.font-body {
  font-family: 'Manrope', sans-serif;
}

/* Page transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 200ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Material Symbols styling */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0e0e0e;
}

::-webkit-scrollbar-thumb {
  background: #FFD700;
  border: 4px solid white;
}

::-webkit-scrollbar-thumb:hover {
  background: #007F7F;
}

/* Selection color */
::selection {
  background: #FFD700;
  color: #131313;
}
</style>