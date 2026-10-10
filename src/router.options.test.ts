import { describe, expect, it } from 'vitest'
import { appRoutes } from './routes'

describe('Application routes', () => {
  it('defines authentication, dashboard, user, profile, and fallback routes', () => {
    const paths = appRoutes.map(route => route.path)
    expect(paths).toContain('/auth')
    expect(paths).toContain('/')
    expect(paths).toContain('/:pathMatch(.*)*')
    const dashboard = appRoutes.find(route => route.path === '/') as { children?: Array<{ path: string }> } | undefined
    expect(dashboard?.children?.map(route => route.path)).toEqual(expect.arrayContaining(['', 'cash-flows/:cashFlowId', 'users', 'profile']))
  })
})
