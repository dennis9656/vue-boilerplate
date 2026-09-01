import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../__mocks__/server'
import { API_BASE_URL } from '@/common/constants/env'
import SampleListView from '@/views/SampleListView.vue'
import { flush, mountWithProviders } from '../../helpers'

describe('SampleListView', () => {
  it('renders the samples the backend returned', async () => {
    const wrapper = await mountWithProviders(SampleListView, { initialRoute: '/samples' })
    await flush()

    expect(wrapper.text()).toContain('Onboarding checklist')
    expect(wrapper.findAll('article, li a').length).toBeGreaterThan(0)
  })

  it('reads its filters from the URL, so a pasted link shows the filtered list', async () => {
    const wrapper = await mountWithProviders(SampleListView, {
      initialRoute: '/samples?status=archived',
    })
    await flush()

    expect(wrapper.text()).toContain('Quarterly retro notes')
    expect(wrapper.text()).not.toContain('Onboarding checklist')
  })

  it('shows the error state with a retry when the list request fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/samples`, () =>
        HttpResponse.json(
          { success: false, data: null, error: { code: 'INTERNAL', message: 'Server exploded' } },
          { status: 500 },
        ),
      ),
    )

    const wrapper = await mountWithProviders(SampleListView, { initialRoute: '/samples' })
    await flush(6)

    expect(wrapper.text()).toContain('Server exploded')
  })
})
