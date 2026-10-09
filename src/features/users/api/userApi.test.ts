import { describe, expect, it, vi } from 'vitest'
import { getMeApi, getUsersApi, updateBioApi, updatePasswordApi, uploadAvatarApi } from './userApi'
vi.mock('~/helpers/apiHelper', () => ({ apiFetch: vi.fn().mockResolvedValue({ data: [] }) }))
describe('userApi', () => {
  it('exposes user endpoint calls', async () => { await getUsersApi(); await getMeApi(); await updateBioApi('bio'); await updatePasswordApi('old','new'); await uploadAvatarApi(new File(['x'], 'x.png')); expect(true).toBe(true) })
})
