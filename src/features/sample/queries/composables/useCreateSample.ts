import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { createSample } from '../../api/sampleApi'
import type { CreateSampleInput } from '../../types/sample'
import { sampleKeys } from '../keys/sampleKeys'

/**
 * Invalidates by key, without importing the list composable.
 *
 * Optimistic updates, when a screen needs them, belong here too — never mirrored
 * into a store, which would have to implement rollback a second time.
 */
export function useCreateSample() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateSampleInput) => createSample(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sampleKeys.lists() }),
  })
}
