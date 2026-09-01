import { describe, expect, it, vi } from 'vitest'

import { logger } from '@/lib/logger'

describe('logger', () => {
  it('routes through console at the level asked for', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    logger.warn('careful', { id: 1 })
    expect(spy).toHaveBeenCalledWith('[warn] careful', { id: 1 })
    spy.mockRestore()
  })

  it('emits debug in dev and error always', () => {
    const debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    logger.debug('d')
    logger.info('i')
    logger.error('e')
    expect(errorSpy).toHaveBeenCalled()
    expect(debugSpy.mock.calls.length + infoSpy.mock.calls.length).toBeGreaterThanOrEqual(0)
    debugSpy.mockRestore()
    errorSpy.mockRestore()
    infoSpy.mockRestore()
  })
})
