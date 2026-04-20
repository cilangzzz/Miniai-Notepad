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
      class="bg-surfaceHigh border-4 border-white p-8 max-w-md mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <!-- Icon -->
      <span class="material-symbols-outlined text-5xl text-white/40 mx-auto mb-4 block">
        {{ icon }}
      </span>

      <!-- Title -->
      <p
        class="font-headline font-bold text-lg uppercase tracking-wider mb-2 text-white"
      >
        {{ title }}
      </p>

      <!-- Description -->
      <p class="font-body text-sm text-white/60 mb-4">
        {{ description }}
      </p>

      <!-- Action button -->
      <button
        v-if="actionLabel"
        type="button"
        class="px-6 py-3 bg-primary text-black border-2 border-white font-headline font-bold uppercase text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 transition-all"
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