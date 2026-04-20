<script setup lang="ts">
import { computed } from 'vue'
import type { Note } from '@/types/entities'
import BaseIcon from '@/components/base/BaseIcon.vue'

interface Props {
  tags?: string[]
  availableTags?: { id: string; name: string }[]
  lastEdited?: string
}

const props = withDefaults(defineProps<Props>(), {
  tags: [],
  availableTags: [],
  lastEdited: '2 mins ago',
})

const emit = defineEmits<{
  setReminder: []
  addTag: [tagName: string]
  removeTag: [tagId: string]
}>()

const formattedTags = computed(() => {
  return props.tags.map(tagId => {
    const tag = props.availableTags.find(t => t.id === tagId)
    return tag ? { id: tagId, name: tag.name } : { id: tagId, name: tagId }
  })
})
</script>

<template>
  <section class="bg-surfaceHigh border-4 border-white p-6 relative">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Settings
    </span>

    <!-- Title -->
    <h3 class="font-headline font-bold text-xl mb-4 text-primary italic">
      REMINDER_PANEL
    </h3>

    <!-- Set reminder button -->
    <button
      type="button"
      class="w-full px-4 py-3 bg-surfaceLowest border-2 border-white text-white font-headline font-bold uppercase text-sm flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
      @click="emit('setReminder')"
    >
      <BaseIcon icon="notifications" size="sm" />
      SET REMINDER
    </button>

    <!-- Last edited info -->
    <div class="mt-6 pt-4 border-t-2 border-white/20">
      <p class="font-headline text-xs text-white/60 uppercase">
        Last Edited
      </p>
      <p class="font-body text-sm text-white mt-1">
        {{ lastEdited }}
      </p>
    </div>

    <!-- Tags preview -->
    <div
      v-if="formattedTags.length > 0"
      class="mt-4"
    >
      <p class="font-headline text-xs text-white/60 uppercase mb-2">
        Current Tags
      </p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in formattedTags"
          :key="tag.id"
          class="px-2 py-1 bg-primary text-black border border-white font-headline font-bold text-[10px] uppercase"
        >
          {{ tag.name }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</script>