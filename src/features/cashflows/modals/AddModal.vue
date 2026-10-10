<script setup lang="ts">
import { reactive } from 'vue'
import type { CashFlow } from '../api/cashFlowApi'
const emit = defineEmits<{ submit: [payload: Omit<CashFlow,'id'|'created_at'|'updated_at'>]; close: [] }>()
const form = reactive({ type: 'inflow' as 'inflow'|'outflow', source: 'cash' as 'cash'|'savings'|'loans', label: '', nominal: 0, description: '' })
function submit() { emit('submit', { ...form }) }
</script>
<template><form class="space-y-3" @submit.prevent="submit"><select v-model="form.type" aria-label="Jenis arus kas" class="w-full rounded-xl border p-3"><option value="inflow">Inflow</option><option value="outflow">Outflow</option></select><select v-model="form.source" aria-label="Sumber dana" class="w-full rounded-xl border p-3"><option value="cash">Tunai</option><option value="savings">Tabungan</option><option value="loans">Pinjaman</option></select><input v-model.trim="form.label" aria-label="Label kategori" required placeholder="Label kategori" class="w-full rounded-xl border p-3"/><input v-model.number="form.nominal" aria-label="Nominal" required min="1" type="number" placeholder="Nominal" class="w-full rounded-xl border p-3"/><textarea aria-label="Deskripsi" v-model="form.description" placeholder="Deskripsi" class="w-full rounded-xl border p-3"/><div class="flex justify-end gap-2"><button type="button" @click="emit('close')" class="rounded-xl border px-4 py-2">Batal</button><button class="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white">Simpan</button></div></form></template>
