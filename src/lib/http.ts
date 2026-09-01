import { API_BASE_URL } from '@/common/constants/env'
import { HttpError } from '@/common/error/HttpError'
import type { ApiEnvelope } from '@/common/types/api'

type QueryValue = string | number | boolean | undefined | null

interface RequestOptions {
  query?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = `${API_BASE_URL}${path}`
  if (!query) return url

  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '') continue
    params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

/**
 * The one HTTP helper. Native `fetch` only — no axios, ky, or got
 * (rules/web/stack-standards.md §2).
 *
 * Cross-origin is the normal case here, so `credentials: 'include'` is on by
 * default: the backend authenticates by httpOnly cookie and must answer with an
 * explicit origin allowlist. A wildcard `Access-Control-Allow-Origin` is
 * incompatible with credentialed requests and fails at runtime.
 *
 * Custom headers on a cross-origin request cost an `OPTIONS` preflight per call.
 * Keep the header set minimal.
 */
async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  path: string,
  options: RequestOptions = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(buildUrl(path, options.query), {
    method,
    credentials: 'include',
    headers: options.body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    ...(options.signal ? { signal: options.signal } : {}),
  })

  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null

  if (!response.ok || !envelope?.success) {
    throw new HttpError(
      response.status,
      envelope?.error?.code ?? null,
      envelope?.error?.message ?? `HTTP ${response.status}`,
    )
  }

  return envelope
}

export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, options),
  post: <T>(path: string, options?: RequestOptions) => request<T>('POST', path, options),
  patch: <T>(path: string, options?: RequestOptions) => request<T>('PATCH', path, options),
  put: <T>(path: string, options?: RequestOptions) => request<T>('PUT', path, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, options),
}
