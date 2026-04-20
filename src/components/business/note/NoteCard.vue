<script setup lang="ts">
import { computed } from 'vue'
import type { Note, CardColor, CardType } from '@/types/entities'

interface Props {
  note: Note
  compact?: boolean
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showActions: true,
})

const emit = defineEmits<{
  click: [id: string]
  edit: [id: string]
  archive: [id: string]
  delete: [id: string]
  pin: [id: string]
}>()

const colorClasses = computed(() => {
  const colors: Record<CardColor, string> = {
    yellow: 'bg-primary text-black',
    cyan: 'bg-secondary text-white',
    white: 'bg-white text-black',
    gray: 'bg-surfaceHighest text-white',
    dark: 'bg-surfaceLowest text-white',
  }
  return colors[props.note.card_color]
})

const truncatedContent = computed(() => {
  if (props.compact) {
    return props.note.content.slice(0, 50) + (props.note.content.length > 50 ? '...' : '')
  }
  return props.note.content.slice(0, 150) + (props.note.content.length > 150 ? '...' : '')
})

const formattedDate = computed(() => {
  const date = new Date(props.note.updated_at)
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
})
</script>

<template>
  <article
    :class="[
      'relative border-4 border-white rounded-none',
      'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
      compact ? 'p-4' : 'p-6',
      'hover:-translate-y-1 hover:-translate-x-1',
      'transition-all duration-200 cursor-pointer',
      note.is_pinned && 'ring-4 ring-primary ring-offset-4',
      colorClasses,
    ]"
    @click="emit('click', note.id)"
  >
    <!-- Pinned indicator -->
    <div
      v-if="note.is_pinned"
      class="absolute -top-2 -right-2 w-6 h-6 bg-primary border-2 border-white"
    >
      <span class="material-symbols-outlined text-xs text-black">push_pin</span>
    </div>

    <!-- Title -->
    <h3
      :class="[
        'font-headline font-black',
        compact ? 'text-lg' : 'text-xl',
        'uppercase tracking-tighter -skew-x-1 mb-2',
      ]"
    >
      {{ note.title }}
    </h3>

    <!-- Content preview -->
    <p
      v-if="!compact"
      class="font-body text-sm leading-relaxed opacity-80 mb-4"
    >
      {{ truncatedContent }}
    </p>

    <!-- Footer -->
    <div class="flex items-center justify-between">
      <!-- Tags -->
      <div
        v-if="note.tags.length > 0 && !compact"
        class="flex gap-1"
      >
        <span
          v-for="tag in note.tags.slice(0, 3)"
          :key="tag"
          class="px-2 py-0.5 bg-black/20 border border-current text-xs font-headline font-bold uppercase"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Date -->
      <span class="font-headline text-xs opacity-60">
        {{ formattedDate }}
      </span>
    </div>

    <!-- Actions -->
    <div
      v-if="showActions && !compact"
      class="absolute bottom-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity"
    >
      <button
        type="button"
        class="p-2 bg-black/20 border-2 border-current hover:bg-white/20 transition-colors"
        @click.stop="emit('pin', note.id)"
      >
        <span class="material-symbols-outlined text-sm">push_pin</span>
      </button>
      <button
        type="button"
        class="p-2 bg-black/20 border-2 border-current hover:bg-white/20 transition-colors"
        @click.stop="emit('edit', note.id)"
      >
        <span class="material-symbols-outlined text-sm">edit</span>
      </button>
      <button
        type="button"
        class="p-2 bg-black/20 border-2 border-current hover:bg-error transition-colors"
        @click.stop="emit('archive', note.id)"
      >
        <span class="material-symbols-outlined text-sm">archive</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>