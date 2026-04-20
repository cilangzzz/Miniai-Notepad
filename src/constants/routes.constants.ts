/**
 * 路由路径常量
 */
export const ROUTES = {
  HOME: '/',
  NOTES: '/notes',
  EDIT_NOTE: '/notes/edit',
  NOTE_DETAIL: '/notes/:id',
  CATEGORIES: '/categories',
  ARCHIVE: '/archive',
  FINANCE: '/finance',
  FINANCE_INCOME: '/finance/income',
  FINANCE_EXPENSE: '/finance/expense',
  NEWS: '/news',
  NEWS_DETAIL: '/news/:id',
  SETTINGS: '/settings',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const

/**
 * 路由名称常量
 */
export const ROUTE_NAMES = {
  HOME: 'home',
  MY_NOTES: 'my_notes',
  EDIT_NOTE: 'edit_note',
  NOTE_DETAIL: 'note_detail',
  CATEGORIES: 'categories',
  ARCHIVE_SEARCH: 'archive_search',
  FINANCE: 'finance',
  FINANCE_INCOME: 'finance_income',
  FINANCE_EXPENSE: 'finance_expense',
  NEWS: 'news',
  NEWS_DETAIL: 'news_detail',
  SETTINGS: 'settings',
  NOT_FOUND: 'not_found',
} as const

/**
 * 导航项配置
 */
export const NAV_ITEMS = [
  { id: 'notes', label: 'Notes', icon: 'sticky_note_2', route: ROUTES.NOTES, order: 1 },
  { id: 'tags', label: 'Tags', icon: 'label', route: ROUTES.CATEGORIES, order: 2 },
  { id: 'archive', label: 'Archive', icon: 'archive', route: ROUTES.ARCHIVE, order: 3 },
  { id: 'finance', label: 'Finance', icon: 'account_balance_wallet', route: ROUTES.FINANCE, order: 4 },
  { id: 'settings', label: 'Settings', icon: 'settings', route: ROUTES.SETTINGS, order: 5 },
] as const