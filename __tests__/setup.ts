import { afterAll, afterEach, beforeAll } from 'vitest'

import { resetSampleStore } from '../__mocks__/handlers/sample'
import { server } from '../__mocks__/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  resetSampleStore()
})
afterAll(() => server.close())
