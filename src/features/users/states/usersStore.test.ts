import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUsersStore } from './usersStore'
vi.mock('../api/userApi', () => ({ getUsersApi: vi.fn().mockResolvedValue({ data: [{ id: 1 }] }), getMeApi: vi.fn().mockResolvedValue({ data: { user: { name: 'A' } } }), updateBioApi: vi.fn(), updatePasswordApi: vi.fn(), uploadAvatarApi: vi.fn() }))
describe('users store', () => { beforeEach(() => setActivePinia(createPinia())); it('manages users and profile', async () => { const s=useUsersStore(); await s.fetchUsers(); await s.fetchProfile(); await s.updateBio('hello'); await s.updatePassword('old','new'); await s.uploadAvatar(new File(['a'],'a.png')); expect(s.users).toHaveLength(1); expect(s.profile?.bio).toBe('hello') }) })
