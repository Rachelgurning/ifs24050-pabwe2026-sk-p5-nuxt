import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch, putAccessToken } from './apiHelper'

const config = { public: { delcomBaseurl: 'https://example.test/api/' } }
vi.stubGlobal('useRuntimeConfig', () => config)

function mockFetch(body: string, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(body, { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('apiFetch branches', () => {
  beforeEach(() => { vi.unstubAllEnvs(); putAccessToken(null); config.public.delcomBaseurl = 'https://example.test/api/' })

  it('normalises the base url and a path without leading slash', async () => {
    const fetchMock = mockFetch('{}')
    await apiFetch('demo')
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://example.test/api/demo')
  })

  it('prefers the explicit base url argument', async () => {
    const fetchMock = mockFetch('{}')
    await apiFetch('/demo', {}, 'https://other.test')
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://other.test/demo')
  })

  it('throws when no base url is configured', async () => {
    config.public.delcomBaseurl = ''
    vi.stubEnv('VITE_DELCOM_BASEURL', '')
    mockFetch('{}')
    await expect(apiFetch('/demo', {}, '')).rejects.toThrow('Base URL API belum dikonfigurasi.')
  })

  it('sets a JSON content type for string bodies but not for FormData', async () => {
    let fetchMock = mockFetch('{}')
    await apiFetch('/demo', { method: 'POST', body: JSON.stringify({ a: 1 }) })
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('Content-Type')).toBe('application/json')
    fetchMock = mockFetch('{}')
    await apiFetch('/demo', { method: 'POST', body: new FormData() })
    expect(new Headers(fetchMock.mock.calls[0]?.[1]?.headers).get('Content-Type')).toBeNull()
  })

  it('keeps caller supplied Accept and Content-Type headers', async () => {
    const fetchMock = mockFetch('{}')
    await apiFetch('/demo', { method: 'POST', body: 'x', headers: { Accept: 'text/plain', 'Content-Type': 'text/plain' } })
    const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers)
    expect(headers.get('Accept')).toBe('text/plain')
    expect(headers.get('Content-Type')).toBe('text/plain')
  })

  it('returns null for empty bodies and raw text for non-JSON bodies', async () => {
    mockFetch('')
    expect(await apiFetch('/demo')).toBeNull()
    mockFetch('bukan json')
    expect(await apiFetch('/demo')).toBe('bukan json')
  })

  it('builds error messages from message, error, or the status code', async () => {
    mockFetch(JSON.stringify({ error: 'oops' }), 500)
    await expect(apiFetch('/demo')).rejects.toThrow('oops')
    mockFetch(JSON.stringify({}), 404)
    await expect(apiFetch('/demo')).rejects.toMatchObject({ message: 'Permintaan gagal (404).', status: 404 })
    mockFetch('', 503)
    await expect(apiFetch('/demo')).rejects.toThrow('Permintaan gagal (503).')
  })
})
