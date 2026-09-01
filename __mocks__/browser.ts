import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

/**
 * `setupWorker`, not `setupServer`.
 *
 * A ruleset written for an architecture with its own server hop forbids the
 * browser worker outright, correctly — there it would sit on the wrong side of
 * the proxy and mock a request the app never makes. Here the browser is the only
 * hop that reaches the backend, so it is the only correct placement
 * (rules/vue-spa/testing.md).
 *
 * Run `npm run msw:init` once to generate `public/mockServiceWorker.js`.
 */
export const worker = setupWorker(...handlers)
