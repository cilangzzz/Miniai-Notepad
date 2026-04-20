<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotes } from '@/composables/useNotes'
import { useCategories } from '@/composables/useCategories'
import { useTags } from '@/composables/useTags'
import { useEditorHistory } from '@/composables/useEditorHistory'
import { useTextFormat } from '@/composables/useTextFormat'
import { useResponsive } from '@/composables/useResponsive'
import { useToast } from '@/composables/useToast'
import EditorToolbar from '@/components/business/note/EditorToolbar.vue'
import TitleEditor from '@/components/business/note/TitleEditor.vue'
import ContentEditor from '@/components/business/note/ContentEditor.vue'
import TaxonomyPanel from '@/components/business/note/TaxonomyPanel.vue'
import ReminderPanel from '@/components/business/note/ReminderPanel.vue'
import CardChromatic from '@/components/business/note/CardChromatic.vue'
import SaveFAB from '@/components/business/note/SaveFAB.vue'
import MobileToolbar from '@/components/business/note/MobileToolbar.vue'
import type { Note, CardColor } from '@/types/entities'

const router = useRouter()
const route = useRoute()
const { isMobile } = useResponsive()
const { showToast } = useToast()
const { notes, createNote, updateNote, fetchNoteById } = useNotes()
const { categories } = useCategories()
const { tags } = useTags()

// Note draft data
const noteDraft = ref({
  title: '',
  content: '',
  category_id: 'cat-tasks',
  tags: [] as string[],
  card_type: 'text' as 'text' | 'image' | 'task' | 'quote',
  card_color: 'yellow' as CardColor,
  font_weight: 700,
  is_pinned: false,
  reminder_at: undefined as number | undefined,
})

// State
const isSaving = ref(false)
const isNewNote = computed(() => !route.params.id || route.params.id === 'new')
const lastEditedTime = ref('Just now')

// Editor history
const { history, canUndo, canRedo, pushState, undo, redo, reset } = useEditorHistory(noteDraft.value)

// Validation
const isValid = computed(() =>
  noteDraft.value.title.trim().length > 0 &&
  noteDraft.value.content.trim().length > 0
)

// Load existing note
onMounted(async () => {
  if (!isNewNote.value && route.params.id) {
    const note = await fetchNoteById(route.params.id as string)
    if (note) {
      noteDraft.value = {
        title: note.title,
        content: note.content,
        category_id: note.category_id,
        tags: note.tags,
        card_type: note.card_type,
        card_color: note.card_color,
        font_weight: 700,
        is_pinned: note.is_pinned,
        reminder_at: note.reminder_at,
      }
      reset(noteDraft.value)
    }
  }
})

// Auto-save to history
watch(noteDraft, (newDraft) => {
  pushState(newDraft)
}, { deep: true })

// Text format
const { insertBold, insertItalic, insertList, insertImage, insertLink } = useTextFormat(computed(() => noteDraft.value.content))

// Handlers
function handleClose() {
  if (!isValid.value) {
    router.push('/notes')
    return
  }
  router.push('/notes')
}

async function handleSave() {
  if (!isValid.value || isSaving.value) return

  isSaving.value = true
  try {
    if (isNewNote.value) {
      await createNote(noteDraft.value)
      showToast('Note created successfully', 'success')
    } else {
      await updateNote(route.params.id as string, noteDraft.value)
      showToast('Note updated successfully', 'success')
    }
    router.push('/notes')
  } catch (error) {
    showToast('Failed to save note', 'error')
  } finally {
    isSaving.value = false
  }
}

function handleUndo() {
  undo()
  noteDraft.value = history.value.present
}

function handleRedo() {
  redo()
  noteDraft.value = history.value.present
}

function handleAddTag(tagName: string) {
  if (!noteDraft.value.tags.includes(tagName)) {
    noteDraft.value.tags.push(tagName)
  }
}

function handleRemoveTag(tagId: string) {
  noteDraft.value.tags = noteDraft.value.tags.filter(id => id !== tagId)
}

function handleColorChange(color: CardColor) {
  noteDraft.value.card_color = color
}

function handleFontWeightChange(weight: number) {
  noteDraft.value.font_weight = weight
}

function handleSetReminder() {
  // Show date picker modal
}

// Apply text formatting
function applyBold() {
  insertBold()
}

function applyItalic() {
  insertItalic()
}

function applyList() {
  insertList()
}

function applyImage() {
  insertImage()
}

function applyLink() {
  insertLink()
}

// Available tags
const availableTags = computed(() => tags.value.map(t => ({
  id: t.id,
  name: t.name,
  color: t.color,
  rotation: t.rotation,
})))
</script>

<template>
  <div class="edit-note-page min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-black">
    <!-- Editor Toolbar -->
    <EditorToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :is-saving="isSaving"
      @close="handleClose"
      @undo="handleUndo"
      @redo="handleRedo"
      @save="handleSave"
    />

    <!-- Main Content -->
    <main class="pt-24 pb-32 px-4 md:px-12 max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Left: Editors -->
        <div class="lg:col-span-8 flex flex-col gap-6">
          <TitleEditor
            v-model="noteDraft.title"
            :max-length="50"
            placeholder="THE UNTITLED MANIFESTO..."
          />
          <ContentEditor
            v-model="noteDraft.content"
            :max-length="5000"
            :min-height="400"
            placeholder="Begin typing the next big thing here..."
          />
        </div>

        <!-- Right: Sidebar (Desktop) -->
        <aside v-if="!isMobile" class="lg:col-span-4 flex flex-col gap-8">
          <TaxonomyPanel
            :tags="availableTags"
            :selected-ids="noteDraft.tags"
            @select="handleAddTag"
            @create="() => {}"
            @remove="handleRemoveTag"
          />
          <ReminderPanel
            :tags="noteDraft.tags"
            :last-edited="lastEditedTime"
            @set-reminder="handleSetReminder"
          />
          <CardChromatic
            :card-color="noteDraft.card_color"
            :font-weight="noteDraft.font_weight"
            @color-change="handleColorChange"
            @font-weight-change="handleFontWeightChange"
          />
        </aside>
      </div>
    </main>

    <!-- Save FAB -->
    <SaveFAB
      :is-saving="isSaving"
      :is-valid="isValid"
      @save="handleSave"
    />

    <!-- Mobile Toolbar -->
    <MobileToolbar
      v-if="isMobile"
      @bold="applyBold"
      @italic="applyItalic"
      @list="applyList"
      @image="applyImage"
      @link="applyLink"
    />
  </div>
</template>