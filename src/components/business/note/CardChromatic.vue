<script setup lang="ts">
import { computed } from 'vue'
import type { CardColor } from '@/types/entities'

interface Props {
  cardColor: CardColor
  fontWeight: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  colorChange: [color: CardColor]
  fontWeightChange: [weight: number]
}>()

const cardColors: { value: CardColor; bgClass: string; label: string }[] = [
  { value: 'yellow', bgClass: 'bg-primary', label: 'Gold' },
  { value: 'cyan', bgClass: 'bg-secondary', label: 'Teal' },
  { value: 'white', bgClass: 'bg-white', label: 'White' },
  { value: 'gray', bgClass: 'bg-surfaceHighest', label: 'Gray' },
]

const fontWeightOptions: { value: number; label: string }[] = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Normal' },
  { value: 600, label: 'SemiBold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'ExtraBold' },
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
  <section class="bg-surfaceHigh border-4 border-white p-6 relative">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Visuals
    </span>

    <!-- Title -->
    <h3 class="font-headline font-bold text-xl mb-4 text-primary italic">
      CARD_CHROMATIC
    </h3>

    <!-- Color picker -->
    <div class="mb-6">
      <p class="font-headline font-bold text-xs uppercase text-white/60 mb-4">
        Background Color
      </p>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="color in cardColors"
          :key="color.value"
          type="button"
          :class="[
            'aspect-square border-2 border-white',
            'hover:scale-110 transition-transform',
            'flex items-center justify-center',
            color.bgClass,
            cardColor === color.value ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
          ]"
          @click="emit('colorChange', color.value)"
        >
          <span
            v-if="cardColor === color.value"
            class="material-symbols-outlined text-sm"
            :class="color.value === 'yellow' || color.value === 'white' ? 'text-black' : 'text-white'"
          >
            check
          </span>
        </button>
      </div>
    </div>

    <!-- Font weight slider -->
    <div>
      <div class="flex justify-between text-xs font-headline font-bold uppercase mb-4">
        <span class="text-white/60">Typographic Weight</span>
        <span class="text-primary">{{ fontWeightLabel }}</span>
      </div>

      <div class="relative h-8">
        <!-- Track -->
        <div class="h-2 bg-white/20 w-full absolute top-1/2 -translate-y-1/2" />

        <!-- Thumb -->
        <div
          class="absolute h-6 w-6 bg-primary border-2 border-white top-1/2 -translate-y-1/2 cursor-grab transition-all"
          :style="{ left: fontWeightPosition }"
        />

        <!-- Markers -->
        <div class="absolute top-full mt-2 w-full flex justify-between">
          <span
            v-for="option in fontWeightOptions"
            :key="option.value"
            class="font-headline text-[8px] text-white/40 uppercase"
          >
            {{ option.label }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>