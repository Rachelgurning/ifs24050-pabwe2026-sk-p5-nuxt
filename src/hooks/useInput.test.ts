import { describe, expect, it } from 'vitest'
import { useInput } from './useInput'
describe('useInput', () => {
  it('tracks changes and resets to initial value', () => {
    const input = useInput('initial')
    expect(input.value.value).toBe('initial'); expect(input.isDirty.value).toBe(false)
    input.setValue('changed'); expect(input.isDirty.value).toBe(true)
    input.reset(); expect(input.value.value).toBe('initial'); expect(input.isDirty.value).toBe(false)
  })
  it('supports non-string values', () => { const input = useInput(1); input.setValue(2); expect(input.value.value).toBe(2) })
})
