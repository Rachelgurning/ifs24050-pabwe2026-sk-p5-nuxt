import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from './authStore'
vi.mock('../api/authApi', () => ({ loginApi: vi.fn().mockResolvedValue({ data: { user: { email: 'tester@example.com' } } }), registerApi: vi.fn().mockResolvedValue({ ok: true }) }))
vi.mock('~/helpers/apiHelper', () => ({ getAccessToken: vi.fn(() => 'mock-token'), putAccessToken: vi.fn() }))
describe('auth store', () => {
  beforeEach(() => setActivePinia(createPinia()))
  it('logs in, registers, and logs out', async () => { const s = useAuthStore(); await s.login('tester@example.com','pw'); expect(s.isAuthenticated).toBe(true); await s.register({ name:'Test', email:'tester@example.com', password:'pw' }); s.logout(); expect(s.user).toBeNull(); expect(s.token).toBeNull() })
})
