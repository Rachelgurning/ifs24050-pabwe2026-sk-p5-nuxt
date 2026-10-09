import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfilePage from './ProfilePage.vue'
import { useUsersStore } from '../states/usersStore'

vi.mock('~/helpers/toolsHelper', () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }))

describe('ProfilePage UI', () => {
  it('renders profile settings after loading profile data', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useUsersStore(pinia)
    vi.spyOn(store, 'fetchProfile').mockResolvedValue({ name: 'Rachel', username: 'rachel', bio: 'Mahasiswa' } as never)
    const wrapper = mount(ProfilePage, { global: { plugins: [pinia] } })
    await flushPromises()
    expect(wrapper.text()).toContain('Profil saya')
    expect(store.fetchProfile).toHaveBeenCalledOnce()
  })
})
