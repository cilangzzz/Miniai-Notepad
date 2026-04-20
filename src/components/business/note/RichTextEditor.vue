<script setup lang="ts">
import { computed, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

interface Props {
  modelValue: string
  maxLength?: number
  minHeight?: number
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  maxLength: 5000,
  minHeight: 400,
  placeholder: 'Begin typing the next big thing here...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
}>()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      bulletList: {
        keepMarks: true,
      },
      orderedList: {
        keepMarks: true,
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary-container underline',
      },
    }),
    Underline,
  ],
  editorProps: {
    attributes: {
      class: 'tiptap-editor prose prose-invert max-w-none focus:outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
  },
})

// Sync external changes to editor
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && editor.value.getHTML() !== newValue) {
      editor.value.commands.setContent(newValue)
    }
  }
)

// Character count (text only, excluding HTML tags)
const characterCount = computed(() => {
  if (!editor.value) return 0
  return editor.value.getText().length
})

const isOverLimit = computed(() => characterCount.value > props.maxLength)

// Editor instance for toolbar access
defineExpose({
  editor,
})
</script>

<template>
  <div class="relative flex-grow">
    <!-- Badge -->
    <span
      class="absolute -top-3 -left-2 bg-secondary-container text-white font-headline font-bold text-[10px] uppercase px-2 py-0.5 border border-white z-10"
    >
      Manuscript
    </span>

    <!-- Editor container -->
    <div
      :style="{ minHeight: `${minHeight}px` }"
      :class="[
        'w-full bg-surface-container-lowest border-4 border-white p-6 rounded-none',
        'focus-within:border-primary-container',
        isOverLimit && 'border-error-container focus-within:border-error-container',
      ]"
    >
      <EditorContent
        :editor="editor"
        class="tiptap-content"
      />
    </div>

    <!-- Character count -->
    <div
      class="absolute bottom-2 right-4 font-headline text-xs"
      :class="isOverLimit ? 'text-error-container' : 'text-surface-container-highest'"
    >
      {{ characterCount }} / {{ maxLength }}
    </div>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}

.tiptap-content {
  min-height: 350px;
}

.tiptap-content :deep(.tiptap-editor) {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  line-height: 1.75;
  color: #e2e2e2;
}

.tiptap-content :deep(.tiptap-editor p) {
  margin: 0.5em 0;
}

.tiptap-content :deep(.tiptap-editor p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #666666;
  pointer-events: none;
  height: 0;
}

.tiptap-content :deep(.tiptap-editor h1) {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: #ffd700;
  margin: 1em 0 0.5em;
  text-transform: uppercase;
}

.tiptap-content :deep(.tiptap-editor h2) {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0.8em 0 0.4em;
  text-transform: uppercase;
}

.tiptap-content :deep(.tiptap-editor h3) {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #007f7f;
  margin: 0.6em 0 0.3em;
}

.tiptap-content :deep(.tiptap-editor ul),
.tiptap-content :deep(.tiptap-editor ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.tiptap-content :deep(.tiptap-editor li) {
  margin: 0.25em 0;
}

.tiptap-content :deep(.tiptap-editor li::marker) {
  color: #ffd700;
}

.tiptap-content :deep(.tiptap-editor blockquote) {
  border-left: 4px solid #ffd700;
  padding-left: 1em;
  margin: 0.5em 0;
  color: #e2e2e2;
  font-style: italic;
}

.tiptap-content :deep(.tiptap-editor a) {
  color: #ffd700;
  text-decoration: underline;
}

.tiptap-content :deep(.tiptap-editor a:hover) {
  color: #007f7f;
}

.tiptap-content :deep(.tiptap-editor code) {
  background: #353535;
  color: #ffd700;
  padding: 0.2em 0.4em;
  border-radius: 0;
  font-family: monospace;
}

.tiptap-content :deep(.tiptap-editor hr) {
  border: none;
  border-top: 2px solid #ffd700;
  margin: 1em 0;
}

.tiptap-content :deep(.tiptap-editor strong) {
  color: #ffd700;
  font-weight: 700;
}

.tiptap-content :deep(.tiptap-editor em) {
  font-style: italic;
}

.tiptap-content :deep(.tiptap-editor u) {
  text-decoration: underline;
}

.tiptap-content :deep(.tiptap-editor s) {
  text-decoration: line-through;
  color: #666666;
}
</style>