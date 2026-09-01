import { HttpResponse, http as mswHttp } from 'msw'
import { describe, expect, it } from 'vitest'

import { server } from '../../__mocks__/server'
import { API_BASE_URL } from '@/common/constants/env'
import { HttpError } from '@/common/error/HttpError'
import { http } from '@/lib/http'

describe('http', () => {
  it('drops empty query params instead of sending them as blanks', async () => {
    let requestedUrl = ''
    server.use(
      mswHttp.get(`${API_BASE_URL}/samples`, ({ request }) => {
        requestedUrl = request.url
        return HttpResponse.json({ success: true, data: [], error: null })
      }),
    )

    await http.get('/samples', { query: { q: '', status: null, page: 2 } })

    expect(requestedUrl).toContain('page=2')
    expect(requestedUrl).not.toContain('q=')
    expect(requestedUrl).not.toContain('status=')
  })

  it('sends a JSON body only for the verbs that carry one', async () => {
    const seen: { method: string; contentType: string | null }[] = []
    for (const verb of ['post', 'patch', 'put', 'delete'] as const) {
      server.use(
        mswHttp[verb](`${API_BASE_URL}/samples/1`, ({ request }) => {
          seen.push({ method: request.method, contentType: request.headers.get('content-type') })
          return HttpResponse.json({ success: true, data: null, error: null })
        }),
      )
      await http[verb]('/samples/1', verb === 'delete' ? undefined : { body: { name: 'x' } })
    }

    expect(seen.map((entry) => entry.method)).toEqual(['POST', 'PATCH', 'PUT', 'DELETE'])
    expect(seen.at(-1)?.contentType).toBeNull()
  })

  it('throws an HttpError carrying the contract error code', async () => {
    await expect(http.get('/samples/9999')).rejects.toMatchObject({
      status: 404,
      code: 'SAMPLE_NOT_FOUND',
    })
    await expect(http.get('/samples/9999')).rejects.toBeInstanceOf(HttpError)
  })
})
