import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { useUiStore } from '@/stores/useUiStore'

describe('useUiStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('reflects the theme onto the document so CSS can key off it', async () => {
    const ui = useUiStore()
    ui.toggleTheme()
    await nextTick()

    expect(ui.isDark).toBe(true)
    expect(document.documentElement.dataset.theme).toBe('dark')
  })

  it('holds a selected sample as an id, never as an entity', () => {
    const ui = useUiStore()
    ui.selectSample(7)

    expect(ui.selectedSampleId).toBe(7)
    // If this store ever grows a field holding a server entity, that is the
    // two-sources-of-truth defect the pack forbids.
    expect(Object.keys(ui.$state)).toEqual(['theme', 'locale', 'isSidebarOpen', 'selectedSampleId'])
  })

  it('switches locale', () => {
    const ui = useUiStore()
    ui.setLocale('en')
    expect(ui.locale).toBe('en')
  })
})
