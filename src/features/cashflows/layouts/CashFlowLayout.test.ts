import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import CashFlowLayout from './CashFlowLayout.vue'
import { useAuthStore } from '~/features/auth/states/authStore'

describe('CashFlowLayout UI', () => {
  it('renders the application shell for an authenticated user', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useAuthStore(pinia).token = 'test-token'
    const wrapper = shallowMount(CashFlowLayout, { global: { plugins: [pinia], stubs: { NavbarComponent: true, SidebarComponent: true, RouterView: true } } })
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'NavbarComponent' }).exists()).toBe(true)
  })
})
