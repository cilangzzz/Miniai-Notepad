import { NEO_COLORS, NEO_SHADOWS, NEO_BORDERS, CARD_COLORS } from '../constants'

/**
 * Neo-Brutalist 主题配置
 */
export const themeConfig = {
  name: 'neo-brutalist',
  version: '1.0.0',

  colors: NEO_COLORS,

  cardColors: CARD_COLORS,

  shadows: NEO_SHADOWS,

  borders: NEO_BORDERS,

  fonts: {
    headline: ['Space Grotesk', 'sans-serif'],
    body: ['Manrope', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },

  animation: {
    hoverOffset: -4,
    hoverShadowOffset: 4,
    transitionDuration: 150,
  },

  effects: {
    tagRotationRange: [-3, 3],
    logoSkew: -2,
  },
} as const

/**
 * 主题配置类型
 */
export type ThemeConfig = typeof themeConfig

/**
 * 主题模式
 */
export type ThemeMode = 'dark' | 'light'

/**
 * 当前默认主题模式
 */
export const defaultThemeMode: ThemeMode = 'dark'