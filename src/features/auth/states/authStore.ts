import { defineStore } from 'pinia'
import { loginApi, registerApi, type AuthUser } from '../api/authApi'
import { getAccessToken, putAccessToken } from '~/helpers/apiHelper'
export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null as AuthUser | null, token: getAccessToken(), isLoading: false, error: '' }),
  getters: { isAuthenticated: state => Boolean(state.token) },
  actions: {
    async login(email: string, password: string) {
      this.isLoading = true; this.error = ''
      try {
        const result = await loginApi({ email, password })
        this.token = getAccessToken()
        this.user = result.data?.user || { email }
        return result
      } catch (error) { this.error = error instanceof Error ? error.message : 'Login gagal'; throw error }
      finally { this.isLoading = false }
    },
    async register(payload: { name: string; email: string; password: string }) {
      this.isLoading = true; this.error = ''
      try { return await registerApi(payload) }
      catch (error) { this.error = error instanceof Error ? error.message : 'Registrasi gagal'; throw error }
      finally { this.isLoading = false }
    },
    logout() { putAccessToken(null); this.token = null; this.user = null; this.error = '' }
  }
})
