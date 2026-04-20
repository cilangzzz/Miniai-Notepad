<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCategories } from '@/composables/useCategories'
import { useTags } from '@/composables/useTags'
import CategoryCard from '@/components/business/category/CategoryCard.vue'
import TagCloud from '@/components/business/category/TagCloud.vue'
import StatsPanel from '@/components/business/category/StatsPanel.vue'
import TopAppBar from '@/components/common/TopAppBar.vue'
import BottomNavBar from '@/components/common/BottomNavBar.vue'
import NavigationDrawer from '@/components/common/NavigationDrawer.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const { categories, loading, loadCategories, selectCategory, activeCategory } = useCategories()
const { tags, loadTags, createTag, deleteTag } = useTags()

// State
const showCreateTagModal = ref(false)
const newTagName = ref('')
const selectedTagColor = ref('cyan')

// Stats computed
const stats = computed(() => ({
  totalNotes: categories.value.reduce((sum, cat) => sum + cat.note_count, 0),
  archivedNotes: 0,
  pinnedNotes: 0,
  categoryDistribution: new Map(categories.value.map(c => [c.name, c.note_count])),
  storageUsed: 67,
}))

// Handlers
function handleCategorySelect(categoryId: string) {
  selectCategory(categoryId)
  router.push(`/notes?category=${categoryId}`)
}

function handleTagSelect(tagId: string) {
  // Filter notes by tag
}

function handleTagCreate() {
  showCreateTagModal.value = true
}

function handleTagRemove(tagId: string) {
  deleteTag(tagId)
}

async function handleCreateTag() {
  if (newTagName.value.trim()) {
    await createTag({
      name: newTagName.value.trim(),
      color: selectedTagColor.value,
    })
    showCreateTagModal.value = false
    newTagName.value = ''
  }
}

function handleMenuClick() {
  // Toggle drawer
}

function handleSearchClick() {
  router.push('/archive')
}

const currentNav = 'categories'

onMounted(async () => {
  await loadCategories()
  await loadTags()
})
</script>

<template>
  <div class="categories-page min-h-screen bg-background">
    <!-- Top App Bar -->
    <TopAppBar
      @menu-click="handleMenuClick"
      @search-click="handleSearchClick"
    />

    <!-- Desktop Navigation Drawer -->
    <NavigationDrawer :visible="true" />

    <!-- Main Content -->
    <main class="pt-[72px] pb-[80px] px-4 md:px-12 md:ml-[288px]">
      <!-- Page Header -->
      <header class="mb-12">
        <h1 class="font-headline font-black text-4xl md:text-5xl text-primary uppercase tracking-tighter -skew-x-2">
          CATEGORIES
        </h1>
        <p class="font-headline font-bold text-sm text-white/60 uppercase mt-2">
          ORGANIZE YOUR THOUGHTS
        </p>
      </header>

      <!-- Category Grid -->
      <section class="mb-16">
        <h2 class="font-headline font-bold text-xs text-secondary uppercase tracking-widest mb-8">
          PRESET CATEGORIES
        </h2>
        <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <CategoryCard
            v-for="category in categories"
            :key="category.id"
            :category="category"
            :is-active="activeCategory === category.id"
            @select="handleCategorySelect"
          />
        </div>
      </section>

      <!-- Tag Cloud -->
      <section class="mb-16">
        <TagCloud
          :tags="tags"
          @select="handleTagSelect"
          @create="handleTagCreate"
          @remove="handleTagRemove"
        />
      </section>

      <!-- Stats Panel -->
      <section>
        <StatsPanel :stats="stats" />
      </section>
    </main>

    <!-- Create Tag Modal -->
    <BaseModal
      v-model:visible="showCreateTagModal"
      title="ADD NEW TAG"
    >
      <BaseInput
        v-model="newTagName"
        placeholder="Enter tag name..."
        :max-length="20"
      />

      <!-- Color picker -->
      <div class="flex gap-2 mt-4">
        <button
          v-for="color in ['yellow', 'cyan', 'white', 'gray']"
          :key="color"
          type="button"
          :class="[
            'w-10 h-10 border-2 border-white',
            color === 'yellow' ? 'bg-primary' : '',
            color === 'cyan' ? 'bg-secondary' : '',
            color === 'white' ? 'bg-white' : '',
            color === 'gray' ? 'bg-surfaceHighest' : '',
            selectedTagColor === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : '',
          ]"
          @click="selectedTagColor = color"
        />
      </div>

      <div class="flex justify-end gap-4 mt-6">
        <BaseButton variant="outline" @click="showCreateTagModal = false">
          CANCEL
        </BaseButton>
        <BaseButton variant="primary" @click="handleCreateTag">
          ADD
        </BaseButton>
      </div>
    </BaseModal>

    <!-- Mobile Bottom Navigation -->
    <BottomNavBar
      :active-id="currentNav"
      @navigate="(route) => router.push(route)"
    />
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>