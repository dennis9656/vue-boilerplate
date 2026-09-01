import { describe, expect, it } from 'vitest'

import { HttpError } from '@/common/error/HttpError'
import { makeQueryClient } from '@/lib/queryClient'

describe('makeQueryClient', () => {
  const retryOf = (client = makeQueryClient()) =>
    client.getDefaultOptions().queries?.retry as (count: number, error: Error) => boolean

  it('does not retry a 4xx — the backend already refused it', () => {
    expect(retryOf()(0, new HttpError(404, 'NOT_FOUND', 'nope'))).toBe(false)
  })

  it('retries a 5xx up to the cap', () => {
    const retry = retryOf()
    const error = new HttpError(503, null, 'unavailable')
    expect(retry(0, error)).toBe(true)
    expect(retry(2, error)).toBe(false)
  })
})
