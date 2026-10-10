```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../states/authStore'
import { showErrorDialog } from '~/helpers/toolsHelper'

const auth = useAuthStore()
const email = ref('')
const password = ref('')

async function submit() {
  try {
    await auth.login(email.value, password.value)
    await navigateTo('/')
  } catch (e) {
    await showErrorDialog(
      'Login gagal',
      e instanceof Error ? e.message : 'Periksa kredensial Anda'
    )
  }
}
</script>

<template>
  <div>
    <p class="text-sm font-bold uppercase tracking-widest text-indigo-600">
      Selamat datang kembali
    </p>

    <h1 class="mt-2 text-3xl font-extrabold">
      Masuk ke akunmu
    </h1>

    <p class="mt-2 text-sm text-slate-600">
      Kelola transaksi dan pantau kondisi keuanganmu.
    </p>

    <form class="mt-8 space-y-5" @submit.prevent="submit">
      <label class="block text-sm font-semibold">
        Email
        <input
          id="login-email-input"
          v-model.trim="email"
          required
          type="email"
          autocomplete="username"
          class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="Masukkan email"
        />
      </label>

      <label class="block text-sm font-semibold">
        Password
        <input
          id="login-password-input"
          v-model="password"
          required
          type="password"
          autocomplete="current-password"
          class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          placeholder="Masukkan password"
        />
      </label>

      <button
        id="login-submit-button"
        type="submit"
        :disabled="auth.isLoading"
        class="w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-60"
      >
        {{ auth.isLoading ? 'Memproses...' : 'Masuk' }}
      </button>
    </form>

    <p class="mt-6 text-center text-sm text-slate-600">
      Belum punya akun?
      <NuxtLink
        class="font-bold text-indigo-700"
        to="/auth/register"
      >
        Daftar sekarang
      </NuxtLink>
    </p>
  </div>
</template>
```