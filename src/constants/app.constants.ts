/**
 * 应用常量
 */
export const APP_NAME = 'KINETIC_NOTES'
export const APP_VERSION = '1.0.0'
export const APP_TITLE = 'MiniAI记事本'

/**
 * 时间常量
 */
export const TIME_CONSTANTS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const

/**
 * 分页常量
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const

/**
 * 字符限制
 */
export const CHAR_LIMITS = {
  NOTE_TITLE_MAX: 50,
  NOTE_CONTENT_MAX: 5000,
  CATEGORY_NAME_MAX: 20,
  TAG_NAME_MAX: 15,
} as const

/**
 * 断点常量
 */
export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1280,
} as const

export type Breakpoint = 'mobile' | 'tablet' | 'desktop'