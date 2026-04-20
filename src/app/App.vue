<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'

const route = useRoute()
const router = useRouter()

// Responsive state - using resize observer
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const isMobile = computed(() => windowWidth.value < 768)

function updateWidth() {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  updateWidth()
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

// Drawer states
const mobileDrawerOpen = ref(false)
const desktopDrawerVisible = ref(true)

// Current navigation
const currentNav = computed(() => {
  const path = route.path
  if (path.includes('/notes')) return 'notes'
  if (path.includes('/categories')) return 'categories'
  if (path.includes('/archive')) return 'archive'
  if (path.includes('/finance')) return 'finance'
  if (path.includes('/news')) return 'news'
  if (path.includes('/settings')) return 'settings'
  return 'notes'
})

// Handlers
function handleMenuClick() {
  if (isMobile.value) {
    mobileDrawerOpen.value = !mobileDrawerOpen.value
  } else {
    desktopDrawerVisible.value = !desktopDrawerVisible.value
  }
}

function handleSearchClick() {
  router.push('/archive')
}

function handleAvatarClick() {
  router.push('/settings')
}

function handleNavigate(path: string) {
  router.push(path)
  if (isMobile.value) {
    mobileDrawerOpen.value = false
  }
}

function handleCategorySelect(categoryId: string) {
  router.push({ path: '/notes', query: { category: categoryId } })
  if (isMobile.value) {
    mobileDrawerOpen.value = false
  }
}

function handleCloseMobileDrawer() {
  mobileDrawerOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-background text-on-background">
    <!-- Top App Bar - z-50, fixed top -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
      @avatar-click="handleAvatarClick"
    />

    <!-- Desktop Sidebar - z-20, below header -->
    <NavigationDrawer
      v-if="!isMobile"
      :visible="desktopDrawerVisible"
      :active-id="currentNav"
      :mobile="false"
      @select="handleCategorySelect"
      @navigate="handleNavigate"
    />

    <!-- Mobile Overlay - z-40 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="isMobile && mobileDrawerOpen"
          class="fixed inset-0 bg-black/70 z-40"
          @click="handleCloseMobileDrawer"
        />
      </Transition>
    </Teleport>

    <!-- Mobile Sidebar - z-50, slides in -->
    <Teleport to="body">
      <Transition name="slide">
        <NavigationDrawer
          v-if="isMobile && mobileDrawerOpen"
          :visible="true"
          :active-id="currentNav"
          :mobile="true"
          @select="handleCategorySelect"
          @navigate="handleNavigate"
        />
      </Transition>
    </Teleport>

    <!-- Main Content - z-10 -->
    <main
      class="min-h-screen pt-[88px] px-6 transition-all duration-300"
      :class="[
        !isMobile && desktopDrawerVisible ? 'pl-[320px]' : '',
        isMobile ? 'pb-[88px]' : '',
      ]"
    >
      <router-view />
    </main>

    <!-- Bottom Nav - z-50, mobile only -->
    <BottomNavBar
      v-if="isMobile"
      :active-id="currentNav"
      @navigate="handleNavigate"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap');

.font-headline { font-family: 'Space Grotesk', sans-serif; }
.font-body { font-family: 'Manrope', sans-serif; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

/* Material Symbols */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0e0e0e; }
::-webkit-scrollbar-thumb { background: #FFD700; }

/* Selection */
::selection { background: #FFD700; color: #131313; }
</style>