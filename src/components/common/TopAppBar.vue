<script setup lang="ts">
interface Props {
  title?: string
  showMenu?: boolean
  showSearch?: boolean
  showAvatar?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'KINETIC_NOTES',
  showMenu: true,
  showSearch: true,
  showAvatar: true,
})

const emit = defineEmits<{
  menuClick: []
  searchClick: []
  avatarClick: []
}>()
</script>

<template>
  <header
    class="bg-background border-b-4 border-white flex justify-between items-center w-full h-[80px] px-6 py-4 fixed top-0 left-0 right-0 z-50"
  >
    <!-- Left: Menu + Logo -->
    <div class="flex items-center gap-4">
      <button
        v-if="showMenu"
        type="button"
        class="text-white hover:skew-x-1 transition-transform duration-150"
        @click="emit('menuClick')"
      >
        <span class="material-symbols-outlined text-3xl">menu</span>
      </button>

      <h1
        class="text-2xl font-black italic text-primary-container -skew-x-2 font-headline uppercase tracking-tighter"
      >
        {{ title }}
      </h1>
    </div>

    <!-- Right: Search + Avatar -->
    <div class="flex items-center gap-4">
      <button
        v-if="showSearch"
        type="button"
        class="text-white hover:skew-x-1 transition-transform duration-150"
        @click="emit('searchClick')"
      >
        <span class="material-symbols-outlined text-3xl">search</span>
      </button>

      <button
        v-if="showAvatar"
        type="button"
        class="w-10 h-10 bg-secondary-container border-2 border-white flex items-center justify-center overflow-hidden"
        @click="emit('avatarClick')"
      >
        <span class="material-symbols-outlined text-white">person</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>