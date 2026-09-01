import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  DEFAULT_SAMPLE_FILTERS,
  SAMPLE_STATUSES,
  type SampleListFilters,
  type SampleStatus,
} from '../types/sample'

function parseStatus(raw: unknown): SampleStatus | null {
  return SAMPLE_STATUSES.includes(raw as SampleStatus) ? (raw as SampleStatus) : null
}

/**
 * Filters live in the URL, and the query params *are* part of the query key.
 *
 * Copying them into Pinia or into a hand-written key gives the cache and the URL
 * two answers. A filter that survives a refresh but not a link paste is this rule
 * half-applied.
 */
export function useSampleFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<SampleListFilters>(() => ({
    q: typeof route.query.q === 'string' ? route.query.q : DEFAULT_SAMPLE_FILTERS.q,
    status: parseStatus(route.query.status),
    page: Number(route.query.page) || DEFAULT_SAMPLE_FILTERS.page,
  }))

  function patch(next: Partial<SampleListFilters>): void {
    const merged = { ...filters.value, ...next }
    // Any filter change resets pagination, unless the page itself moved.
    const page = 'page' in next ? merged.page : DEFAULT_SAMPLE_FILTERS.page

    void router.replace({
      query: {
        ...(merged.q ? { q: merged.q } : {}),
        ...(merged.status ? { status: merged.status } : {}),
        ...(page > 1 ? { page: String(page) } : {}),
      },
    })
  }

  function reset(): void {
    void router.replace({ query: {} })
  }

  return { filters, patch, reset }
}
