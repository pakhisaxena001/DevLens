import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import * as authService from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const user = ref(null)
  const token = ref(localStorage.getItem('authToken'))
  const isLoading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() =>
    Boolean(token.value && user.value)
  )

  const saveSession = (data) => {
    if (!data.token) return data

    token.value = data.token
    user.value = data.user || null

    localStorage.setItem('authToken', data.token)

    return data
  }

  const runAuthentication = async (action) => {
    isLoading.value = true
    error.value = null

    try {
      return saveSession(await action())
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = (name, email, password) =>
    runAuthentication(() =>
      authService.register({
        name,
        email,
        password,
      })
    )

  const login = (email, password) =>
    runAuthentication(() =>
      authService.login({
        email,
        password,
      })
    )

  const logout = async () => {
    try {
      if (token.value) {
        await authService.logout()
      }
    } catch {
      // Local logout must still work if the API is unavailable.
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('authToken')
      error.value = null

      router.push('/')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const restoreSession = async () => {
    if (!token.value) return

    try {
      user.value = (
        await authService.getCurrentUser()
      ).user
    } catch {
      await logout()
    }
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    setUser,
    restoreSession,
  }
})
