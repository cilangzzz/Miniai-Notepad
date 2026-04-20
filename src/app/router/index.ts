import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { ROUTES } from '@/constants/routes.constants'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/notes',
  },
  {
    path: '/notes',
    name: 'Notes',
    component: () => import('@/pages/notes/NotesPage.vue'),
    meta: {
      title: 'Notes',
      requiresAuth: false,
    },
  },
  {
    path: '/notes/new',
    name: 'NewNote',
    component: () => import('@/pages/notes/EditNotePage.vue'),
    meta: {
      title: 'New Note',
      requiresAuth: false,
    },
  },
  {
    path: '/notes/:id',
    name: 'ViewNote',
    component: () => import('@/pages/notes/EditNotePage.vue'),
    meta: {
      title: 'View Note',
      requiresAuth: false,
    },
  },
  {
    path: '/notes/:id/edit',
    name: 'EditNote',
    component: () => import('@/pages/notes/EditNotePage.vue'),
    meta: {
      title: 'Edit Note',
      requiresAuth: false,
    },
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/pages/categories/CategoriesPage.vue'),
    meta: {
      title: 'Categories',
      requiresAuth: false,
    },
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('@/pages/archive/ArchivePage.vue'),
    meta: {
      title: 'Archive',
      requiresAuth: false,
    },
  },
  {
    path: '/archive/:id',
    name: 'ViewArchive',
    component: () => import('@/pages/archive/ArchivePage.vue'),
    meta: {
      title: 'View Archive',
      requiresAuth: false,
    },
  },
  {
    path: '/finance',
    name: 'Finance',
    component: () => import('@/pages/finance/FinancePage.vue'),
    meta: {
      title: 'Finance',
      requiresAuth: false,
    },
  },
  {
    path: '/news',
    name: 'News',
    component: () => import('@/pages/news/NewsPage.vue'),
    meta: {
      title: 'News',
      requiresAuth: false,
    },
  },
  {
    path: '/news/:id',
    name: 'NewsDetail',
    component: () => import('@/pages/news/NewsPage.vue'),
    meta: {
      title: 'News Detail',
      requiresAuth: false,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/settings/SettingsPage.vue'),
    meta: {
      title: 'Settings',
      requiresAuth: false,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/notes',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  const title = to.meta.title as string
  if (title) {
    document.title = `${title} | MiniAI NotePad`
  }
  next()
})

export default router