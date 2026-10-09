import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCashFlowsStore } from './cashFlowsStore'
vi.mock('../api/cashFlowApi', () => ({
 getCashFlowsApi: vi.fn().mockResolvedValue({ data: { cash_flows: [{ id: 1, type: 'inflow', source: 'cash', label: 'Salary', nominal: 10 }], stats: { total_inflow: 10 } } }),
 getCashFlowApi: vi.fn().mockResolvedValue({ data: { id: 1, type: 'inflow', source: 'cash', label: 'Salary', nominal: 10 } }),
 getCashFlowLabelsApi: vi.fn().mockResolvedValue({ data: ['Salary'] }), getDailyStatsApi: vi.fn().mockResolvedValue({ data: [] }), getMonthlyStatsApi: vi.fn().mockResolvedValue({ data: [] }),
 createCashFlowApi: vi.fn(), updateCashFlowApi: vi.fn(), deleteCashFlowApi: vi.fn(), deleteAllCashFlowsApi: vi.fn()
}))
describe('cash flows store', () => {
 beforeEach(() => setActivePinia(createPinia()))
 it('loads, mutates, and resets cash flow data', async () => { const s=useCashFlowsStore(); await s.fetchCashFlows(); await s.fetchCashFlow(1); await s.fetchLabels(); await s.fetchStats(); await s.addCashFlow({type:'inflow',source:'cash',label:'Salary',nominal:10}); await s.changeCashFlow(1,{nominal:20}); await s.removeCashFlow(1); await s.removeAllCashFlows(); expect(s.cashFlows).toEqual([]); expect(s.isCashFlowDeletedAll).toBe(true) })
})
