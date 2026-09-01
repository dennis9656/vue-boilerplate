import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { useSampleFilters } from '@/features/sample/composables/useSampleFilters'
import { flush, mountWithProviders } from '../../helpers'

const Harness = defineComponent({
  setup() {
    const api = useSampleFilters()
    return { ...api }
  },
  render() {
    return h('pre', JSON.stringify(this.filters))
  },
})

describe('useSampleFilters', () => {
  it('reads filters out of the URL', async () => {
    const wrapper = await mountWithProviders(Harness, {
      initialRoute: '/samples?q=token&status=archived&page=3',
    })

    expect(JSON.parse(wrapper.text())).toEqual({ q: 'token', status: 'archived', page: 3 })
  })

  it('ignores a status the contract does not define', async () => {
    const wrapper = await mountWithProviders(Harness, { initialRoute: '/samples?status=deleted' })

    expect(JSON.parse(wrapper.text()).status).toBeNull()
  })

  it('resets pagination when a filter other than the page changes', async () => {
    const wrapper = await mountWithProviders(Harness, { initialRoute: '/samples?page=4' })

    ;(wrapper.vm as unknown as ReturnType<typeof useSampleFilters>).patch({ q: 'audit' })
    await flush()

    expect(JSON.parse(wrapper.text())).toEqual({ q: 'audit', status: null, page: 1 })
  })

  it('keeps the page when the page itself moves', async () => {
    const wrapper = await mountWithProviders(Harness, { initialRoute: '/samples?q=audit' })

    ;(wrapper.vm as unknown as ReturnType<typeof useSampleFilters>).patch({ page: 2 })
    await flush()

    expect(JSON.parse(wrapper.text())).toEqual({ q: 'audit', status: null, page: 2 })
  })

  it('clears everything on reset', async () => {
    const wrapper = await mountWithProviders(Harness, {
      initialRoute: '/samples?q=audit&status=active&page=2',
    })

    ;(wrapper.vm as unknown as ReturnType<typeof useSampleFilters>).reset()
    await flush()

    expect(JSON.parse(wrapper.text())).toEqual({ q: '', status: null, page: 1 })
  })
})
