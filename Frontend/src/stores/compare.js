import { defineStore } from 'pinia'
import { ref } from 'vue'
import { syncRepository } from '@/services/repositoryService'
import { compareRepositories } from '@/services/compareService'

export const useCompareStore = defineStore('compare', () => {
  const repositories = ref([])
  const comparison = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const addRepository = async (repoUrl) => {
    if (repositories.value.length >= 2) {
      throw new Error('You can compare up to 2 repositories')
    }

    isLoading.value = true
    error.value = null

    try {
      const data = await syncRepository({ url: repoUrl })

      const repository =
        data.repository ||
        data.data?.repository ||
        data.data ||
        data

      if (
        repositories.value.some(
          (item) => item.id === repository.id
        )
      ) {
        throw new Error('Repository is already selected')
      }

      repositories.value.push(repository)

      return repository
    } catch (err) {
      error.value = err.message || 'Failed to add repository'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeRepository = (index) => {
    repositories.value.splice(index, 1)
    comparison.value = []
  }

  const clearAll = () => {
    repositories.value = []
    comparison.value = []
  }

  const compare = async () => {
    if (repositories.value.length !== 2) {
      throw new Error('Select 2 repositories to compare')
    }

    isLoading.value = true
    error.value = null

    try {
      comparison.value = await compareRepositories(
        repositories.value.map((repository) => repository.id)
      )

      return comparison.value
    } catch (err) {
      error.value = err.message || 'Failed to compare repositories'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    repositories,
    comparison,
    isLoading,
    error,
    addRepository,
    removeRepository,
    clearAll,
    compare,
  }
})