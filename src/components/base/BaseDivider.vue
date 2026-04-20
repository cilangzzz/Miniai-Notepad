<script setup lang="ts">
interface Props {
  color?: 'gold' | 'white' | 'teal' | 'gray'
  thickness?: 'thin' | 'normal' | 'thick'
  vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'white',
  thickness: 'normal',
  vertical: false,
})

const colorClasses: Record<string, string> = {
  gold: 'bg-primary',
  white: 'bg-white',
  teal: 'bg-secondary',
  gray: 'bg-surfaceHighest',
}

const thicknessClasses: Record<string, string> = {
  thin: 'h-1',
  normal: 'h-2',
  thick: 'h-4',
}

const verticalClasses: Record<string, string> = {
  thin: 'w-1',
  normal: 'w-2',
  thick: 'w-4',
}
</script>

<template>
  <div
    :class="[
      'rounded-none',
      colorClasses[color],
      props.vertical
        ? verticalClasses[props.thickness]
        : thicknessClasses[props.thickness],
      !props.vertical && 'w-full',
      props.vertical && 'h-full',
    ]"
  />
</template>