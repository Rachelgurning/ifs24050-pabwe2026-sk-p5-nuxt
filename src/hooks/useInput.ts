import { computed, ref, type Ref } from 'vue'
export function useInput<T>(initialValue: T): { value: Ref<T>; reset: () => void; setValue: (value: T) => void; isDirty: Readonly<Ref<boolean>> } {
  const value = ref(initialValue) as Ref<T>
  const initial = ref(initialValue) as Ref<T>
  const isDirty = computed(() => !Object.is(value.value, initial.value))
  const setValue = (next: T) => { value.value = next }
  const reset = () => { value.value = initial.value }
  return { value, reset, setValue, isDirty }
}
