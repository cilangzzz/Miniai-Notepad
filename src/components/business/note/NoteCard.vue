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
    yellow: 'bg-primary-container text-on-primary',
    cyan: 'bg-secondary-container text-white',
    white: 'bg-white text-background',
    gray: 'bg-surface-container-high text-on-background',
    dark: 'bg-surface-container-lowest text-on-background',
  }
  return colors[props.note.card_color]
})

const shadowClass = computed(() => {
  if (props.note.card_color === 'yellow') return 'shadow-neo-black'
  if (props.note.card_color === 'cyan') return 'shadow-neo-black'
  return 'shadow-neo-black'
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

const tagRotation = computed(() => {
  const rotations = [-3, -2, -1, 0, 1, 2, 3]
  return rotations[Math.floor(Math.random() * rotations.length)]
})

// Card type specific styles
const cardTypeStyles = computed(() => {
  if (props.note.card_type === 'quote') {
    return 'flex flex-col justify-center items-center text-center p-8'
  }
  if (props.note.card_type === 'image') {
    return 'flex flex-col overflow-hidden p-0'
  }
  return 'p-6'
})
</script>

<template>
  <article
    :class="[
      'group relative border-4 border-white rounded-none',
      shadowClass,
      cardTypeStyles,
      'hover:-translate-y-1 hover:-translate-x-1',
      'transition-all duration-150 cursor-pointer',
      note.is_pinned && 'ring-4 ring-primary-container ring-offset-4',
      colorClasses,
    ]"
    @click="emit('click', note.id)"
  >
    <!-- Image card type -->
    <template v-if="note.card_type === 'image'">
      <div class="h-48 w-full bg-surface-container-high border-b-4 border-white">
        <img
          v-if="note.image_url"
          :src="note.image_url"
          class="w-full h-full object-cover grayscale contrast-125"
          alt=""
        />
      </div>
      <div class="p-6" :class="colorClasses.split(' ')[0]">
        <!-- Category tag -->
        <div class="flex justify-between items-start mb-4">
          <span
            class="bg-white text-background text-[10px] font-black uppercase px-2 py-1 border-2 border-background -rotate-1"
          >
            {{ note.category_id }}
          </span>
          <span class="text-white/60 text-xs font-bold">{{ formattedDate }}</span>
        </div>

        <h3 class="font-headline font-black text-2xl text-white mb-2 uppercase leading-tight">
          {{ note.title }}
        </h3>
        <p class="text-white/80 text-sm font-medium">{{ truncatedContent }}</p>
      </div>
    </template>

    <!-- Quote card type -->
    <template v-else-if="note.card_type === 'quote'">
      <span class="material-symbols-outlined text-background text-6xl mb-4">format_quote</span>
      <p class="text-xl font-headline font-black text-background uppercase tracking-tight italic mb-4">
        "{{ note.content.slice(0, 100) }}"
      </p>
      <span class="text-background/60 font-black text-xs">- {{ note.title }}</span>
    </template>

    <!-- Task card type -->
    <template v-else-if="note.card_type === 'task'">
      <!-- Category tag -->
      <div class="flex justify-between items-start mb-4">
        <span
          class="bg-secondary-container text-white text-[10px] font-black uppercase px-2 py-1 border-2 border-white -rotate-2"
        >
          {{ note.category_id }}
        </span>
        <span class="text-white/60 text-xs font-bold">{{ formattedDate }}</span>
      </div>

      <!-- Title -->
      <h3
        :class="[
          'font-headline font-black',
          compact ? 'text-lg' : 'text-2xl',
          'text-white uppercase tracking-tighter -skew-x-1 mb-3',
        ]"
      >
        {{ note.title }}
      </h3>

      <!-- Task items -->
      <ul class="text-white/90 text-sm space-y-2 font-bold italic">
        <li class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary-container">check_box</span>
          {{ note.content.split('\n')[0] }}
        </li>
        <li v-if="note.content.split('\n')[1]" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-white">check_box_outline_blank</span>
          {{ note.content.split('\n')[1] }}
        </li>
      </ul>
    </template>

    <!-- Default text card type -->
    <template v-else>
      <!-- Category tag -->
      <div class="flex justify-between items-start mb-4">
        <span
          class="bg-primary-container text-on-primary text-[10px] font-black uppercase px-2 py-1 border-2 border-white"
          :style="{ transform: `rotate(${tagRotation}deg)` }"
        >
          {{ note.category_id }}
        </span>
        <span class="text-white/60 text-xs font-bold">{{ formattedDate }}</span>
      </div>

      <!-- Pinned indicator -->
      <div
        v-if="note.is_pinned"
        class="absolute -top-2 -right-2 w-6 h-6 bg-primary-container border-2 border-white"
      >
        <span class="material-symbols-outlined text-xs text-on-primary">push_pin</span>
      </div>

      <!-- Title -->
      <h3
        :class="[
          'font-headline font-black',
          compact ? 'text-lg' : 'text-2xl',
          note.card_color === 'yellow' ? 'text-on-primary' : 'text-white',
          'uppercase tracking-tighter -skew-x-1 mb-3',
        ]"
      >
        {{ note.title }}
      </h3>

      <!-- Content preview -->
      <p
        v-if="!compact"
        class="font-body text-sm leading-relaxed opacity-80 mb-6"
      >
        {{ truncatedContent }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between">
        <!-- Tags -->
        <div
          v-if="note.tags.length > 0 && !compact"
          class="flex gap-2"
        >
          <span class="material-symbols-outlined text-primary-container">attach_file</span>
          <span v-if="note.tags.length > 1" class="material-symbols-outlined text-primary-container">image</span>
        </div>
      </div>

      <!-- Actions -->
      <div
        v-if="showActions && !compact"
        class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
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
          class="p-2 bg-black/20 border-2 border-current hover:bg-error-container transition-colors"
          @click.stop="emit('archive', note.id)"
        >
          <span class="material-symbols-outlined text-sm">archive</span>
        </button>
      </div>
    </template>
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