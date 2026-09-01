import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

/**
 * Route-level code splitting is mandatory, not an optimization: a router that
 * statically imports its views ships the whole app to someone who opened one
 * page, and an SPA has no server-rendered fallback to hide behind
 * (rules/vue-spa/stack-standards.md §4).
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/samples',
    name: 'sample-list',
    component: () => import('@/views/SampleListView.vue'),
  },
  {
    path: '/samples/:id(\d+)',
    name: 'sample-detail',
    component: () => import('@/views/SampleDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

/**
 * Guards are navigation control, never authorization — the backend authorizes.
 *
 * A guard does not fetch: awaiting a request here blocks navigation on the
 * network and produces a frozen UI with no feedback. Prefetch into the query
 * cache instead and let the view render its own pending state.
 */
router.beforeEach((to) => {
  if (to.meta.requiresAuth !== true) return true
  // Replace with a synchronous read of an already-resolved session.
  return true
})

/** Post-login return paths go through an allowlist. An open redirect is as available here as anywhere. */
const RETURN_PATH_PATTERN = /^\/(?!\/)[\w\-/]*$/

export function safeReturnPath(raw: unknown, fallback = '/'): string {
  return typeof raw === 'string' && RETURN_PATH_PATTERN.test(raw) ? raw : fallback
}
