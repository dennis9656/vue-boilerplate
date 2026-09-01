/**
 * The backend origin ships in the bundle. That is the architecture, not a leak —
 * there is nowhere else to put it. What *would* be a finding is a secret behind a
 * `VITE_` prefix: the prefix is what puts a value in the browser.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

/** MSW runs in development unless explicitly turned off, so `npm run dev` works with no backend. */
export const IS_MSW_ENABLED = import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW !== '0'
