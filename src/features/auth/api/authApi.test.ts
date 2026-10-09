import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiFetch, putAccessToken } from '~/helpers/apiHelper'
import { loginApi, registerApi } from './authApi'

vi.mock('~/helpers/apiHelper', () => ({
  apiFetch: vi.fn(),
  putAccessToken: vi.fn(),
}))

const mockedApiFetch = vi.mocked(apiFetch)

describe('authApi', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends email and password to the login endpoint and stores the returned token', async () => {
    mockedApiFetch.mockResolvedValueOnce({
      status: 'success',
      message: 'Berhasil login',
      data: { token: 'test-token', user: { name: 'Test', email: 'test@example.com' } },
    })

    await loginApi({ email: 'test@example.com', password: 'secret' })

    expect(mockedApiFetch).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', password: 'secret' }),
    })
    expect(putAccessToken).toHaveBeenCalledWith('test-token')
  })

  it('sends only the documented fields to registration', async () => {
    mockedApiFetch.mockResolvedValueOnce({ status: 'success', message: 'Berhasil melakukan pendaftaran' })

    await registerApi({ name: 'Test User', email: 'test@example.com', password: 'secret' })

    expect(mockedApiFetch).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'secret' }),
    })
  })

  it('surfaces API validation failures', async () => {
    mockedApiFetch.mockResolvedValueOnce({ status: 'fail', message: 'Data tidak valid' })
    await expect(loginApi({ email: 'test@example.com', password: 'bad' })).rejects.toThrow('Data tidak valid')
  })
})
