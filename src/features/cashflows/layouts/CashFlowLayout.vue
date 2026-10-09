<script setup lang="ts">
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import { useAuthStore } from '~/features/auth/states/authStore'
const auth = useAuthStore()
onMounted(() => { if (!auth.isAuthenticated) navigateTo('/auth/login') })
</script>
<template><div class="min-h-screen bg-[#f6f8fc]"><NavbarComponent /><div class="mx-auto flex max-w-[1600px] flex-col md:flex-row"><SidebarComponent /><main class="min-w-0 flex-1 p-5 md:p-8"><RouterView /></main></div></div></template>
