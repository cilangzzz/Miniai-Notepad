import { ref, computed, type Ref } from 'vue'

/**
 * 文本格式化工具封装
 * 提供Markdown风格的文本格式化功能
 */
export interface TextFormatOptions {
  /** 内容Ref */
  contentRef?: Ref<string>
  /** 是否使用Markdown格式 */
  useMarkdown?: boolean
}

export function useTextFormat(options: TextFormatOptions = {}) {
  const { contentRef, useMarkdown = true } = options

  // Selection state
  const selectionStart = ref(0)
  const selectionEnd = ref(0)
  const selectedText = ref('')

  /**
   * 更新选区信息
   */
  function updateSelection(start: number, end: number, text: string) {
    selectionStart.value = start
    selectionEnd.value = end
    selectedText.value = text
  }

  /**
   * 插入文本（在光标位置或替换选中内容）
   */
  function insertText(text: string): void {
    if (!contentRef) return

    const content = contentRef.value
    const start = selectionStart.value
    const end = selectionEnd.value

    const before = content.substring(0, start)
    const after = content.substring(end)

    contentRef.value = before + text + after

    // 更新光标位置到插入文本末尾
    selectionStart.value = start + text.length
    selectionEnd.value = start + text.length
  }

  /**
   * 包围选中文本
   */
  function wrapSelection(before: string, after: string): void {
    if (!contentRef) return

    const content = contentRef.value
    const start = selectionStart.value
    const end = selectionEnd.value

    const textBefore = content.substring(0, start)
    const selected = content.substring(start, end)
    const textAfter = content.substring(end)

    contentRef.value = textBefore + before + selected + after + textAfter

    // 如果有选中文本，光标移到包围文本末尾
    // 如果没有选中文本，光标保持在包围符号中间
    if (selected) {
      selectionStart.value = start + before.length + selected.length + after.length
      selectionEnd.value = selectionStart.value
    } else {
      selectionStart.value = start + before.length
      selectionEnd.value = start + before.length
    }
  }

  /**
   * 格式化为粗体
   */
  function formatBold(): void {
    if (useMarkdown) {
      wrapSelection('**', '**')
    } else {
      wrapSelection('<b>', '</b>')
    }
  }

  /**
   * 格式化为斜体
   */
  function formatItalic(): void {
    if (useMarkdown) {
      wrapSelection('*', '*')
    } else {
      wrapSelection('<i>', '</i>')
    }
  }

  /**
   * 格式化为删除线
   */
  function formatStrikethrough(): void {
    if (useMarkdown) {
      wrapSelection('~~', '~~')
    } else {
      wrapSelection('<s>', '</s>')
    }
  }

  /**
   * 格式化为代码
   */
  function formatCode(): void {
    if (useMarkdown) {
      // 如果选中的是多行，使用代码块
      if (selectedText.value.includes('\n')) {
        wrapSelection('\n```\n', '\n```\n')
      } else {
        wrapSelection('`', '`')
      }
    } else {
      wrapSelection('<code>', '</code>')
    }
  }

  /**
   * 格式化为链接
   */
  function formatLink(url: string = '', text: string = ''): void {
    if (!contentRef) return

    const linkText = text || selectedText.value || '链接文本'
    const linkUrl = url || 'https://'

    if (useMarkdown) {
      const markdownLink = `[${linkText}](${linkUrl})`
      insertText(markdownLink)
    } else {
      const htmlLink = `<a href="${linkUrl}">${linkText}</a>`
      insertText(htmlLink)
    }
  }

  /**
   * 格式化为图片
   */
  function formatImage(url: string = '', alt: string = ''): void {
    if (!contentRef) return

    const imageUrl = url || 'https://'
    const imageAlt = alt || selectedText.value || '图片描述'

    if (useMarkdown) {
      const markdownImage = `![${imageAlt}](${imageUrl})`
      insertText(markdownImage)
    } else {
      const htmlImage = `<img src="${imageUrl}" alt="${imageAlt}" />`
      insertText(htmlImage)
    }
  }

  /**
   * 插入无序列表项
   */
  function insertBulletList(): void {
    if (!contentRef) return

    const content = contentRef.value
    const start = selectionStart.value

    // 检查是否在行首
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const isAtLineStart = start === lineStart

    if (isAtLineStart) {
      insertText('- ')
    } else {
      insertText('\n- ')
    }
  }

  /**
   * 插入有序列表项
   */
  function insertNumberedList(): void {
    if (!contentRef) return

    const content = contentRef.value
    const start = selectionStart.value

    // 计算当前序号
    const linesBefore = content.substring(0, start).split('\n')
    let number = 1

    // 找到上一个有序列表项
    for (let i = linesBefore.length - 1; i >= 0; i--) {
      const line = linesBefore[i]
      const match = line.match(/^(\d+)\.\s/)
      if (match) {
        number = parseInt(match[1]) + 1
        break
      } else if (line.trim() && !line.match(/^[-*]\s/)) {
        // 非空行且不是列表项，重新开始计数
        number = 1
        break
      }
    }

    // 检查是否在行首
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const isAtLineStart = start === lineStart

    if (isAtLineStart) {
      insertText(`${number}. `)
    } else {
      insertText(`\n${number}. `)
    }
  }

  /**
   * 插入标题
   */
  function insertHeading(level: number = 1): void {
    if (!contentRef) return

    const prefix = '#'.repeat(Math.min(level, 6))
    const content = contentRef.value
    const start = selectionStart.value

    // 检查是否在行首
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const isAtLineStart = start === lineStart

    if (isAtLineStart) {
      insertText(`${prefix} `)
    } else {
      insertText(`\n${prefix} `)
    }
  }

  /**
   * 插入分割线
   */
  function insertDivider(): void {
    if (!contentRef) return

    if (useMarkdown) {
      insertText('\n---\n')
    } else {
      insertText('\n<hr />\n')
    }
  }

  /**
   * 插入引用块
   */
  function insertQuote(): void {
    if (!contentRef) return

    const content = contentRef.value
    const start = selectionStart.value

    // 检查是否在行首
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const isAtLineStart = start === lineStart

    if (isAtLineStart) {
      insertText('> ')
    } else {
      insertText('\n> ')
    }
  }

  /**
   * 插入复选框
   */
  function insertCheckbox(checked: boolean = false): void {
    if (!contentRef) return

    const checkbox = checked ? '- [x] ' : '- [ ] '

    const content = contentRef.value
    const start = selectionStart.value

    // 检查是否在行首
    const lineStart = content.lastIndexOf('\n', start - 1) + 1
    const isAtLineStart = start === lineStart

    if (isAtLineStart) {
      insertText(checkbox)
    } else {
      insertText('\n' + checkbox)
    }
  }

  /**
   * 清除格式
   */
  function clearFormat(): void {
    if (!contentRef || !selectedText.value) return

    // 移除Markdown格式标记
    let cleared = selectedText.value

    // 粗体
    cleared = cleared.replace(/\*\*(.*?)\*\*/g, '$1')
    // 斜体
    cleared = cleared.replace(/\*(.*?)\*/g, '$1')
    // 删除线
    cleared = cleared.replace(/~~(.*?)~~/g, '$1')
    // 代码
    cleared = cleared.replace(/`([^`]+)`/g, '$1')
    // 链接
    cleared = cleared.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    insertText(cleared)
  }

  return {
    // Selection state
    selectionStart,
    selectionEnd,
    selectedText,
    updateSelection,

    // Format actions
    insertText,
    wrapSelection,
    formatBold,
    formatItalic,
    formatStrikethrough,
    formatCode,
    formatLink,
    formatImage,
    insertBulletList,
    insertNumberedList,
    insertHeading,
    insertDivider,
    insertQuote,
    insertCheckbox,
    clearFormat,
  }
}

/**
 * 文本统计工具
 */
export function useTextStats(content: Ref<string>) {
  /**
   * 字符数（不含空格）
   */
  const charCount = computed(() => {
    return content.value.replace(/\s/g, '').length
  })

  /**
   * 字符数（含空格）
   */
  const charCountWithSpaces = computed(() => {
    return content.value.length
  })

  /**
   * 单词数
   */
  const wordCount = computed(() => {
    const text = content.value.trim()
    if (!text) return 0

    // 中文按字符计算，英文按单词计算
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || []
    const englishWords = text.match(/[a-zA-Z]+/g) || []

    return chineseChars.length + englishWords.length
  })

  /**
   * 行数
   */
  const lineCount = computed(() => {
    if (!content.value) return 0
    return content.value.split('\n').length
  })

  /**
   * 段落数
   */
  const paragraphCount = computed(() => {
    if (!content.value.trim()) return 0
    return content.value.split(/\n\s*\n/).filter(p => p.trim()).length
  })

  /**
   * 预估阅读时间（分钟）
   */
  const readingTime = computed(() => {
    // 平均阅读速度：中文约400字/分钟，英文约200词/分钟
    const minutes = Math.ceil(wordCount.value / 400)
    return Math.max(1, minutes)
  })

  return {
    charCount,
    charCountWithSpaces,
    wordCount,
    lineCount,
    paragraphCount,
    readingTime,
  }
}