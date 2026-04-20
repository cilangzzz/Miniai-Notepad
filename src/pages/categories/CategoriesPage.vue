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
const { tags, fetchTags, createTag, deleteTag } = useTags()

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
  await fetchTags()
})
</script>

<template>
  <div class="categories-page min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-black flex flex-col md:flex-row">
    <!-- Navigation Drawer (Sidebar for Web) -->
    <NavigationDrawer :visible="true" />

    <div class="flex-1 flex flex-col min-h-screen">
      <!-- TopAppBar -->
      <TopAppBar
        @menu-click="handleMenuClick"
        @search-click="handleSearchClick"
      />

      <!-- Main Content -->
      <main class="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full md:ml-80">
        <!-- Hero Header -->
        <section class="mb-16">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span class="bg-secondary-container text-white px-4 py-1 font-headline font-bold text-sm mb-4 inline-block border-2 border-white rounded-none uppercase">
                Organization Center
              </span>
              <h2 class="text-6xl md:text-8xl font-black font-headline leading-none tracking-tighter text-white uppercase italic -skew-x-2">
                Tags & <br /><span class="text-primary-container">Labels</span>
              </h2>
            </div>
            <div class="flex gap-4">
              <button
                type="button"
                class="bg-white text-black p-4 font-black font-headline border-4 border-white shadow-neo-gold hover:-translate-y-1 hover:-translate-x-1 transition-all active:translate-y-0 active:translate-x-0 rounded-none uppercase"
              >
                NEW TAG
              </button>
            </div>
          </div>
        </section>

        <!-- Grid Content -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <!-- Category Management (Left Col) -->
          <div class="lg:col-span-5 flex flex-col gap-8">
            <!-- Active Categories -->
            <div class="bg-surface-container-high border-4 border-white p-8 relative">
              <div class="absolute -top-6 -left-2 bg-secondary-container border-2 border-white px-4 py-1 font-headline font-black text-white rounded-none uppercase">
                Active Categories
              </div>
              <div class="space-y-4 mt-4">
                <!-- Category Item -->
                <div
                  v-for="cat in categories"
                  :key="cat.id"
                  class="flex items-center justify-between p-4 bg-surface-container-lowest border-2 border-white hover:border-primary-container transition-colors group cursor-pointer"
                  @click="handleCategorySelect(cat.id)"
                >
                  <div class="flex items-center gap-4">
                    <span class="material-symbols-outlined text-primary-container">{{ cat.icon }}</span>
                    <span class="font-headline font-extrabold text-xl uppercase">{{ cat.name }}</span>
                  </div>
                  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="p-2 hover:bg-surface-container-highest">
                      <span class="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button class="p-2 hover:bg-error-container">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Panel -->
            <StatsPanel :stats="stats" />
          </div>

          <!-- Tag Cloud (Right Col) -->
          <div class="lg:col-span-7">
            <TagCloud
              :tags="tags"
              :editable="true"
              @select="handleTagSelect"
              @create="handleTagCreate"
              @remove="handleTagRemove"
            />
          </div>
        </div>
      </main>

      <!-- Mobile Bottom Navigation -->
      <BottomNavBar
        :active-id="currentNav"
        @navigate="(route) => router.push(route)"
      />
    </div>

    <!-- Background Decoration -->
    <div class="fixed top-20 right-20 -z-10 pointer-events-none opacity-10 rotate-12">
      <span class="material-symbols-outlined text-[300px]">sell</span>
    </div>
    <div class="fixed bottom-20 left-1/2 -z-10 pointer-events-none opacity-5 -rotate-6">
      <span class="material-symbols-outlined text-[400px]">category</span>
    </div>

    <!-- Create Tag Modal -->
    <BaseModal
      v-model:visible="showCreateTagModal"
      title="ADD NEW TAG"
    >
      <BaseInput
        v-model="newTagName"
        placeholder="Enter tag name..."
        :max-length="20"
        badge="Tag Name"
      />

      <!-- Color picker -->
      <div class="flex gap-2 mt-4">
        <button
          v-for="color in ['yellow', 'cyan', 'white', 'gray']"
          :key="color"
          type="button"
          :class="[
            'w-10 h-10 border-2 border-white rounded-none',
            color === 'yellow' ? 'bg-primary-container' : '',
            color === 'cyan' ? 'bg-secondary-container' : '',
            color === 'white' ? 'bg-white' : '',
            color === 'gray' ? 'bg-surface-container-highest' : '',
            selectedTagColor === color ? 'ring-2 ring-primary-container ring-offset-2 ring-offset-background' : '',
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
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
.font-body {
  font-family: 'Manrope', sans-serif;
}
</style>