import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import RegisterPage from './RegisterPage.vue'

describe('RegisterPage UI', () => {
  beforeEach(() => { localStorage.clear(); setActivePinia(createPinia()) })

  it('renders account creation fields and login link', () => {
    const wrapper = mount(RegisterPage, { global: { stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    expect(wrapper.text()).toContain('Buat akun baru')
    expect(wrapper.get('input[placeholder="Nama lengkap"]').attributes('required')).toBeDefined()
    expect(wrapper.get('input[placeholder="nama@email.com"]').attributes('required')).toBeDefined()
    expect(wrapper.get('input[placeholder="Minimal 6 karakter"]').attributes('minlength')).toBe('6')
    expect(wrapper.get('a').attributes('href')).toBe('/auth/login')
  })
})
