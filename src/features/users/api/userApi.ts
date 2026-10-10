import { apiFetch } from '~/helpers/apiHelper'
export interface UserProfile { id?: number | string; name?: string; username?: string; email?: string; bio?: string; photo?: string; created_at?: string }
export async function getUsersApi() { return apiFetch<any>('/users') }
export async function getMeApi() { return apiFetch<any>('/users/me') }
export async function updateBioApi(bio: string) { return apiFetch<any>('/users/me', { method: 'PUT', body: JSON.stringify({ bio }) }) }
export async function uploadAvatarApi(file: File) { const body = new FormData(); body.append('photo', file); return apiFetch<any>('/users/me/photo', { method: 'POST', body }) }
export async function updatePasswordApi(old_password: string, new_password: string) { return apiFetch<any>('/users/me/password', { method: 'PUT', body: JSON.stringify({ old_password, new_password }) }) }
