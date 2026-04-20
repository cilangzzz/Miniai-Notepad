<script setup lang="ts">
import { Editor } from '@tiptap/vue-3'

interface Props {
  editor: Editor | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function setLink() {
  if (!props.editor) return

  const previousUrl = props.editor.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) return
  if (url === '') {
    props.editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  props.editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}
</script>

<template>
  <div
    class="fixed bottom-0 left-0 w-full bg-surface-container-lowest border-t-4 border-white px-4 py-3 flex items-center gap-2 z-50 overflow-x-auto"
  >
    <!-- Close button -->
    <button
      type="button"
      class="p-2 text-white hover:text-primary-container border-2 border-white mr-2"
      @click="emit('close')"
    >
      <span class="material-symbols-outlined text-lg">close</span>
    </button>

    <!-- Separator -->
    <div class="w-1 h-6 bg-white/30" />

    <!-- Bold -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('bold') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      :disabled="!editor?.can().chain().focus().toggleBold().run()"
      @click="editor?.chain().focus().toggleBold().run()"
    >
      <span class="material-symbols-outlined text-lg">format_bold</span>
    </button>

    <!-- Italic -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('italic') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      :disabled="!editor?.can().chain().focus().toggleItalic().run()"
      @click="editor?.chain().focus().toggleItalic().run()"
    >
      <span class="material-symbols-outlined text-lg">format_italic</span>
    </button>

    <!-- Underline -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('underline') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
      @click="editor?.chain().focus().toggleUnderline().run()"
    >
      <span class="material-symbols-outlined text-lg">format_underlined</span>
    </button>

    <!-- Strike -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('strike') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      :disabled="!editor?.can().chain().focus().toggleStrike().run()"
      @click="editor?.chain().focus().toggleStrike().run()"
    >
      <span class="material-symbols-outlined text-lg">format_strikethrough</span>
    </button>

    <!-- Separator -->
    <div class="w-1 h-6 bg-white/30" />

    <!-- Heading 1 -->
    <button
      type="button"
      :class="[
        'px-2 py-1 font-headline font-bold text-sm transition-colors border-2 border-transparent',
        editor?.isActive('heading', { level: 1 }) ? 'bg-secondary-container text-white border-white' : 'text-white hover:text-primary-container',
      ]"
      @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      H1
    </button>

    <!-- Heading 2 -->
    <button
      type="button"
      :class="[
        'px-2 py-1 font-headline font-bold text-sm transition-colors border-2 border-transparent',
        editor?.isActive('heading', { level: 2 }) ? 'bg-secondary-container text-white border-white' : 'text-white hover:text-primary-container',
      ]"
      @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      H2
    </button>

    <!-- Separator -->
    <div class="w-1 h-6 bg-white/30" />

    <!-- Bullet list -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('bulletList') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      @click="editor?.chain().focus().toggleBulletList().run()"
    >
      <span class="material-symbols-outlined text-lg">format_list_bulleted</span>
    </button>

    <!-- Ordered list -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('orderedList') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      @click="editor?.chain().focus().toggleOrderedList().run()"
    >
      <span class="material-symbols-outlined text-lg">format_list_numbered</span>
    </button>

    <!-- Quote -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('blockquote') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      @click="editor?.chain().focus().toggleBlockquote().run()"
    >
      <span class="material-symbols-outlined text-lg">format_quote</span>
    </button>

    <!-- Separator -->
    <div class="w-1 h-6 bg-white/30" />

    <!-- Link -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('link') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      @click="setLink"
    >
      <span class="material-symbols-outlined text-lg">link</span>
    </button>

    <!-- Code -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors border-2 border-transparent',
        editor?.isActive('code') ? 'bg-primary-container text-on-primary border-white' : 'text-white hover:text-primary-container',
      ]"
      :disabled="!editor?.can().chain().focus().toggleCode().run()"
      @click="editor?.chain().focus().toggleCode().run()"
    >
      <span class="material-symbols-outlined text-lg">code</span>
    </button>

    <!-- Separator -->
    <div class="w-1 h-6 bg-white/30" />

    <!-- Undo -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors',
        editor?.can().chain().focus().undo().run() ? 'text-white hover:text-primary-container' : 'text-white/30',
      ]"
      :disabled="!editor?.can().chain().focus().undo().run()"
      @click="editor?.chain().focus().undo().run()"
    >
      <span class="material-symbols-outlined text-lg">undo</span>
    </button>

    <!-- Redo -->
    <button
      type="button"
      :class="[
        'p-2 transition-colors',
        editor?.can().chain().focus().redo().run() ? 'text-white hover:text-primary-container' : 'text-white/30',
      ]"
      :disabled="!editor?.can().chain().focus().redo().run()"
      @click="editor?.chain().focus().redo().run()"
    >
      <span class="material-symbols-outlined text-lg">redo</span>
    </button>
  </div>
</template>

<style scoped>
.font-headline {
  font-family: 'Space Grotesk', sans-serif;
}
</style>