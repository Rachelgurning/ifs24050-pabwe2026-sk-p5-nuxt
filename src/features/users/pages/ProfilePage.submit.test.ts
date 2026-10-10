import { describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ProfilePage from './ProfilePage.vue'
import { useUsersStore } from '../states/usersStore'
import { showErrorDialog, showSuccessDialog } from '~/helpers/toolsHelper'

vi.mock('~/helpers/toolsHelper', () => ({ showErrorDialog: vi.fn(), showSuccessDialog: vi.fn() }))

function setup() {
  const pinia = createPinia()
  setActivePinia(pinia)
  const store = useUsersStore(pinia)
  vi.spyOn(store, 'fetchProfile').mockResolvedValue({ name: 'Rachel', bio: 'Halo' } as never)
  return { pinia, store }
}

describe('ProfilePage actions', () => {
  it('saves bio and password successfully', async () => {
    const { pinia, store } = setup()
    const updateBio = vi.spyOn(store, 'updateBio').mockResolvedValue({} as never)
    const updatePassword = vi.spyOn(store, 'updatePassword').mockResolvedValue({} as never)
    const wrapper = mount(ProfilePage, { global: { plugins: [pinia] } })
    await flushPromises()
    const forms = wrapper.findAll('form')
    await forms[0]!.trigger('submit')
    await flushPromises()
    expect(updateBio).toHaveBeenCalledWith('Halo')
    await forms[1]!.trigger('submit')
    await flushPromises()
    expect(updatePassword).toHaveBeenCalled()
    expect(showSuccessDialog).toHaveBeenCalled()
  })

  it('shows error dialogs when requests fail', async () => {
    const { pinia, store } = setup()
    vi.spyOn(store, 'updateBio').mockRejectedValue(new Error('gagal bio'))
    vi.spyOn(store, 'updatePassword').mockRejectedValue('x')
    const wrapper = mount(ProfilePage, { global: { plugins: [pinia] } })
    await flushPromises()
    const forms = wrapper.findAll('form')
    await forms[0]!.trigger('submit')
    await forms[1]!.trigger('submit')
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Gagal menyimpan', 'gagal bio')
    expect(showErrorDialog).toHaveBeenCalledWith('Gagal mengubah password', '')
  })

  it('reports an error when profile cannot be loaded', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    vi.spyOn(useUsersStore(pinia), 'fetchProfile').mockRejectedValue(new Error('offline'))
    mount(ProfilePage, { global: { plugins: [pinia] } })
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Gagal memuat profil', 'offline')
  })
})

describe('ProfilePage avatar upload', () => {
  async function mountWithFile(upload: ReturnType<typeof vi.fn>) {
    const { pinia, store } = setup()
    vi.spyOn(store, 'uploadAvatar').mockImplementation(upload as never)
    const wrapper = mount(ProfilePage, { global: { plugins: [pinia] } })
    await flushPromises()
    return wrapper
  }

  it('does nothing when no file is selected', async () => {
    const upload = vi.fn()
    const wrapper = await mountWithFile(upload)
    const button = wrapper.findAll('button').find(b => /unggah|upload|foto/i.test(b.text()))
    await button?.trigger('click')
    await flushPromises()
    expect(upload).not.toHaveBeenCalled()
  })

  it('uploads the selected file and reports success or failure', async () => {
    const upload = vi.fn().mockResolvedValueOnce({}).mockRejectedValueOnce(new Error('gagal unggah'))
    const wrapper = await mountWithFile(upload)
    const input = wrapper.get('input[type="file"]')
    const file = new File(['a'], 'a.png', { type: 'image/png' })
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
    await input.trigger('change')
    const button = wrapper.findAll('button').find(b => /unggah|upload|foto/i.test(b.text()))
    await button?.trigger('click')
    await flushPromises()
    expect(upload).toHaveBeenCalledWith(file)
    expect(showSuccessDialog).toHaveBeenCalledWith('Foto diunggah', 'Foto profil berhasil dikirim.')
    await button?.trigger('click')
    await flushPromises()
    expect(showErrorDialog).toHaveBeenCalledWith('Gagal mengunggah foto', 'gagal unggah')
  })
})
