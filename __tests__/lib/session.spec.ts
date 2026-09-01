import { describe, expect, it } from 'vitest'

import { sampleKeys } from '@/features/sample/queries/keys/sampleKeys'
import { queryClient } from '@/lib/queryClient'
import { clearSession } from '@/lib/session'

describe('clearSession', () => {
  it('drops the previous user data the long-lived client is holding', () => {
    queryClient.setQueryData(sampleKeys.detail(1), { id: 1, name: 'private' })
    expect(queryClient.getQueryData(sampleKeys.detail(1))).toBeDefined()

    clearSession()

    expect(queryClient.getQueryData(sampleKeys.detail(1))).toBeUndefined()
  })
})
