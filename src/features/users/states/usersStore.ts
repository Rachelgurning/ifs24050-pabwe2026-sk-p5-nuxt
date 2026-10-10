import { defineStore } from 'pinia'
import { getMeApi, getUsersApi, updateBioApi, updatePasswordApi, uploadAvatarApi, type UserProfile } from '../api/userApi'
export const useUsersStore = defineStore('users', {
  state: () => ({ users: [] as UserProfile[], profile: null as UserProfile | null, isLoading: false, error: '' }),
  actions: {
    async fetchUsers() { this.isLoading = true; try { const r = await getUsersApi(); this.users = r.data?.users || r.data || r.users || []; return this.users } catch (e) { this.error = e instanceof Error ? e.message : 'Gagal memuat pengguna'; throw e } finally { this.isLoading = false } },
    async fetchProfile() { this.isLoading = true; try { const r = await getMeApi(); this.profile = r.data?.user || r.data || r.user || r; return this.profile } finally { this.isLoading = false } },
    async updateBio(bio: string) { const r = await updateBioApi(bio); if (this.profile) { this.profile.bio = bio } return r },
    async uploadAvatar(file: File) { return uploadAvatarApi(file) },
    async updatePassword(oldPassword: string, newPassword: string) { return updatePasswordApi(oldPassword, newPassword) }
  }
})
