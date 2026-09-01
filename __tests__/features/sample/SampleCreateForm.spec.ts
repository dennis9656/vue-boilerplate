import { HttpResponse, http } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../../__mocks__/server'
import { API_BASE_URL } from '@/common/constants/env'
import SampleCreateForm from '@/features/sample/components/SampleCreateForm.vue'
import { flush, mountWithProviders } from '../../helpers'

describe('SampleCreateForm', () => {
  it('refuses a blank name without going to the network', async () => {
    const wrapper = await mountWithProviders(SampleCreateForm)

    await wrapper.find('form').trigger('submit')
    await flush()

    expect(wrapper.text()).toContain('이름을 입력하세요.')
  })

  it('clears the input after the backend accepts the sample', async () => {
    const wrapper = await mountWithProviders(SampleCreateForm)
    const input = wrapper.find('input')

    await input.setValue('  New sample  ')
    await wrapper.find('form').trigger('submit')
    await flush()

    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('surfaces the backend error envelope instead of swallowing it', async () => {
    server.use(
      http.post(`${API_BASE_URL}/samples`, () =>
        HttpResponse.json(
          {
            success: false,
            data: null,
            error: { code: 'CONFLICT', message: 'Name already taken' },
          },
          { status: 409 },
        ),
      ),
    )

    const wrapper = await mountWithProviders(SampleCreateForm)
    await wrapper.find('input').setValue('Duplicate')
    await wrapper.find('form').trigger('submit')
    await flush()

    expect(wrapper.text()).toContain('Name already taken')
  })
})
