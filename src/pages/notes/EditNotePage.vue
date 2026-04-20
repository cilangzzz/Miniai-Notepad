<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNotes } from '@/composables/useNotes'
import { useTags } from '@/composables/useTags'
import { useResponsive } from '@/composables/useResponsive'
import { useToast } from '@/composables/useToast'
import EditorToolbar from '@/components/business/note/EditorToolbar.vue'
import TitleEditor from '@/components/business/note/TitleEditor.vue'
import RichTextEditor from '@/components/business/note/RichTextEditor.vue'
import RichTextToolbar from '@/components/business/note/RichTextToolbar.vue'
import TaxonomyPanel from '@/components/business/note/TaxonomyPanel.vue'
import ReminderPanel from '@/components/business/note/ReminderPanel.vue'
import CardChromatic from '@/components/business/note/CardChromatic.vue'
import SaveFAB from '@/components/business/note/SaveFAB.vue'
import type { CardColor } from '@/types/entities'

const router = useRouter()
const route = useRoute()
const { isMobile } = useResponsive()
const toast = useToast()
const { createNote, updateNote, fetchNoteById } = useNotes()
const { tags } = useTags()

// Note draft data
const noteDraft = ref({
  title: '',
  content: '',
  category_id: 'cat-tasks',
  tags: [] as string[],
  card_type: 'text' as 'text' | 'image' | 'task' | 'quote',
  card_color: 'yellow' as CardColor,
  font_weight: 'normal' as 'normal' | 'medium' | 'bold' | 'extrabold',
  is_pinned: false,
  reminder_at: undefined as number | undefined,
})

// State
const isSaving = ref(false)
const isNewNote = computed(() => !route.params.id || route.params.id === 'new')
const lastEditedTime = ref('Just now')
const richTextEditorRef = ref<InstanceType<typeof RichTextEditor> | null>(null)

// Editor instance for toolbar
const editorInstance = computed(() => richTextEditorRef.value?.editor ?? null)

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
        font_weight: 'bold' as 'normal' | 'medium' | 'bold' | 'extrabold',
        is_pinned: note.is_pinned,
        reminder_at: note.reminder_at,
      }
    }
  }
})

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
      toast.success('Note created successfully')
    } else {
      await updateNote(route.params.id as string, noteDraft.value)
      toast.success('Note updated successfully')
    }
    router.push('/notes')
  } catch (error) {
    toast.error('Failed to save note')
  } finally {
    isSaving.value = false
  }
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

function handleFontWeightChange(weight: 'normal' | 'medium' | 'bold' | 'extrabold') {
  noteDraft.value.font_weight = weight
}

function handleSetReminder() {
  // Show date picker modal
}

function handleCloseToolbar() {
  router.push('/notes')
}

// Available tags - simplified for display
const availableTags = computed(() => tags.value)
</script>

<template>
  <div class="edit-note-page min-h-screen bg-background text-on-background font-body selection:bg-primary-container selection:text-black">
    <!-- Editor Toolbar -->
    <EditorToolbar
      :can-undo="editorInstance?.can().undo() ?? false"
      :can-redo="editorInstance?.can().redo() ?? false"
      :is-saving="isSaving"
      @close="handleClose"
      @undo="editorInstance?.chain().focus().undo().run()"
      @redo="editorInstance?.chain().focus().redo().run()"
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
          <RichTextEditor
            ref="richTextEditorRef"
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
    <RichTextToolbar
      v-if="isMobile"
      :editor="editorInstance"
      @close="handleCloseToolbar"
    />
  </div>
</template>