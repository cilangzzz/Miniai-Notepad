<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor, FontWeight } from '@/types/entities'

interface Props {
  cardColor: CardColor
  fontWeight: FontWeight
}

const props = defineProps<Props>()

const emit = defineEmits<{
  colorChange: [color: CardColor]
  fontWeightChange: [weight: FontWeight]
}>()

const cardColors: { value: CardColor; bgClass: string; label: string }[] = [
  { value: 'yellow', bgClass: 'bg-primary-container', label: 'Gold' },
  { value: 'cyan', bgClass: 'bg-secondary-container', label: 'Teal' },
  { value: 'white', bgClass: 'bg-white', label: 'White' },
  { value: 'gray', bgClass: 'bg-surface-container-highest', label: 'Gray' },
]

const fontWeightOptions: { value: FontWeight; label: string }[] = [
  { value: 'normal', label: 'Light' },
  { value: 'medium', label: 'Medium' },
  { value: 'bold', label: 'Bold' },
  { value: 'extrabold', label: 'ExtraBold' },
]

const fontWeightPosition = computed(() => {
  const index = fontWeightOptions.findIndex(o => o.value === props.fontWeight)
  return `${(index / (fontWeightOptions.length - 1)) * 100}%`
})

const fontWeightLabel = computed(() => {
  const option = fontWeightOptions.find(o => o.value === props.fontWeight)
  return option?.label || 'Bold'
})
</script>

<template>
  <section class="bg-surface-container-high border-4 border-white p-6 relative">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary-container text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Visuals
    </span>

    <!-- Title -->
    <h3 class="font-headline font-bold text-xl mb-4 text-primary-container italic">
      CARD_CHROMATIC
    </h3>

    <!-- Color picker -->
    <div class="grid grid-cols-4 gap-2">
      <button
        v-for="color in cardColors"
        :key="color.value"
        type="button"
        :class="[
          'aspect-square border-2 border-white rounded-none',
          'hover:scale-110 transition-transform',
          'flex items-center justify-center',
          color.bgClass,
          cardColor === color.value ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-background' : '',
        ]"
        @click="emit('colorChange', color.value)"
      >
        <span
          v-if="cardColor === color.value"
          class="material-symbols-outlined text-sm"
          :class="color.value === 'yellow' || color.value === 'white' ? 'text-on-primary' : 'text-white'"
        >
          check
        </span>
      </button>
    </div>

    <!-- Font weight slider -->
    <div class="mt-6">
      <div class="flex justify-between text-[10px] font-headline font-bold uppercase mb-2">
        <span class="text-white/60">Typographic Weight</span>
        <span class="text-primary-container">{{ fontWeightLabel }}</span>
      </div>

      <div class="h-1 bg-white/20 w-full relative">
        <div
          class="absolute h-4 w-4 bg-primary-container border-2 border-white top-1/2 -translate-y-1/2 cursor-grab transition-all rounded-none"
          :style="{ left: fontWeightPosition }"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>