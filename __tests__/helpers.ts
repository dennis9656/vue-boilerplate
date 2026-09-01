import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import type { Component } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { DEFAULT_LOCALE, i18n } from '@/lib/i18n'

/**
 * A fresh QueryClient per test. The app gets one client because a browser tab is
 * one user; a test file is not one user, and a shared cache makes tests
 * order-dependent in a way that passes locally and fails in CI.
 */
export function makeTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: 0, gcTime: 0 },
      mutations: { retry: false },
    },
  })
}

const TEST_ROUTES: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: { template: '<div />' } },
  { path: '/samples', name: 'sample-list', component: { template: '<div />' } },
  { path: '/samples/:id', name: 'sample-detail', component: { template: '<div />' } },
]

/**
 * Mounts with the real router and a fresh Pinia rather than stubbing them —
 * stubbing the router hides the navigation bugs route guards actually produce.
 */
export async function mountWithProviders(
  component: Component,
  options: { initialRoute?: string; props?: Record<string, unknown> } = {},
): Promise<VueWrapper> {
  // The i18n instance is shared, so a test that switches locale must not leak
  // into the next one.
  i18n.global.locale.value = DEFAULT_LOCALE

  const router = createRouter({ history: createWebHistory(), routes: TEST_ROUTES })
  await router.push(options.initialRoute ?? '/')
  await router.isReady()

  return mount(component, {
    props: options.props,
    global: {
      plugins: [
        createPinia(),
        router,
        i18n,
        [VueQueryPlugin, { queryClient: makeTestQueryClient() }],
      ],
    },
  })
}

/** Lets pending promises and Vue's scheduler settle. */
export async function flush(times = 3): Promise<void> {
  for (let i = 0; i < times; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}
