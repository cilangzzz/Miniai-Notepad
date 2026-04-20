<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  visible: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  size: 'md',
  closable: true,
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  const sizes: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  }
  return sizes[props.size]
})

function close() {
  emit('update:visible', false)
  emit('close')
}
</script>

<template>
  <Transition name="modal">
    <div
      v-if="visible"
      class="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/80"
        @click="close"
      />

      <!-- Modal content -->
      <div
        :class="[
          'relative w-full',
          'bg-background border-4 border-white rounded-none',
          'shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
          sizeClasses,
        ]"
      >
        <!-- Header -->
        <header
          v-if="title || closable"
          class="flex items-center justify-between p-6 border-b-4 border-white"
        >
          <h2
            v-if="title"
            class="font-headline font-black text-xl uppercase text-primary -skew-x-2"
          >
            {{ title }}
          </h2>

          <button
            v-if="closable"
            type="button"
            class="text-white hover:text-primary transition-colors"
            @click="close"
          >
            <span class="material-symbols-outlined text-2xl">close</span>
          </button>
        </header>

        <!-- Body -->
        <div class="p-6">
          <slot />
        </div>

        <!-- Footer -->
        <footer
          v-if="$slots.footer"
          class="p-6 border-t-4 border-white"
        >
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 200ms ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateY(20px);
}
</style>