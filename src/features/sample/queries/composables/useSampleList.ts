import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { getSamples } from '../../api/sampleApi'
import type { SampleListFilters } from '../../types/sample'
import { sampleKeys } from '../keys/sampleKeys'

/**
 * `MaybeRefOrGetter`, not a plain value.
 *
 * Vue Query tracks dependencies through reactivity, not through re-invocation.
 * A composable that takes a plain value never refetches when that value changes,
 * and it fails silently — which is why there is a test for exactly this.
 */
export function useSampleList(filters: MaybeRefOrGetter<SampleListFilters>) {
  return useQuery({
    queryKey: computed(() => sampleKeys.list(toValue(filters))),
    queryFn: () => getSamples(toValue(filters)),
  })
}
