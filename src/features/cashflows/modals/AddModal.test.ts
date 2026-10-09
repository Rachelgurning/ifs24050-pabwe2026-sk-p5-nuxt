import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AddModal from './AddModal.vue'

describe('AddModal UI', () => {
  it('emits a transaction payload when the form is submitted', async () => {
    const wrapper = mount(AddModal)
    await wrapper.get('input[placeholder="Label kategori"]').setValue('Makan')
    await wrapper.get('input[placeholder="Nominal"]').setValue('25000')
    await wrapper.get('textarea[placeholder="Deskripsi"]').setValue('Makan siang')
    await wrapper.get('form').trigger('submit')
    expect(wrapper.emitted('submit')?.[0]?.[0]).toEqual({
      type: 'inflow', source: 'cash', label: 'Makan', nominal: 25000, description: 'Makan siang'
    })
  })

  it('emits close when cancel is clicked', async () => {
    const wrapper = mount(AddModal)
    await wrapper.get('button[type="button"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
