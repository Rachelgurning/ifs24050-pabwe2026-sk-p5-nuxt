import { apiFetch } from '~/helpers/apiHelper'
export type CashFlowType = 'inflow' | 'outflow'
export type CashFlowSource = 'cash' | 'savings' | 'loans'
export interface CashFlow { id: number | string; type: CashFlowType; source: CashFlowSource; label: string; nominal: number; description?: string; created_at?: string; updated_at?: string }
export interface CashFlowQueryParams { type?: CashFlowType | ''; source?: CashFlowSource | ''; label?: string; start_date?: string; end_date?: string }
export interface CashFlowStats { total_inflow: number; total_outflow: number; cash: number; savings: number; loans: number; [key: string]: number }
const queryString = (params: CashFlowQueryParams = {}) => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => { if (value !== undefined && value !== null && value !== '') query.set(key, String(value)) })
  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}
export async function getCashFlowsApi(params: CashFlowQueryParams = {}) { return apiFetch<any>(`/cash-flows${queryString(params)}`) }
export async function getCashFlowApi(id: number | string) { return apiFetch<any>(`/cash-flows/${encodeURIComponent(id)}`) }
export async function createCashFlowApi(payload: Omit<CashFlow, 'id' | 'created_at' | 'updated_at'>) { return apiFetch<any>('/cash-flows', { method: 'POST', body: JSON.stringify(payload) }) }
export async function updateCashFlowApi(id: number | string, payload: Partial<Omit<CashFlow, 'id'>>) { return apiFetch<any>(`/cash-flows/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) }) }
export async function deleteCashFlowApi(id: number | string) { return apiFetch<any>(`/cash-flows/${encodeURIComponent(id)}`, { method: 'DELETE' }) }
export async function getCashFlowLabelsApi() { return apiFetch<any>('/cash-flows/labels') }
export async function getDailyStatsApi() { return apiFetch<any>('/cash-flows/stats/daily') }
export async function getMonthlyStatsApi() { return apiFetch<any>('/cash-flows/stats/monthly') }
export async function deleteAllCashFlowsApi() { return apiFetch<any>('/cash-flows', { method: 'DELETE' }) }
