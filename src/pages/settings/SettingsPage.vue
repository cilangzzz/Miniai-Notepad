<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseProgress from '@/components/base/BaseProgress.vue'
import BaseDivider from '@/components/base/BaseDivider.vue'

const router = useRouter()

// Settings state
const storageUsed = ref(67)
const fontSize = ref('medium')
const autoSave = ref(true)
const showNotifications = ref(true)
const offlineMode = ref(false)

// Handlers
function handleClearCache() {
  storageUsed.value = 0
}

function handleExportData() {
  // Export all data
}

function handleImportData() {
  // Import data
}

function handleResetApp() {
  // Reset app to defaults
}

function handleMenuClick() {}

const currentNav = 'settings'
</script>

<template>
  <div class="settings-page min-h-screen bg-background">
    <!-- Top App Bar -->
    <TopAppBar @menu-click="handleMenuClick" />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="true" />

    <!-- Main Content -->
    <main class="pt-[72px] pb-[80px] px-4 md:px-12 md:ml-[288px]">
      <!-- Page Header -->
      <header class="mb-12">
        <h1 class="font-headline font-black text-4xl md:text-5xl text-primary uppercase tracking-tighter -skew-x-2">
          SETTINGS
        </h1>
        <p class="font-headline font-bold text-sm text-white/60 uppercase mt-2">
          CONFIGURE YOUR EXPERIENCE
        </p>
      </header>

      <!-- Storage Settings -->
      <section class="mb-8">
        <BaseCard variant="secondary" padding="lg" :hoverable="false">
          <h2 class="font-headline font-bold text-lg text-primary uppercase mb-6">
            STORAGE
          </h2>
          <BaseProgress :value="storageUsed" :max="100" color="gold" />
          <p class="font-headline text-xs text-white/60 mt-4">{{ storageUsed }}% of 50MB used</p>
          <BaseButton variant="outline" size="sm" class="mt-4" @click="handleClearCache">
            CLEAR CACHE
          </BaseButton>
        </BaseCard>
      </section>

      <!-- Display Settings -->
      <section class="mb-8">
        <BaseCard variant="secondary" padding="lg" :hoverable="false">
          <h2 class="font-headline font-bold text-lg text-primary uppercase mb-6">
            DISPLAY
          </h2>
          <div class="flex items-center justify-between mb-4">
            <span class="font-body text-white">Font Size</span>
            <div class="flex gap-2">
              <BaseButton variant="outline" size="sm" @click="fontSize = 'small'">Small</BaseButton>
              <BaseButton variant="primary" size="sm" @click="fontSize = 'medium'">Medium</BaseButton>
              <BaseButton variant="outline" size="sm" @click="fontSize = 'large'">Large</BaseButton>
            </div>
          </div>
        </BaseCard>
      </section>

      <!-- Behavior Settings -->
      <section class="mb-8">
        <BaseCard variant="secondary" padding="lg" :hoverable="false">
          <h2 class="font-headline font-bold text-lg text-primary uppercase mb-6">
            BEHAVIOR
          </h2>
          <div class="flex items-center justify-between mb-4">
            <span class="font-body text-white">Auto-save notes</span>
            <button
              type="button"
              :class="[
                'w-12 h-6 border-2 border-white rounded-none relative transition-colors',
                autoSave ? 'bg-secondary' : 'bg-surfaceHigh',
              ]"
              @click="autoSave = !autoSave"
            >
              <div
                :class="[
                  'absolute w-4 h-4 bg-primary border-2 border-white top-1 transition-all',
                  autoSave ? 'left-6' : 'left-1',
                ]"
              />
            </button>
          </div>
          <div class="flex items-center justify-between mb-4">
            <span class="font-body text-white">Show notifications</span>
            <button
              type="button"
              :class="[
                'w-12 h-6 border-2 border-white rounded-none relative transition-colors',
                showNotifications ? 'bg-secondary' : 'bg-surfaceHigh',
              ]"
              @click="showNotifications = !showNotifications"
            >
              <div
                :class="[
                  'absolute w-4 h-4 bg-primary border-2 border-white top-1 transition-all',
                  showNotifications ? 'left-6' : 'left-1',
                ]"
              />
            </button>
          </div>
          <div class="flex items-center justify-between">
            <span class="font-body text-white">Offline mode</span>
            <button
              type="button"
              :class="[
                'w-12 h-6 border-2 border-white rounded-none relative transition-colors',
                offlineMode ? 'bg-secondary' : 'bg-surfaceHigh',
              ]"
              @click="offlineMode = !offlineMode"
            >
              <div
                :class="[
                  'absolute w-4 h-4 bg-primary border-2 border-white top-1 transition-all',
                  offlineMode ? 'left-6' : 'left-1',
                ]"
              />
            </button>
          </div>
        </BaseCard>
      </section>

      <!-- Data Settings -->
      <section class="mb-8">
        <BaseCard variant="secondary" padding="lg" :hoverable="false">
          <h2 class="font-headline font-bold text-lg text-primary uppercase mb-6">
            DATA MANAGEMENT
          </h2>
          <div class="flex gap-4">
            <BaseButton variant="primary" size="md" icon="download" @click="handleExportData">
              EXPORT
            </BaseButton>
            <BaseButton variant="outline" size="md" icon="upload" @click="handleImportData">
              IMPORT
            </BaseButton>
          </div>
          <BaseDivider color="gray" class="my-6" />
          <BaseButton variant="outline" size="sm" icon="restart_alt" @click="handleResetApp">
            RESET APP
          </BaseButton>
        </BaseCard>
      </section>

      <!-- About Section -->
      <section>
        <BaseCard variant="dark" padding="lg" :hoverable="false">
          <h2 class="font-headline font-bold text-lg text-white uppercase mb-4">
            ABOUT
          </h2>
          <p class="font-body text-white/60 text-sm">
            MiniAI NotePad v1.0.0
          </p>
          <p class="font-body text-white/40 text-xs mt-2">
            Neo-Brutalist Note-taking Application
          </p>
        </BaseCard>
      </section>
    </main>

    <!-- Mobile Bottom Navigation -->
    <BottomNavBar
      :active-id="currentNav"
      @navigate="(route) => router.push(route)"
    />
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>