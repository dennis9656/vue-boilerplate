import { describe, expect, it } from 'vitest'

import { router, safeReturnPath } from '@/router'

describe('router', () => {
  it('code-splits every route — a static import would ship the whole app to one page', () => {
    const components = router.getRoutes().map((route) => route.components?.default)
    expect(components.length).toBeGreaterThan(0)
    for (const component of components) {
      expect(typeof component).toBe('function')
    }
  })

  it('resolves an unknown path to the not-found route', () => {
    expect(router.resolve('/nope/deeper').name).toBe('not-found')
  })
})

describe('safeReturnPath', () => {
  it('accepts an in-app path', () => {
    expect(safeReturnPath('/samples/1')).toBe('/samples/1')
  })

  it.each(['//evil.example', 'https://evil.example', 'javascript:alert(1)', 42, undefined])(
    'rejects %s and falls back',
    (raw) => {
      expect(safeReturnPath(raw)).toBe('/')
    },
  )
})
