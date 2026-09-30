import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as profileService from '@/services/profileService'

export const useProfileStore = defineStore('profile', () => {
  const user = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const fetchProfile = async () => {
    isLoading.value = true
    try {
      user.value = (await profileService.getProfile()).user
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    isLoading.value = true
    try {
      const data = await profileService.updateProfile(profileData)
      user.value = data.user || { ...user.value, ...profileData }
      return data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }
  return { user, isLoading, error, fetchProfile, updateProfile }
})
