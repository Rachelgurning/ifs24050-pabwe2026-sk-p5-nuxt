<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '~/features/auth/states/authStore'
import { useUsersStore } from '~/features/users/states/usersStore'

const auth = useAuthStore()
const users = useUsersStore()

const displayName = computed(() => {
  return (
    users.profile?.name ||
    auth.user?.name ||
    auth.user?.email ||
    'Pengguna'
  )
})

const displayUsername = computed(() => {
  return (
    users.profile?.username ||
    auth.user?.email ||
    'akun'
  )
})

function logout() {
  auth.logout()
  navigateTo('/auth/login')
}
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur md:px-8"
  >
    <NuxtLink
      to="/"
      class="text-xl font-extrabold tracking-tight text-indigo-700"
    >
      delcom<span class="text-slate-600">.</span>
    </NuxtLink>

    <div class="flex items-center gap-3">
      <div class="hidden text-right sm:block">
        <p class="text-sm font-bold">
          {{ displayName }}
        </p>

        <p class="text-xs text-slate-600">
          @{{ displayUsername }}
        </p>
      </div>

      <div
        class="grid h-10 w-10 place-items-center rounded-full bg-indigo-100 font-bold text-indigo-700"
      >
        {{ displayName.slice(0, 1).toUpperCase() }}
      </div>

      <button
        type="button"
        @click="logout"
        class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"
      >
        Keluar
      </button>
    </div>
  </header>
</template>
