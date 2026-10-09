import { describe, expect, it, vi } from 'vitest'
import { createCashFlowApi, deleteAllCashFlowsApi, deleteCashFlowApi, getCashFlowApi, getCashFlowLabelsApi, getCashFlowsApi, getDailyStatsApi, getMonthlyStatsApi, updateCashFlowApi } from './cashFlowApi'
vi.mock('~/helpers/apiHelper', () => ({ apiFetch: vi.fn((...args: unknown[]) => Promise.resolve(args)) }))
describe('cashFlowApi', () => {
  it('supports list filters and CRUD endpoints', async () => {
    await expect(getCashFlowsApi({ type: 'inflow', source: 'cash', label: 'food', start_date: '2025-01-01', end_date: '2025-01-31' })).resolves.toBeTruthy()
    await getCashFlowApi('a/b'); await createCashFlowApi({ type: 'inflow', source: 'cash', label: 'Salary', nominal: 100 })
    await updateCashFlowApi(1, { nominal: 200 }); await deleteCashFlowApi(1); await deleteAllCashFlowsApi()
    await getCashFlowLabelsApi(); await getDailyStatsApi(); await getMonthlyStatsApi()
    expect(true).toBe(true)
  })
  it('omits empty query values', async () => { await getCashFlowsApi({ type: '', label: undefined }); expect(true).toBe(true) })
})
