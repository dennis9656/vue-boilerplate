import { defineStore } from 'pinia'
import { computed, ref, watchEffect } from 'vue'

import type { Locale } from '@/lib/i18n'

export type Theme = 'light' | 'dark'

/**
 * Client-only state. Nothing here came from the server.
 *
 * A `fetchSamples()` action filling `state.samples` is the shape most Vue
 * examples still show, and it is exactly what this pack forbids: two sources of
 * truth for one fact with nothing keeping them in agreement. Server entities are
 * referenced by id — see `selectedSampleId` — and read from the query cache.
 */
export const useUiStore = defineStore('ui', () => {
  const theme = ref<Theme>('light')
  const locale = ref<Locale>('ko')
  const isSidebarOpen = ref(false)
  /** An id, not an entity. */
  const selectedSampleId = ref<number | null>(null)

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme(): void {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  function setLocale(next: Locale): void {
    locale.value = next
  }

  function selectSample(id: number | null): void {
    selectedSampleId.value = id
  }

  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value
  })

  return {
    theme,
    locale,
    isSidebarOpen,
    selectedSampleId,
    isDark,
    toggleTheme,
    setLocale,
    selectSample,
  }
})
