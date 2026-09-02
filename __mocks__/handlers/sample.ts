import { HttpResponse, http } from 'msw'

import { API_BASE_URL } from '@/common/constants/env'
import type { ApiEnvelope } from '@/common/types/api'
import type { Sample } from '@/features/sample/types/sample'

/**
 * Fixtures are the FE-side copy of the endpoint contract. They do not invent a
 * field, a status code, or an error envelope — a handler that drifts makes the
 * whole integration suite lie about what the backend does.
 *
 * Note what is absent: no email, no phone, no address. The backend minimizes PII
 * before the response leaves it, and the contract says so. Owner names are
 * placeholders (홍길동 / Jane Doe) — never a real person, not even the author's.
 */
export const sampleFixtures: Sample[] = [
  {
    id: 1,
    name: 'Onboarding checklist',
    status: 'active',
    ownerName: '홍길동',
    createdAt: '2026-01-14T09:00:00.000Z',
  },
  {
    id: 2,
    name: 'Quarterly retro notes',
    status: 'archived',
    ownerName: 'Jane Doe',
    createdAt: '2025-11-02T13:30:00.000Z',
  },
  {
    id: 3,
    name: 'Design token audit',
    status: 'active',
    ownerName: 'John Doe',
    createdAt: '2026-02-20T02:10:00.000Z',
  },
]

const store = [...sampleFixtures]

function ok<T>(data: T, meta?: ApiEnvelope<T>['meta']): ApiEnvelope<T> {
  return { success: true, data, error: null, ...(meta ? { meta } : {}) }
}

function fail(code: string, message: string): ApiEnvelope<never> {
  return { success: false, data: null, error: { code, message } }
}

export const sampleHandlers = [
  http.get(`${API_BASE_URL}/samples`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')?.toLowerCase() ?? ''
    const status = url.searchParams.get('status')

    const items = store.filter(
      (sample) =>
        sample.name.toLowerCase().includes(q) && (status === null || sample.status === status),
    )

    return HttpResponse.json(
      ok(items, {
        total: items.length,
        page: Number(url.searchParams.get('page')) || 1,
        limit: 20,
      }),
    )
  }),

  http.get(`${API_BASE_URL}/samples/:id`, ({ params }) => {
    const sample = store.find((candidate) => candidate.id === Number(params.id))
    if (!sample) {
      return HttpResponse.json(fail('SAMPLE_NOT_FOUND', 'Sample not found'), { status: 404 })
    }
    return HttpResponse.json(ok(sample))
  }),

  http.post(`${API_BASE_URL}/samples`, async ({ request }) => {
    const body = (await request.json()) as { name?: string }
    if (!body.name?.trim()) {
      return HttpResponse.json(fail('SAMPLE_NAME_REQUIRED', 'Name is required'), { status: 400 })
    }

    const created: Sample = {
      id: Math.max(0, ...store.map((sample) => sample.id)) + 1,
      name: body.name.trim(),
      status: 'active',
      ownerName: '홍길동',
      createdAt: new Date().toISOString(),
    }
    store.unshift(created)
    return HttpResponse.json(ok(created), { status: 201 })
  }),
]

/** Tests that mutate the store call this in `afterEach`. */
export function resetSampleStore(): void {
  store.splice(0, store.length, ...sampleFixtures)
}
