import type { SampleListFilters } from '../../types/sample'

/**
 * Keys live apart from the composables so mutations can invalidate without
 * importing a composable, guards can prefetch, and tests can address the cache
 * directly.
 *
 * Never hand-write a `queryKey: [...]` array — a key that disagrees with the
 * prefetched one silently refetches what is already cached.
 */
export const sampleKeys = {
  all: ['sample'] as const,
  lists: () => [...sampleKeys.all, 'list'] as const,
  list: (filters: SampleListFilters) => [...sampleKeys.lists(), filters] as const,
  details: () => [...sampleKeys.all, 'detail'] as const,
  detail: (id: number) => [...sampleKeys.details(), id] as const,
}
