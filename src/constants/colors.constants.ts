import type { CardColor } from '../types'

/**
 * Neo-Brutalist 颜色系统
 */
export const NEO_COLORS = {
  // 背景
  BACKGROUND: '#131313',      // Void Black - 主背景
  SURFACE: '#131313',         // Layer 0
  SURFACE_LOWEST: '#0e0e0e',  // Layer 1 凹陷
  SURFACE_HIGH: '#2a2a2a',    // Layer 2 提升
  SURFACE_HIGHEST: '#353535', // 最高层级

  // 强调色
  PRIMARY: '#FFD700',         // Kinetic Gold - 主强调
  SECONDARY: '#007F7F',       // Teal Depth - 次强调
  CYAN: '#00f1ff',            // Cyan Accent

  // 边框和文字
  BORDER: '#FFFFFF',          // Crisp White - 边框
  TEXT: '#e2e2e2',            // Charcoal Text
  TEXT_MUTED: '#666666',      // 暗淡文字

  // 状态色
  ERROR: '#93000a',           // Error Crimson
  SUCCESS: '#00a000',         // Success Green
  WARNING: '#FFD700',         // Warning Gold
} as const

/**
 * 卡片颜色映射
 */
export const CARD_COLORS: Record<CardColor, string> = {
  yellow: '#FFD700',
  cyan: '#007F7F',
  white: '#FFFFFF',
  gray: '#2a2a2a',
  dark: '#0e0e0e',
} as const

/**
 * Neo-Brutalist 阴影系统
 */
export const NEO_SHADOWS = {
  BLACK: '8px 8px 0px 0px #000000',
  WHITE: '8px 8px 0px 0px #ffffff',
  GOLD: '8px 8px 0px 0px #FFD700',
  TEAL: '8px 8px 0px 0px #007F7F',
  HARD: '6px 6px 0px 0px #353535',
  SMALL: '4px 4px 0px 0px #000000',
} as const

/**
 * Neo-Brutalist 边框配置
 */
export const NEO_BORDERS = {
  WIDTH: 4,
  WIDTH_SMALL: 2,
  RADIUS: 0,  // 无圆角
} as const