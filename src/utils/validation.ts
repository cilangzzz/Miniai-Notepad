import { CHAR_LIMITS } from '../constants'

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * 验证笔记标题
 * @param title - 标题内容
 */
export function validateNoteTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: '标题不能为空' }
  }
  if (title.length > CHAR_LIMITS.NOTE_TITLE_MAX) {
    return { valid: false, error: `标题不能超过${CHAR_LIMITS.NOTE_TITLE_MAX}字符` }
  }
  return { valid: true }
}

/**
 * 验证笔记内容
 * @param content - 内容
 */
export function validateNoteContent(content: string): ValidationResult {
  if (content.length > CHAR_LIMITS.NOTE_CONTENT_MAX) {
    return { valid: false, error: `内容不能超过${CHAR_LIMITS.NOTE_CONTENT_MAX}字符` }
  }
  return { valid: true }
}

/**
 * 验证分类名称
 * @param name - 分类名称
 */
export function validateCategoryName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: '分类名称不能为空' }
  }
  if (name.length > CHAR_LIMITS.CATEGORY_NAME_MAX) {
    return { valid: false, error: `分类名称不能超过${CHAR_LIMITS.CATEGORY_NAME_MAX}字符` }
  }
  return { valid: true }
}

/**
 * 验证标签名称
 * @param name - 标签名称
 */
export function validateTagName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: '标签名称不能为空' }
  }
  if (name.length > CHAR_LIMITS.TAG_NAME_MAX) {
    return { valid: false, error: `标签名称不能超过${CHAR_LIMITS.TAG_NAME_MAX}字符` }
  }
  return { valid: true }
}

/**
 * 验证金额
 * @param amount - 金额数值
 */
export function validateAmount(amount: number): ValidationResult {
  if (typeof amount !== 'number') {
    return { valid: false, error: '金额必须是数字' }
  }
  if (amount < 0) {
    return { valid: false, error: '金额不能为负数' }
  }
  if (amount > 999999999) {
    return { valid: false, error: '金额超出范围' }
  }
  return { valid: true }
}

/**
 * 验证日期格式
 * @param date - 日期字符串 (YYYY-MM-DD)
 */
export function validateDateFormat(date: string): ValidationResult {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  if (!regex.test(date)) {
    return { valid: false, error: '日期格式应为 YYYY-MM-DD' }
  }
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) {
    return { valid: false, error: '无效的日期' }
  }
  return { valid: true }
}

/**
 * 批量验证
 * @param validations - 验证结果数组
 */
export function validateAll(validations: ValidationResult[]): ValidationResult {
  const invalid = validations.find(v => !v.valid)
  return invalid ?? { valid: true }
}