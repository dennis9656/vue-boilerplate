import { QueryClient } from '@tanstack/vue-query'

import { HttpError } from '@/common/error/HttpError'
import { logger } from '@/lib/logger'

const STALE_TIME_MS = 30_000
const MAX_RETRIES = 2

/**
 * One client for the whole app.
 *
 * Where the frontend has a server of its own, module-level construction is
 * forbidden: one server process serves many users, and a shared cache leaks one
 * user's response to another. A browser tab is one user, so that does not hold
 * here — but the risk moves rather than disappearing: this instance outlives the
 * session, so `clearSession()` in `lib/session.ts` must clear it on logout and
 * on account switch. See rules/vue-spa/patterns.md.
 *
 * A test file is not one user either. Tests build their own client per test.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        // Retrying a 4xx just repeats a request the backend already refused.
        retry: (failureCount, error) => {
          if (error instanceof HttpError && error.status < 500) return false
          return failureCount < MAX_RETRIES
        },
      },
      mutations: { retry: false },
    },
  })
}

export const queryClient = makeQueryClient()

queryClient.getQueryCache().config.onError = (error) => {
  logger.error('query failed', { message: (error as Error).message })
}
queryClient.getMutationCache().config.onError = (error) => {
  logger.error('mutation failed', { message: (error as Error).message })
}
