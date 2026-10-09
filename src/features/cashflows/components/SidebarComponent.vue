<script setup lang="ts">
import { useRoute } from 'vue-router'
import { LayoutDashboard, Users, UserRound, Wallet } from 'lucide-vue-next'
const route = useRoute()
const links = [{ to: '/', label: 'Ringkasan Arus Kas', icon: LayoutDashboard }, { to: '/users', label: 'Direktori Pengguna', icon: Users }, { to: '/profile', label: 'Profil Saya', icon: UserRound }]
</script>
<template><aside class="w-full shrink-0 border-b border-slate-200 bg-white p-4 md:min-h-[calc(100vh-76px)] md:w-64 md:border-b-0 md:border-r"><div class="mb-3 flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-400"><Wallet :size="16" /> Menu utama</div><nav class="flex gap-2 overflow-x-auto md:flex-col"><NuxtLink v-for="link in links" :key="link.to" :to="link.to" class="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition" :class="route.path === link.to ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'"><component :is="link.icon" :size="18" />{{ link.label }}</NuxtLink></nav><div class="mt-8 hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-4 text-white md:block"><p class="text-sm font-bold">Keuangan lebih tertata</p><p class="mt-2 text-xs leading-5 text-indigo-100">Catat transaksi secara rutin untuk memahami kebiasaan finansialmu.</p></div></aside></template>
