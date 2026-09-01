const LEVELS = ['debug', 'info', 'warn', 'error'] as const
type Level = (typeof LEVELS)[number]

const MIN_LEVEL: Level = import.meta.env.DEV ? 'debug' : 'warn'

function enabled(level: Level): boolean {
  return LEVELS.indexOf(level) >= LEVELS.indexOf(MIN_LEVEL)
}

/**
 * The project logger. `console.*` is banned everywhere else.
 *
 * This runs in the browser, so what is passed to it is visible to the user and
 * to anything reading the console — never pass PII
 * (rules/vue-spa/stack-standards.md §6).
 */
export const logger = {
  debug: (message: string, context?: unknown) =>
    enabled('debug') && console.debug(`[debug] ${message}`, context ?? ''),
  info: (message: string, context?: unknown) =>
    enabled('info') && console.info(`[info] ${message}`, context ?? ''),
  warn: (message: string, context?: unknown) =>
    enabled('warn') && console.warn(`[warn] ${message}`, context ?? ''),
  error: (message: string, context?: unknown) =>
    enabled('error') && console.error(`[error] ${message}`, context ?? ''),
}
