import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import LoginPage from './LoginPage.vue'

describe('LoginPage UI', () => {
  beforeEach(() => { localStorage.clear(); setActivePinia(createPinia()) })

  it('renders required email and password fields', () => {
    const wrapper = mount(LoginPage, { global: { stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    expect(wrapper.text()).toContain('Masuk ke akunmu')
    expect(wrapper.get('input[placeholder="Masukkan email"]').attributes('required')).toBeDefined()
    expect(wrapper.get('input[placeholder="Masukkan password"]').attributes('type')).toBe('password')
    expect(wrapper.get('a').attributes('href')).toBe('/auth/register')
  })
})
