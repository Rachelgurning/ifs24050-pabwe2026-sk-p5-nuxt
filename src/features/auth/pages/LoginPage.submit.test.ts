import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginPage from './LoginPage.vue'
import { useAuthStore } from '../states/authStore'
import { showErrorDialog } from '~/helpers/toolsHelper'

vi.mock('~/helpers/toolsHelper', () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }))

const stubs = { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } }

describe('LoginPage submit', () => {
  const navigateTo = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.stubGlobal('navigateTo', navigateTo)
  })

  it('navigates to dashboard after successful login', async () => {
    const auth = useAuthStore()
    const login = vi.spyOn(auth, 'login').mockResolvedValue({} as never)
    const wrapper = mount(LoginPage, { global: { stubs } })
    await wrapper.get('#login-email-input').setValue('user@mail.com')
    await wrapper.get('#login-password-input').setValue('secret')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(login).toHaveBeenCalledWith('user@mail.com', 'secret')
    expect(navigateTo).toHaveBeenCalledWith('/')
  })

  it('shows error dialog when login fails', async () => {
    const auth = useAuthStore()
    vi.spyOn(auth, 'login').mockRejectedValue(new Error('Email salah'))
    const wrapper = mount(LoginPage, { global: { stubs } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Login gagal', 'Email salah')
  })

  it('uses a default message for non-Error failures', async () => {
    const auth = useAuthStore()
    vi.spyOn(auth, 'login').mockRejectedValue('x')
    const wrapper = mount(LoginPage, { global: { stubs } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Login gagal', 'Periksa kredensial Anda')
  })
})
