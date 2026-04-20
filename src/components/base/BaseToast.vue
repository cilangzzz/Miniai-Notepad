<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
  duration: 3000,
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(true)

const typeClasses: Record<string, string> = {
  success: 'bg-primary-container text-on-primary border-white',
  error: 'bg-error-container text-white border-white',
  warning: 'bg-secondary-container text-white border-white',
  info: 'bg-surface-container-high text-on-background border-white',
}

onMounted(() => {
  setTimeout(() => {
    visible.value = false
    emit('close')
  }, props.duration)
})
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="[
        'fixed top-24 left-1/2 -translate-x-1/2 z-[100]',
        'px-6 py-3 border-4 rounded-none',
        'font-headline font-bold uppercase text-sm',
        'shadow-neo-small',
        typeClasses[type],
      ]"
    >
      <span class="material-symbols-outlined mr-2 text-sm">
        {{ type === 'success' ? 'check_circle' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info' }}
      </span>
      {{ message }}
    </div>
  </Transition>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 200ms ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>