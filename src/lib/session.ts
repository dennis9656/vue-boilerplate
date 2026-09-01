import { queryClient } from '@/lib/queryClient'

/**
 * Clear everything the previous user could see.
 *
 * In a per-request architecture, cache isolation was a side effect of the
 * request boundary. Here one QueryClient instance outlives the session, so the
 * previous user's data stays cached until this runs. Call it on logout and on
 * account switch — rules/vue-spa/review-checks.md, tier 4.
 */
export function clearSession(): void {
  queryClient.clear()
}
