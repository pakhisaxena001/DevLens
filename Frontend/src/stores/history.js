import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAnalysisHistory } from '@/services/historyService'

export const useHistoryStore = defineStore('history', () => {
  const analyses = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchAnalyses = async () => {
    isLoading.value = true
    error.value = null

    try {
      const results = await getAnalysisHistory()

      analyses.value = results.map((item) => ({
        id: item.analysis.id,
        repositoryId: item.repository.id,
        name: `${item.repository.owner}/${item.repository.name}`,
        health: item.analysis.healthScore ?? 0,
        date:
          item.analysis.analysisDate ||
          item.analysis.createdAt ||
          item.repository.updatedAt,
        status: 'completed',
      }))

      return analyses.value
    } catch (err) {
      console.error('Failed to fetch analysis history:', err)
      error.value = err.message || 'Failed to load analysis history'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteAnalysis = async (id) => {
    console.warn('Delete analysis is not available yet')
  }

  const downloadReport = async (id) => {
    console.warn('Download report is not available yet')
  }

  return {
    analyses,
    isLoading,
    error,
    fetchAnalyses,
    deleteAnalysis,
    downloadReport,
  }
})