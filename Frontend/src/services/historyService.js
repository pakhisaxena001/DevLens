import api from './api'
import { getUserRepositories } from './repositoryService'

export const getAnalysis = (repositoryId) =>
  api.get(`/analysis/${repositoryId}`)

export const createAnalysis = (repositoryId, analysis) =>
  api.post(`/analysis/${repositoryId}`, analysis)

export const updateAnalysis = (analysisId, updates) =>
  api.put(`/analysis/${analysisId}`, updates)

export const getRepositoryScore = (repositoryId) =>
  api.get(`/analysis/${repositoryId}/score`)

export const getMetrics = (repositoryId) =>
  api.get(`/analysis/${repositoryId}/metrics`)

export const getAnalysisHistory = async () => {
  const repositoryResponse = await getUserRepositories()
  const repositories = repositoryResponse.repositories || []

  const results = await Promise.all(
    repositories.map(async (repository) => {
      try {
        const response = await getAnalysis(repository.id)

        return {
          repository,
          analysis: response.analysis || null,
        }
      } catch (error) {
        console.error(
          `Failed to load analysis for ${repository.name}:`,
          error
        )

        return null
      }
    })
  )

  return results.filter(Boolean)
}