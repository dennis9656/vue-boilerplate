import type { Page } from '@/common/types/api'
import { http } from '@/lib/http'

import type { CreateSampleInput, Sample, SampleListFilters } from '../types/sample'

/**
 * One API file per domain. A server/client split exists where two callers reach
 * the backend by two different paths; there is one caller here.
 *
 * This layer must not import from `queries/` — the arrow points one way.
 */
export async function getSamples(filters: SampleListFilters): Promise<Page<Sample>> {
  const envelope = await http.get<Sample[]>('/samples', {
    query: { q: filters.q, status: filters.status, page: filters.page },
  })

  return {
    items: envelope.data ?? [],
    meta: envelope.meta ?? { total: 0, page: filters.page, limit: 0 },
  }
}

export async function getSample(id: number): Promise<Sample> {
  const envelope = await http.get<Sample>(`/samples/${id}`)
  if (!envelope.data) throw new Error(`sample ${id} missing from a successful response`)
  return envelope.data
}

export async function createSample(input: CreateSampleInput): Promise<Sample> {
  const envelope = await http.post<Sample>('/samples', { body: input })
  if (!envelope.data) throw new Error('created sample missing from a successful response')
  return envelope.data
}
