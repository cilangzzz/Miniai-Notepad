<script setup lang="ts">
const emit = defineEmits<{
  bold: []
  italic: []
  list: []
  image: []
  link: []
}>()
</script>

<template>
  <div
    class="md:hidden fixed bottom-0 left-0 w-full bg-stone-950 border-t-4 border-white px-6 py-4 flex justify-between items-center z-50"
  >
    <!-- Bold -->
    <button
      type="button"
      class="p-2 text-white hover:text-primary transition-colors"
      @click="emit('bold')"
    >
      <span class="material-symbols-outlined text-xl">format_bold</span>
    </button>

    <!-- Italic -->
    <button
      type="button"
      class="p-2 text-white hover:text-primary transition-colors"
      @click="emit('italic')"
    >
      <span class="material-symbols-outlined text-xl">format_italic</span>
    </button>

    <!-- List -->
    <button
      type="button"
      class="p-2 text-white hover:text-primary transition-colors"
      @click="emit('list')"
    >
      <span class="material-symbols-outlined text-xl">format_list_bulleted</span>
    </button>

    <!-- Image -->
    <button
      type="button"
      class="p-2 text-white hover:text-primary transition-colors"
      @click="emit('image')"
    >
      <span class="material-symbols-outlined text-xl">image</span>
    </button>

    <!-- Link -->
    <button
      type="button"
      class="p-2 text-white hover:text-primary transition-colors"
      @click="emit('link')"
    >
      <span class="material-symbols-outlined text-xl">link</span>
    </button>
  </div>
</template>