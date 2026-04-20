<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseProgress from '@/components/base/BaseProgress.vue'
import BaseDivider from '@/components/base/BaseDivider.vue'

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
</script>

<template>
  <div class="settings-page px-6 md:px-12 max-w-3xl mx-auto">
    <!-- Page Header -->
    <header class="mb-12">
      <span class="bg-secondary-container text-white px-4 py-1 font-headline font-bold text-sm mb-4 inline-block border-2 border-white uppercase">
        Configuration
      </span>
      <h1 class="font-headline font-black text-4xl md:text-6xl text-white uppercase tracking-tighter -skew-x-2">
        SETTINGS<br /><span class="text-primary-container">PANEL</span>
      </h1>
    </header>

    <!-- Storage Settings -->
    <section class="mb-8">
      <div class="bg-surface-container-high border-4 border-white p-8 relative">
        <div class="absolute -top-6 -left-2 bg-secondary-container border-2 border-white px-4 py-1 font-headline font-black text-white uppercase">
          Storage
        </div>
        <h2 class="font-headline font-bold text-lg text-primary-container uppercase mb-6 mt-4">
          DATA USAGE
        </h2>
        <BaseProgress :value="storageUsed" :max="100" color="gold" />
        <p class="font-headline text-xs text-white/60 mt-4">{{ storageUsed }}% of 50MB used</p>
        <BaseButton variant="outline" size="sm" class="mt-4" @click="handleClearCache">
          CLEAR CACHE
        </BaseButton>
      </div>
    </section>

    <!-- Display Settings -->
    <section class="mb-8">
      <div class="bg-surface-container-high border-4 border-white p-8 relative">
        <div class="absolute -top-6 -left-2 bg-secondary-container border-2 border-white px-4 py-1 font-headline font-black text-white uppercase">
          Display
        </div>
        <h2 class="font-headline font-bold text-lg text-primary-container uppercase mb-6 mt-4">
          APPEARANCE
        </h2>
        <div class="flex items-center justify-between mb-4">
          <span class="font-body text-white">Font Size</span>
          <div class="flex gap-2">
            <BaseButton variant="outline" size="sm" @click="fontSize = 'small'">Small</BaseButton>
            <BaseButton variant="primary" size="sm" @click="fontSize = 'medium'">Medium</BaseButton>
            <BaseButton variant="outline" size="sm" @click="fontSize = 'large'">Large</BaseButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Behavior Settings -->
    <section class="mb-8">
      <div class="bg-surface-container-high border-4 border-white p-8 relative">
        <div class="absolute -top-6 -left-2 bg-secondary-container border-2 border-white px-4 py-1 font-headline font-black text-white uppercase">
          Behavior
        </div>
        <h2 class="font-headline font-bold text-lg text-primary-container uppercase mb-6 mt-4">
          OPTIONS
        </h2>
        <div class="flex items-center justify-between mb-4">
          <span class="font-body text-white">Auto-save notes</span>
          <button
            type="button"
            :class="[
              'w-12 h-6 border-2 border-white relative transition-colors',
              autoSave ? 'bg-secondary-container' : 'bg-surface-container-high',
            ]"
            @click="autoSave = !autoSave"
          >
            <div
              :class="[
                'absolute w-4 h-4 bg-primary-container border-2 border-white top-1 transition-all',
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
              'w-12 h-6 border-2 border-white relative transition-colors',
              showNotifications ? 'bg-secondary-container' : 'bg-surface-container-high',
            ]"
            @click="showNotifications = !showNotifications"
          >
            <div
              :class="[
                'absolute w-4 h-4 bg-primary-container border-2 border-white top-1 transition-all',
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
              'w-12 h-6 border-2 border-white relative transition-colors',
              offlineMode ? 'bg-secondary-container' : 'bg-surface-container-high',
            ]"
            @click="offlineMode = !offlineMode"
          >
            <div
              :class="[
                'absolute w-4 h-4 bg-primary-container border-2 border-white top-1 transition-all',
                offlineMode ? 'left-6' : 'left-1',
              ]"
            />
          </button>
        </div>
      </div>
    </section>

    <!-- Data Settings -->
    <section class="mb-8">
      <div class="bg-surface-container-high border-4 border-white p-8 relative">
        <div class="absolute -top-6 -left-2 bg-secondary-container border-2 border-white px-4 py-1 font-headline font-black text-white uppercase">
          Data
        </div>
        <h2 class="font-headline font-bold text-lg text-primary-container uppercase mb-6 mt-4">
          MANAGEMENT
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
      </div>
    </section>

    <!-- About Section -->
    <section>
      <div class="bg-primary-container border-4 border-white p-8 relative">
        <div class="absolute inset-0 bg-white translate-x-2 translate-y-2 -z-10" />
        <h2 class="font-headline font-black text-lg text-on-primary uppercase mb-4 italic">
          ABOUT
        </h2>
        <p class="font-body text-on-primary/80 text-sm">
          MiniAI NotePad v1.0.0
        </p>
        <p class="font-body text-on-primary/60 text-xs mt-2">
          Neo-Brutalist Note-taking Application
        </p>
      </div>
    </section>
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