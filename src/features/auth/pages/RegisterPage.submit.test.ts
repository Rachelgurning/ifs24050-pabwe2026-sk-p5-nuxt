import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegisterPage from './RegisterPage.vue'
import { useAuthStore } from '../states/authStore'
import { showErrorDialog, showSuccessDialog } from '~/helpers/toolsHelper'

vi.mock('~/helpers/toolsHelper', () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }))

const stubs = { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } }

describe('RegisterPage submit', () => {
  const navigateTo = vi.fn()

  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.stubGlobal('navigateTo', navigateTo)
  })

  it('registers and redirects to login', async () => {
    const auth = useAuthStore()
    const register = vi.spyOn(auth, 'register').mockResolvedValue({} as never)
    const wrapper = mount(RegisterPage, { global: { stubs } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(register).toHaveBeenCalled()
    expect(showSuccessDialog).toHaveBeenCalled()
    expect(navigateTo).toHaveBeenCalledWith('/auth/login')
  })

  it('shows error dialog when registration fails', async () => {
    const auth = useAuthStore()
    vi.spyOn(auth, 'register').mockRejectedValue(new Error('Email dipakai'))
    const wrapper = mount(RegisterPage, { global: { stubs } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Registrasi gagal', 'Email dipakai')
  })

  it('uses a default message for non-Error failures', async () => {
    const auth = useAuthStore()
    vi.spyOn(auth, 'register').mockRejectedValue('x')
    const wrapper = mount(RegisterPage, { global: { stubs } })
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Registrasi gagal', 'Silakan coba lagi')
  })
})
