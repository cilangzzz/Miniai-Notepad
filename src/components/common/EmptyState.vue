<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: string
  actionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'NO ITEMS FOUND',
  description: 'Start adding content to see it here',
  icon: 'inbox',
  actionLabel: '',
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="py-12 text-center">
    <div
      class="bg-surface-container-high border-4 border-dashed border-white/20 p-12 max-w-md mx-auto"
    >
      <!-- Icon -->
      <span class="material-symbols-outlined text-6xl text-white/20 mx-auto mb-4 block">
        {{ icon }}
      </span>

      <!-- Title -->
      <p
        class="font-headline font-black text-xl uppercase tracking-tighter mb-2 text-white/30"
      >
        {{ title }}
      </p>

      <!-- Description -->
      <p class="font-body text-sm text-white/20 uppercase tracking-widest">
        {{ description }}
      </p>

      <!-- Action button -->
      <button
        v-if="actionLabel"
        type="button"
        class="mt-6 px-6 py-3 bg-primary-container text-on-primary border-2 border-white font-headline font-bold uppercase text-sm shadow-neo-black hover:-translate-y-1 hover:-translate-x-1 transition-all"
        @click="emit('action')"
      >
        {{ actionLabel }}
      </button>
    </div>
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