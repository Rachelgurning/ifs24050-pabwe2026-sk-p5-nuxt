import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HomePage from './HomePage.vue'
import { useCashFlowsStore } from '../states/cashFlowsStore'

const dialogs = vi.hoisted(() => ({
  showConfirmDialog: vi.fn(),
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn()
}))

vi.mock('~/helpers/toolsHelper', () => ({
  formatDate: vi.fn(() => '01 Okt 2026'),
  formatRupiah: vi.fn((value: number | string) => `Rp${value}`),
  formatDateTime: vi.fn(() => '01 Okt 2026 10.00'),
  showConfirmDialog: dialogs.showConfirmDialog,
  showErrorDialog: dialogs.showErrorDialog,
  showSuccessDialog: dialogs.showSuccessDialog
}))

const sampleFlow = {
  id: 1,
  type: 'inflow' as const,
  source: 'cash' as const,
  label: 'Gaji',
  nominal: 1_000_000,
  description: 'Gaji bulanan',
  created_at: '2026-10-01'
}

describe('HomePage UI', () => {
  let store: ReturnType<typeof useCashFlowsStore>

  async function renderPage() {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useCashFlowsStore(pinia)
    vi.spyOn(store, 'fetchCashFlows').mockResolvedValue([])
    vi.spyOn(store, 'fetchLabels').mockResolvedValue([])
    const wrapper = mount(HomePage, {
      global: {
        plugins: [pinia],
        stubs: {
          NuxtLink: { props: ['to'], template: '<a :href="to"><slot /></a>' }
        }
      }
    })
    await flushPromises()
    return wrapper
  }

  beforeEach(() => {
    vi.clearAllMocks()
    dialogs.showConfirmDialog.mockResolvedValue({ isConfirmed: false })
    dialogs.showSuccessDialog.mockResolvedValue({ isConfirmed: true })
    dialogs.showErrorDialog.mockResolvedValue({ isConfirmed: true })
  })

  it('renders the dashboard and requests initial data', async () => {
    const wrapper = await renderPage()
    expect(wrapper.text()).toContain('Ringkasan arus kas')
    expect(wrapper.text()).toContain('Riwayat transaksi')
    expect(store.fetchCashFlows).toHaveBeenCalledOnce()
    expect(store.fetchLabels).toHaveBeenCalledOnce()
  })

  it('opens and closes the add transaction form', async () => {
    const wrapper = await renderPage()
    const addButton = wrapper.findAll('button').find(button => button.text().includes('Tambah transaksi'))
    expect(addButton).toBeDefined()
    await addButton!.trigger('click')
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.text()).toContain('Tambah transaksi')
    await wrapper.get('button[aria-label="Tutup modal"]').trigger('click')
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('filters transaction rows by search text', async () => {
    const wrapper = await renderPage()
    store.cashFlows = [sampleFlow]
    await flushPromises()
    expect(wrapper.text()).toContain('Gaji')
    await wrapper.get('input[placeholder="Cari transaksi..."]').setValue('tidak ada')
    expect(wrapper.text()).toContain('Belum ada transaksi')
  })

  it('opens edit form with selected transaction values', async () => {
    const wrapper = await renderPage()
    store.cashFlows = [{ ...sampleFlow, type: 'outflow', source: 'savings', label: 'Belanja', nominal: 50000 } as never]
    await flushPromises()
    await wrapper.get('button[aria-label="Ubah transaksi"]').trigger('click')
    expect(wrapper.text()).toContain('Ubah transaksi')
    expect((wrapper.get('input[placeholder="Contoh: Makanan"]').element as HTMLInputElement).value).toBe('Belanja')
  })

  it('submits a new transaction and shows success feedback', async () => {
    const wrapper = await renderPage()
    vi.spyOn(store, 'addCashFlow').mockResolvedValue()
    const addButton = wrapper.findAll('button').find(button => button.text().includes('Tambah transaksi'))
    await addButton!.trigger('click')
    await wrapper.get('input[placeholder="Contoh: Makanan"]').setValue('Makanan')
    await wrapper.get('input[placeholder="100000"]').setValue('25000')
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    expect(store.addCashFlow).toHaveBeenCalledWith(expect.objectContaining({ label: 'Makanan', nominal: 25000 }))
    expect(dialogs.showSuccessDialog).toHaveBeenCalled()
  })

  it('does not delete all records when reset is cancelled', async () => {
    const wrapper = await renderPage()
    const resetButton = wrapper.findAll('button').find(button => button.text().includes('Reset data'))
    await resetButton!.trigger('click')
    await flushPromises()
    expect(store.removeAllCashFlows).not.toHaveBeenCalled()
  })

  it('handles initial load errors', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useCashFlowsStore(pinia)
    vi.spyOn(store, 'fetchCashFlows').mockRejectedValue(new Error('offline'))
    vi.spyOn(store, 'fetchLabels').mockResolvedValue([])
    mount(HomePage, { global: { plugins: [pinia], stubs: { NuxtLink: true } } })
    await flushPromises()
    expect(dialogs.showErrorDialog).toHaveBeenCalledWith('Gagal memuat data', 'offline')
  })
})
