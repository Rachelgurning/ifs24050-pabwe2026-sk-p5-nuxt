import { render } from '@testing-library/vue'
import { createPinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
export function createMockPinia() { return createPinia() }
export function renderWithProviders(component: any, options: Record<string, any> = {}) {
  const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/', component: { template: '<div />' } }] })
  return render(component, { global: { plugins: [createPinia(), router], ...(options.global || {}) }, ...options })
}
