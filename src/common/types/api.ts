/** The response envelope every endpoint uses. Mirrored in `__mocks__/handlers/`. */
export interface ApiEnvelope<T> {
  success: boolean
  data: T | null
  error: ApiError | null
  meta?: PageMeta
}

export interface ApiError {
  code: string
  message: string
}

export interface PageMeta {
  total: number
  page: number
  limit: number
}

/** A list response after the envelope is unwrapped. */
export interface Page<T> {
  items: T[]
  meta: PageMeta
}
