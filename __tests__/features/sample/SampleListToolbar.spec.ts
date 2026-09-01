import { describe, expect, it } from 'vitest'

import SampleListToolbar from '@/features/sample/components/SampleListToolbar.vue'
import { DEFAULT_SAMPLE_FILTERS } from '@/features/sample/types/sample'
import { mountWithProviders } from '../../helpers'

describe('SampleListToolbar', () => {
  it('emits a status patch, and toggles it off when the active one is clicked again', async () => {
    const wrapper = await mountWithProviders(SampleListToolbar, {
      props: { filters: { ...DEFAULT_SAMPLE_FILTERS, status: 'active' } },
    })

    const [activeButton] = wrapper.findAll('button')
    await activeButton?.trigger('click')

    expect(wrapper.emitted('patch')?.[0]).toEqual([{ status: null }])
  })

  it('emits the search text as the user types', async () => {
    const wrapper = await mountWithProviders(SampleListToolbar, {
      props: { filters: { ...DEFAULT_SAMPLE_FILTERS } },
    })

    await wrapper.find('input[type="search"]').setValue('audit')

    expect(wrapper.emitted('patch')?.[0]).toEqual([{ q: 'audit' }])
  })

  it('emits reset', async () => {
    const wrapper = await mountWithProviders(SampleListToolbar, {
      props: { filters: { ...DEFAULT_SAMPLE_FILTERS } },
    })

    await wrapper.findAll('button').at(-1)?.trigger('click')

    expect(wrapper.emitted('reset')).toHaveLength(1)
  })
})
