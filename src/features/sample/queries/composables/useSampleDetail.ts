import { useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { getSample } from '../../api/sampleApi'
import { sampleKeys } from '../keys/sampleKeys'

export function useSampleDetail(sampleId: MaybeRefOrGetter<number>) {
  return useQuery({
    queryKey: computed(() => sampleKeys.detail(toValue(sampleId))),
    queryFn: () => getSample(toValue(sampleId)),
    enabled: computed(() => Number.isFinite(toValue(sampleId))),
  })
}
