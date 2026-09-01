import { HttpResponse, http } from 'msw'
import { ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { server } from '../../../__mocks__/server'
import { API_BASE_URL } from '@/common/constants/env'
import { useSampleDetail } from '@/features/sample/queries/composables/useSampleDetail'
import { flush, mountWithProviders } from '../../helpers'

/**
 * The reason this file exists: a query composable that takes a plain value never
 * refetches when the value changes, and it fails *silently*. A test is the only
 * thing that catches it (rules/vue-spa/testing.md).
 */
describe('useSampleDetail', () => {
  it('refetches when the id it was given changes', async () => {
    // Arrange
    const requestedIds: string[] = []
    server.use(
      http.get(`${API_BASE_URL}/samples/:id`, ({ params }) => {
        requestedIds.push(String(params.id))
        return HttpResponse.json({
          success: true,
          error: null,
          data: {
            id: Number(params.id),
            name: `Sample ${params.id}`,
            status: 'active',
            ownerName: 'Test Owner',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        })
      }),
    )

    const sampleId = ref(1)
    const wrapper = await mountWithProviders({
      setup() {
        const { data } = useSampleDetail(sampleId)
        return () => data.value?.name ?? ''
      },
    })
    await flush()

    // Act
    sampleId.value = 2
    await flush()

    // Assert
    expect(requestedIds).toEqual(['1', '2'])
    expect(wrapper.text()).toContain('Sample 2')
  })

  it('surfaces the contract error envelope for a missing sample', async () => {
    const wrapper = await mountWithProviders({
      setup() {
        const { error, isError } = useSampleDetail(() => 9999)
        return () => (isError.value ? error.value?.message : 'pending')
      },
    })
    await flush()

    expect(wrapper.text()).toBe('Sample not found')
  })
})
