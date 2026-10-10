import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './app.vue'

describe('Application root', () => {
  it('renders the Nuxt page outlet', () => {
    const wrapper = mount(App, { global: { stubs: { NuxtPage: { template: '<main data-testid="page-outlet">Page</main>' } } } })
    expect(wrapper.get('[data-testid="page-outlet"]').text()).toBe('Page')
  })
})
