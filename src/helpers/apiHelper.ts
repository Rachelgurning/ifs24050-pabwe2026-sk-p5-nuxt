const TOKEN_KEY = 'delcom_access_token'
export interface ApiError extends Error { status?: number; payload?: unknown }
export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}
export function putAccessToken(token: string | null): void {
  if (typeof localStorage === 'undefined') return
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}
export async function apiFetch<T>(path: string, options: RequestInit = {}, baseUrl?: string): Promise<T> {
  const config = useRuntimeConfig()
  const base = (baseUrl || config.public.delcomBaseurl || import.meta.env.VITE_DELCOM_BASEURL || '').replace(/\/$/, '')
  if (!base) throw new Error('Base URL API belum dikonfigurasi.')
  const headers = new Headers(options.headers)
  if (!headers.has('Accept')) headers.set('Accept', 'application/json')
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const token = getAccessToken()
  if (token) headers.set('Authorization', `Bearer ${token}`)
  let response: Response
  try {
    const normalizedPath = path.startsWith('/') ? path : '/' + path
    response = await fetch(`${base}${normalizedPath}`, { ...options, headers })
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.')
  }
  const text = await response.text()
  let payload: any = null
  try { payload = text ? JSON.parse(text) : null } catch { payload = text }
  if (!response.ok) {
    const error = new Error(payload?.message || payload?.error || `Permintaan gagal (${response.status}).`) as ApiError
    error.status = response.status
    error.payload = payload
    throw error
  }
  return payload as T
}
