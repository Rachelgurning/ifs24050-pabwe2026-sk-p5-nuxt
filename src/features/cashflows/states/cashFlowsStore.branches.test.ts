import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCashFlowsStore } from './cashFlowsStore'
import * as api from '../api/cashFlowApi'

vi.mock('../api/cashFlowApi', () => ({
  getCashFlowsApi: vi.fn(), getCashFlowApi: vi.fn(), getCashFlowLabelsApi: vi.fn(),
  getDailyStatsApi: vi.fn(), getMonthlyStatsApi: vi.fn(), createCashFlowApi: vi.fn(),
  updateCashFlowApi: vi.fn(), deleteCashFlowApi: vi.fn(), deleteAllCashFlowsApi: vi.fn()
}))

const row = { id: 1, type: 'inflow', source: 'cash', label: 'Gaji', nominal: 10 }

describe('cash flows store response shapes', () => {
  beforeEach(() => { setActivePinia(createPinia()); vi.clearAllMocks() })

  it.each([
    ['data.cash_flows', { data: { cash_flows: [row] } }],
    ['data.cashFlows', { data: { cashFlows: [row] } }],
    ['data array', { data: [row] }],
    ['root cash_flows', { cash_flows: [row] }],
    ['empty', {}]
  ])('reads cash flows from %s', async (_name, response) => {
    vi.mocked(api.getCashFlowsApi).mockResolvedValue(response)
    const store = useCashFlowsStore()
    const result = await store.fetchCashFlows()
    expect(result).toHaveLength(_name === 'empty' ? 0 : 1)
  })

  it('merges stats from data.stats and from root stats', async () => {
    vi.mocked(api.getCashFlowsApi).mockResolvedValueOnce({ data: { stats: { total_inflow: 5 } } })
    const store = useCashFlowsStore()
    await store.fetchCashFlows()
    expect(store.stats.total_inflow).toBe(5)
    vi.mocked(api.getCashFlowsApi).mockResolvedValueOnce({ stats: { total_outflow: 7 } })
    await store.fetchCashFlows()
    expect(store.stats.total_outflow).toBe(7)
  })

  it('stores the error message and rethrows when loading fails', async () => {
    vi.mocked(api.getCashFlowsApi).mockRejectedValueOnce(new Error('gagal'))
    const store = useCashFlowsStore()
    await expect(store.fetchCashFlows()).rejects.toThrow('gagal')
    expect(store.error).toBe('gagal')
    vi.mocked(api.getCashFlowsApi).mockRejectedValueOnce('x')
    await expect(store.fetchCashFlows()).rejects.toBe('x')
    expect(store.error).toBe('Gagal memuat arus kas')
    expect(store.isLoading).toBe(false)
  })

  it.each([
    ['data.cash_flow', { data: { cash_flow: row } }],
    ['data', { data: row }],
    ['root cash_flow', { cash_flow: row }],
    ['root', row]
  ])('reads a single cash flow from %s', async (_name, response) => {
    vi.mocked(api.getCashFlowApi).mockResolvedValue(response)
    const store = useCashFlowsStore()
    expect((await store.fetchCashFlow(1))?.id).toBe(1)
  })

  it.each([
    ['data.labels', { data: { labels: ['a'] } }],
    ['data', { data: ['a'] }],
    ['root labels', { labels: ['a'] }],
    ['empty', {}]
  ])('reads labels from %s', async (name, response) => {
    vi.mocked(api.getCashFlowLabelsApi).mockResolvedValue(response)
    const store = useCashFlowsStore()
    expect(await store.fetchLabels()).toHaveLength(name === 'empty' ? 0 : 1)
  })

  it('reads daily and monthly stats with or without a data wrapper', async () => {
    const store = useCashFlowsStore()
    vi.mocked(api.getDailyStatsApi).mockResolvedValue({ data: [1] })
    vi.mocked(api.getMonthlyStatsApi).mockResolvedValue([2])
    const result = await store.fetchStats()
    expect(result.daily).toEqual([1])
    expect(result.monthly).toEqual([2])
  })

  it('removes a single cash flow from the list', async () => {
    vi.mocked(api.getCashFlowsApi).mockResolvedValue({ data: [row, { ...row, id: 2 }] })
    const store = useCashFlowsStore()
    await store.fetchCashFlows()
    await store.removeCashFlow(1)
    expect(store.cashFlows.map(x => x.id)).toEqual([2])
    expect(store.isCashFlowDeleted).toBe(true)
  })
})
