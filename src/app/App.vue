<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useResponsive } from '@/composables/useResponsive'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'

const route = useRoute()
const router = useRouter()
const { isMobile, isDesktop } = useResponsive()

// Mobile drawer state
const mobileDrawerOpen = ref(false)

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
  mobileDrawerOpen.value = !mobileDrawerOpen.value
}

function handleCloseDrawer() {
  mobileDrawerOpen.value = false
}

function handleSearchClick() {
  router.push('/archive')
}

function handleAvatarClick() {
  router.push('/settings')
}

function handleNavigate(path: string) {
  router.push(path)
  mobileDrawerOpen.value = false
}

function handleCategorySelect(categoryId: string) {
  router.push({ path: '/notes', query: { category: categoryId } })
  mobileDrawerOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-background font-body">
    <!-- Top App Bar - Fixed at top, height 80px -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
      @avatar-click="handleAvatarClick"
    />

    <!-- Desktop Navigation Drawer - Fixed below header -->
    <NavigationDrawer
      v-if="isDesktop"
      :visible="true"
      :active-id="currentNav"
      @select="handleCategorySelect"
    />

    <!-- Mobile Drawer Overlay -->
    <div
      v-if="mobileDrawerOpen && isMobile"
      class="fixed inset-0 bg-black/80 z-40"
      @click="handleCloseDrawer"
    />

    <!-- Mobile Navigation Drawer - Slide in from left -->
    <Transition name="drawer">
      <NavigationDrawer
        v-if="mobileDrawerOpen && isMobile"
        :visible="true"
        :mobile="true"
        :active-id="currentNav"
        @select="handleCategorySelect"
        @navigate="handleNavigate"
      />
    </Transition>

    <!-- Main Content Area - Proper padding for fixed navigation -->
    <main
      :class="[
        'min-h-screen',
        'pt-[88px]',
        isDesktop && 'md:ml-[288px]',
        isMobile && 'pb-[100px]',
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Mobile Bottom Navigation - Fixed at bottom -->
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

/* Font families */
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

/* Mobile drawer transition */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 300ms ease;
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}

/* Material Symbols styling */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Custom scrollbar - Neo Gold */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #0e0e0e;
}

::-webkit-scrollbar-thumb {
  background: #FFD700;
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