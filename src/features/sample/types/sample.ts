/** `as const` + derived union — not a TS enum (rules/web/review-checks.md). */
export const SAMPLE_STATUSES = ['active', 'archived'] as const
export type SampleStatus = (typeof SAMPLE_STATUSES)[number]

export interface Sample {
  id: number
  name: string
  status: SampleStatus
  /** Display name only. The backend does not send the owner's email or phone. */
  ownerName: string
  createdAt: string
}

export interface SampleListFilters {
  /** Free-text search over the name. */
  q: string
  /** `null` means every status. */
  status: SampleStatus | null
  page: number
}

export interface CreateSampleInput {
  name: string
}

export const DEFAULT_SAMPLE_FILTERS: SampleListFilters = { q: '', status: null, page: 1 }
