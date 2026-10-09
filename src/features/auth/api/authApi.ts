import { apiFetch, putAccessToken } from '~/helpers/apiHelper'

export interface AuthUser {
  id?: number | string
  name?: string
  email?: string
}

export interface AuthResponse {
  status?: string
  message?: string
  data?: {
    token?: string
    user?: AuthUser
  }
}

export async function loginApi(payload: { email: string; password: string }): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  const token = result.data?.token
  if (result.status === 'success' && token) putAccessToken(token)
  if (result.status === 'fail' || result.status === 'error') {
    throw new Error(result.message || 'Login gagal. Periksa email dan password.')
  }
  return result
}

export async function registerApi(payload: { name: string; email: string; password: string }): Promise<AuthResponse> {
  const result = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  if (result.status === 'fail' || result.status === 'error') {
    throw new Error(result.message || 'Registrasi gagal. Periksa data yang dimasukkan.')
  }
  return result
}
