import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import NotFoundPage from './NotFoundPage.vue'

describe('NotFoundPage UI', () => {
  it('shows the not-found message and a dashboard link', () => {
    const wrapper = mount(NotFoundPage, { global: { stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    expect(wrapper.text()).toContain('404')
    expect(wrapper.text()).toContain('Halaman tidak ditemukan')
    expect(wrapper.get('a').attributes('href')).toBe('/')
  })
})
