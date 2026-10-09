import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChangeModal from './ChangeModal.vue'

const cashFlow = { id: 3, type: 'outflow' as const, source: 'savings' as const, label: 'Belanja', nominal: 45000, description: 'Kebutuhan', created_at: '2026-10-01' }

describe('ChangeModal UI', () => {
  it('initializes with current values and emits changed payload', async () => {
    const wrapper = mount(ChangeModal, { props: { cashFlow } })
    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Belanja')
    await wrapper.get('input').setValue('Belanja rumah')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual(expect.objectContaining({ label: 'Belanja rumah', nominal: 45000, source: 'savings' }))
  })

  it('emits close when cancel is clicked', async () => {
    const wrapper = mount(ChangeModal, { props: { cashFlow } })
    await wrapper.get('button[type="button"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
