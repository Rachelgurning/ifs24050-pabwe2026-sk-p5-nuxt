import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import DetailPage from './DetailPage.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'

vi.mock('~/helpers/toolsHelper', () => ({
  formatDateTime: vi.fn(() => '01 Okt 2026 10.00'),
  formatRupiah: vi.fn((value: number) => `Rp${value}`),
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn()
}))

const item = { id: 7, type: 'outflow' as const, source: 'cash' as const, label: 'Makan siang', nominal: 35000, description: 'Kantin', created_at: '2026-10-01' }

describe('DetailPage UI', () => {
  it('loads and displays the selected transaction', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = useCashFlowsStore(pinia)
    vi.spyOn(store, 'fetchCashFlow').mockImplementation(async () => { store.cashFlow = item; return item })
    const router = createRouter({ history: createMemoryHistory(), routes: [{ path: '/cash-flows/:cashFlowId', component: DetailPage }] })
    await router.push('/cash-flows/7')
    await router.isReady()
    const wrapper = mount(DetailPage, { global: { plugins: [pinia, router], stubs: { NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } } } })
    await flushPromises()
    expect(wrapper.text()).toContain('Makan siang')
    expect(wrapper.text()).toContain('Kantin')
    expect(store.fetchCashFlow).toHaveBeenCalledWith('7')
  })
})
