/** A failed backend call. Carries enough to decide, not enough to leak. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    /** Backend error code from the response envelope, when it sent one. */
    readonly code: string | null,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isNotFound(): boolean {
    return this.status === 404
  }
}
