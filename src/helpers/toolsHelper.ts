const loadSwal = async () => (await import('sweetalert2')).default
export const showSuccessDialog = (title: string, text = '') => loadSwal().then((Swal) => Swal.fire({ icon: 'success', title, text, confirmButtonText: 'Mengerti', confirmButtonColor: '#4f46e5' }))
export const showErrorDialog = (title: string, text = '') => loadSwal().then((Swal) => Swal.fire({ icon: 'error', title, text, confirmButtonText: 'Tutup', confirmButtonColor: '#4f46e5' }))
export const showConfirmDialog = (title: string, text = '') => loadSwal().then((Swal) => Swal.fire({ icon: 'warning', title, text, showCancelButton: true, confirmButtonText: 'Ya, lanjutkan', cancelButtonText: 'Batal', confirmButtonColor: '#dc2626' }))
export function formatRupiah(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0)
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number.isFinite(amount) ? amount : 0)
}
export function formatDate(value?: string | Date | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}
export function formatDateTime(value?: string | Date | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}
