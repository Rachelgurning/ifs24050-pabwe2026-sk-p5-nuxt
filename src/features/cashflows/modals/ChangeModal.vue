<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CashFlow } from '../api/cashFlowApi'
const props = defineProps<{ cashFlow: CashFlow }>()
const emit = defineEmits<{ submit: [payload: Partial<Omit<CashFlow,'id'>>]; close: [] }>()
const form = reactive({ type: props.cashFlow.type, source: props.cashFlow.source, label: props.cashFlow.label, nominal: props.cashFlow.nominal, description: props.cashFlow.description || '' })
watch(() => props.cashFlow, v => Object.assign(form, v), { deep: true })
</script>
<template><form class="space-y-3" @submit.prevent="emit('submit', { ...form })"><select v-model="form.type" class="w-full rounded-xl border p-3"><option value="inflow">Inflow</option><option value="outflow">Outflow</option></select><select v-model="form.source" class="w-full rounded-xl border p-3"><option value="cash">Tunai</option><option value="savings">Tabungan</option><option value="loans">Pinjaman</option></select><input v-model.trim="form.label" required class="w-full rounded-xl border p-3"/><input v-model.number="form.nominal" required min="1" type="number" class="w-full rounded-xl border p-3"/><textarea v-model="form.description" class="w-full rounded-xl border p-3"/><div class="flex justify-end gap-2"><button type="button" @click="emit('close')" class="rounded-xl border px-4 py-2">Batal</button><button class="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white">Simpan perubahan</button></div></form></template>
