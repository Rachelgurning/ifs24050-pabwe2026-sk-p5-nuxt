import { describe, expect, it, vi } from 'vitest'
import { formatDate, formatDateTime, formatRupiah, showConfirmDialog, showErrorDialog, showSuccessDialog } from './toolsHelper'
vi.mock('sweetalert2', () => ({ default: { fire: vi.fn(() => Promise.resolve({ isConfirmed: true })) } }))
describe('formatters', () => {
  it('formats Indonesian rupiah', () => expect(formatRupiah(12000)).toContain('12.000'))
  it('handles invalid rupiah', () => expect(formatRupiah('not-number')).toContain('0'))
  it('formats valid dates', () => { expect(formatDate('2025-01-02')).not.toBe('—'); expect(formatDateTime('2025-01-02T12:00:00Z')).not.toBe('—') })
  it('handles missing and invalid dates', () => { expect(formatDate()).toBe('—'); expect(formatDate('bad')).toBe('—'); expect(formatDateTime(null)).toBe('—'); expect(formatDateTime('bad')).toBe('—') })
})
describe('dialogs', () => { it('exposes dialog helpers', async () => { await showSuccessDialog('ok'); await showErrorDialog('oops'); await showConfirmDialog('confirm'); expect(true).toBe(true) }) })
