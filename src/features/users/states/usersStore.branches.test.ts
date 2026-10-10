import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUsersStore } from './usersStore'
import * as api from '../api/userApi'

vi.mock('../api/userApi', () => ({
  getUsersApi: vi.fn(), getMeApi: vi.fn(), updateBioApi: vi.fn(), updatePasswordApi: vi.fn(), uploadAvatarApi: vi.fn()
}))

describe('users store response shapes', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it.each([
    ['data.users', { data: { users: [{ id: 1 }] } }],
    ['data array', { data: [{ id: 1 }] }],
    ['root users', { users: [{ id: 1 }] }],
    ['empty', {}]
  ])('reads users from %s', async (name, response) => {
    vi.mocked(api.getUsersApi).mockResolvedValue(response)
    const store = useUsersStore()
    expect(await store.fetchUsers()).toHaveLength(name === 'empty' ? 0 : 1)
  })

  it('stores an error message and rethrows when loading users fails', async () => {
    const store = useUsersStore()
    vi.mocked(api.getUsersApi).mockRejectedValueOnce(new Error('gagal'))
    await expect(store.fetchUsers()).rejects.toThrow('gagal')
    expect(store.error).toBe('gagal')
    vi.mocked(api.getUsersApi).mockRejectedValueOnce('x')
    await expect(store.fetchUsers()).rejects.toBe('x')
    expect(store.error).toBe('Gagal memuat pengguna')
    expect(store.isLoading).toBe(false)
  })

  it.each([
    ['data.user', { data: { user: { name: 'A' } } }],
    ['data', { data: { name: 'A' } }],
    ['root user', { user: { name: 'A' } }],
    ['root', { name: 'A' }]
  ])('reads the profile from %s', async (_name, response) => {
    vi.mocked(api.getMeApi).mockResolvedValue(response)
    const store = useUsersStore()
    expect((await store.fetchProfile())?.name).toBe('A')
  })

  it('updates the bio with and without a loaded profile', async () => {
    vi.mocked(api.updateBioApi).mockResolvedValue({})
    const store = useUsersStore()
    await store.updateBio('tanpa profil')
    expect(store.profile).toBeNull()
    store.profile = { name: 'A' }
    await store.updateBio('baru')
    expect(store.profile?.bio).toBe('baru')
  })
})
