import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getAccessToken, putAccessToken, apiFetch } from './apiHelper'
vi.stubGlobal('useRuntimeConfig', () => ({ public: { delcomBaseurl: 'https://example.test/api' } }))
describe('token helpers', () => {
  beforeEach(() => localStorage.clear())
  it('stores and retrieves a token', () => { putAccessToken('abc'); expect(getAccessToken()).toBe('abc') })
  it('removes a token', () => { putAccessToken('abc'); putAccessToken(null); expect(getAccessToken()).toBeNull() })
})
describe('apiFetch', () => {
  beforeEach(() => { vi.restoreAllMocks(); putAccessToken(null) })
  it('sends JSON and returns parsed response', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(apiFetch('/demo')).resolves.toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledOnce()
  })
  it('adds bearer token', async () => {
    putAccessToken('abc')
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    await apiFetch('/demo')
    const requestOptions = fetchMock.mock.calls[0]?.[1]
    expect(requestOptions).toBeDefined()
    const headers = new Headers(requestOptions?.headers)
    expect(headers.get('Authorization')).toBe('Bearer abc')
  })
  it('throws API errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: 'bad' }), { status: 400 })))
    await expect(apiFetch('/demo')).rejects.toThrow('bad')
  })
  it('handles network errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    await expect(apiFetch('/demo')).rejects.toThrow('Tidak dapat terhubung')
  })
})
