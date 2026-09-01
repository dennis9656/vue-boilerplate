import { describe, expect, it } from 'vitest'

import StateBlock from '@/components/custom/StateBlock.vue'
import { mountWithProviders } from '../helpers'

describe('StateBlock', () => {
  it.each([
    ['loading', '불러오는 중…'],
    ['empty', '표시할 항목이 없습니다.'],
  ])('renders the %s state', async (state, expected) => {
    const wrapper = await mountWithProviders(StateBlock, { props: { state } })
    expect(wrapper.text()).toContain(expected)
  })

  it('falls back to the generic message and emits retry', async () => {
    const wrapper = await mountWithProviders(StateBlock, { props: { state: 'error' } })
    expect(wrapper.text()).toContain('요청을 처리하지 못했습니다.')

    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })
})
