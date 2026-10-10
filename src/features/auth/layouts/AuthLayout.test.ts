import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AuthLayout from './AuthLayout.vue'

describe('AuthLayout UI', () => {
  it('renders the branding and child route outlet', () => {
    const wrapper = mount(AuthLayout, { global: { stubs: { RouterView: { template: '<div data-testid="route-outlet">Child page</div>' } } } })
    expect(wrapper.text()).toContain('Atur arus kas, capai tujuan finansial.')
    expect(wrapper.text()).toContain('Child page')
  })
})
