import { describe, expect, it } from 'vitest'

import AppHeader from '@/components/custom/AppHeader.vue'
import { mountWithProviders } from '../helpers'

describe('AppHeader', () => {
  it('switches the rendered language', async () => {
    const wrapper = await mountWithProviders(AppHeader)
    expect(wrapper.text()).toContain('샘플')

    await wrapper
      .findAll('button')
      .find((button) => button.text() === 'EN')
      ?.trigger('click')

    expect(wrapper.text()).toContain('Samples')
  })

  it('toggles the theme through the store', async () => {
    const wrapper = await mountWithProviders(AppHeader)

    await wrapper.findAll('button').at(-1)?.trigger('click')

    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
