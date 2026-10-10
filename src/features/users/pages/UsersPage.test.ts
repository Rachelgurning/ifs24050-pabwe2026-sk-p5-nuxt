import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import UsersPage from './UsersPage.vue'
import { useUsersStore } from '../states/usersStore'

vi.mock('~/helpers/toolsHelper', () => ({ showErrorDialog: vi.fn() }))

describe('UsersPage UI', () => {
  it('shows the empty state when there are no users', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useUsersStore(pinia)
    vi.spyOn(store, 'fetchUsers').mockResolvedValue([])
    const wrapper = mount(UsersPage, { global: { plugins: [pinia] } })
    await flushPromises()
    expect(wrapper.text()).toContain('Direktori pengguna')
    expect(wrapper.text()).toContain('Belum ada data pengguna.')
    expect(store.fetchUsers).toHaveBeenCalledOnce()
  })
})
