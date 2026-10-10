import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import NavbarComponent from './NavbarComponent.vue'
import { useAuthStore } from '~/features/auth/states/authStore'
import { useUsersStore } from '~/features/users/states/usersStore'

describe('NavbarComponent UI', () => {
  beforeEach(() => { localStorage.clear() })

  it('renders the signed-in user display name and logout control', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore(pinia)
    auth.user = { username: 'rachel', name: 'Rachel' } as never
    const users = useUsersStore(pinia)
    users.profile = { username: 'rachel', name: 'Rachel' } as never
    const wrapper = mount(NavbarComponent, { global: { plugins: [pinia], stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    expect(wrapper.text()).toContain('Rachel')
    expect(wrapper.text()).toContain('Keluar')
  })
})
