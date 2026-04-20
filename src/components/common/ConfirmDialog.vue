<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  visible?: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: 'Confirm Action',
  message: 'Are you sure you want to proceed?',
  confirmLabel: 'CONFIRM',
  cancelLabel: 'CANCEL',
  danger: false,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  confirm: []
  cancel: []
}>()

const localVisible = ref(props.visible)

watch(() => props.visible, (val) => {
  localVisible.value = val
})

const confirmClasses = computed(() => {
  if (props.danger) {
    return 'bg-error text-white border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
  }
  return 'bg-primary text-black border-4 border-white shadow-[6px_6px_0px_0px_rgba(0,127,127,1)]'
})

function handleConfirm() {
  emit('confirm')
  emit('update:visible', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:visible', false)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Transition name="modal">
    <div
      v-if="localVisible"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/80"
        @click="handleCancel"
      />

      <!-- Dialog -->
      <div
        class="relative w-full max-w-md bg-background border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        <!-- Header -->
        <header class="p-6 border-b-4 border-white">
          <h2
            class="font-headline font-black text-xl uppercase text-primary -skew-x-2"
          >
            {{ title }}
          </h2>
        </header>

        <!-- Body -->
        <div class="p-6">
          <p class="font-body text-base text-white">
            {{ message }}
          </p>
        </div>

        <!-- Footer -->
        <footer class="p-6 border-t-4 border-white flex justify-end gap-4">
          <button
            type="button"
            class="px-4 py-2 bg-transparent text-white border-2 border-white font-headline font-bold uppercase text-sm hover:bg-surfaceHigh transition-colors"
            @click="handleCancel"
          >
            {{ cancelLabel }}
          </button>

          <button
            type="button"
            :class="[
              'px-4 py-2 font-headline font-bold uppercase text-sm',
              'hover:-translate-y-1 hover:-translate-x-1 transition-all',
              confirmClasses,
            ]"
            @click="handleConfirm"
          >
            {{ confirmLabel }}
          </button>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>