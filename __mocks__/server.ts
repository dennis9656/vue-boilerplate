import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/** Component and integration tests run under Node. */
export const server = setupServer(...handlers)
