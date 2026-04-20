<script setup lang="ts">
interface Props {
  canUndo?: boolean
  canRedo?: boolean
  isSaving?: boolean
  showSave?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  canUndo: false,
  canRedo: false,
  isSaving: false,
  showSave: true,
})

const emit = defineEmits<{
  close: []
  undo: []
  redo: []
  save: []
}>()
</script>

<template>
  <header
    class="bg-background flex justify-between items-center w-full px-6 py-4 border-b-4 border-white fixed top-0 left-0 z-50"
  >
    <!-- Left section -->
    <div class="flex items-center gap-4">
      <button
        type="button"
        class="neo-icon-btn text-white hover:skew-x-1 transition-transform duration-150"
        @click="emit('close')"
      >
        <span class="material-symbols-outlined text-2xl">close</span>
      </button>

      <h1
        class="font-headline font-black uppercase tracking-tighter text-primary -skew-x-2 text-xl italic"
      >
        KINETIC_NOTES
      </h1>
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-4">
      <!-- Undo -->
      <button
        type="button"
        :class="[
          'neo-icon-btn',
          canUndo ? 'text-white hover:skew-x-1' : 'text-white/30 cursor-not-allowed',
          'transition-transform duration-150',
        ]"
        :disabled="!canUndo"
        @click="emit('undo')"
      >
        <span class="material-symbols-outlined text-2xl">undo</span>
      </button>

      <!-- Redo -->
      <button
        type="button"
        :class="[
          'neo-icon-btn',
          canRedo ? 'text-white hover:skew-x-1' : 'text-white/30 cursor-not-allowed',
          'transition-transform duration-150',
        ]"
        :disabled="!canRedo"
        @click="emit('redo')"
      >
        <span class="material-symbols-outlined text-2xl">redo</span>
      </button>

      <!-- Save button -->
      <button
        v-if="showSave"
        type="button"
        :class="[
          'neo-btn-yellow',
          'flex items-center gap-2 px-4 py-2',
          'bg-primary text-black border-2 border-white',
          'font-headline font-bold uppercase text-xs',
          'hover:skew-x-1 hover:-translate-y-1 transition-all duration-150',
          isSaving && 'opacity-50 cursor-not-allowed',
        ]"
        :disabled="isSaving"
        @click="emit('save')"
      >
        <span
          v-if="isSaving"
          class="material-symbols-outlined text-sm animate-spin"
        >
          progress_activity
        </span>
        <span v-else class="material-symbols-outlined text-sm">save</span>
        <span v-if="!isSaving">SAVE</span>
        <span v-else>SAVING...</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.neo-icon-btn {
  transition: transform 150ms ease;
}

.neo-btn-yellow {
  transition: transform 150ms ease, box-shadow 150ms ease;
}
</style>