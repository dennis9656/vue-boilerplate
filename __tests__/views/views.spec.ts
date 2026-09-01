import { describe, expect, it } from 'vitest'

import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import SampleDetailView from '@/views/SampleDetailView.vue'
import { flush, mountWithProviders } from '../helpers'

describe('views', () => {
  it('HomeView renders translated copy, never a hardcoded string', async () => {
    const wrapper = await mountWithProviders(HomeView)
    expect(wrapper.text()).toContain('Vue 보일러플레이트')
    expect(wrapper.text()).not.toContain('home.lede')
  })

  it('NotFoundView offers a way back', async () => {
    const wrapper = await mountWithProviders(NotFoundView)
    expect(wrapper.text()).toContain('페이지를 찾을 수 없습니다')
  })

  it('SampleDetailView reads its id from the route', async () => {
    const wrapper = await mountWithProviders(SampleDetailView, { initialRoute: '/samples/2' })
    await flush()

    expect(wrapper.text()).toContain('Quarterly retro notes')
  })

  it('SampleDetailView shows the 404 from the contract', async () => {
    const wrapper = await mountWithProviders(SampleDetailView, { initialRoute: '/samples/404' })
    await flush()

    expect(wrapper.text()).toContain('Sample not found')
  })
})
