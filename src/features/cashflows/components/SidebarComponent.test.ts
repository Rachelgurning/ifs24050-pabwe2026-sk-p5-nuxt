import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import SidebarComponent from './SidebarComponent.vue'

const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }] })

describe('SidebarComponent UI', () => {
  it('renders navigation links for dashboard, users, and profile', async () => {
    await router.push('/')
    const wrapper = mount(SidebarComponent, { global: { plugins: [router], stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    expect(wrapper.text()).toContain('Ringkasan Arus Kas')
    expect(wrapper.text()).toContain('Direktori Pengguna')
    expect(wrapper.text()).toContain('Profil Saya')
  })
})
