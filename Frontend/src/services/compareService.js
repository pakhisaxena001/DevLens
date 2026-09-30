import { getRepository, getRepositoryDetails } from './repositoryService'
import { getAnalysis } from './historyService'

export const compareRepositories = async (repositoryIds) => {
  const results = await Promise.all(
    repositoryIds.map(async (repositoryId) => {
      const [repositoryResponse, detailsResponse] = await Promise.all([
        getRepository(repositoryId),
        getRepositoryDetails(repositoryId),
      ])

      let analysis = null

      try {
        const analysisResponse = await getAnalysis(repositoryId)
        analysis = analysisResponse.analysis || null
      } catch (error) {
        console.warn(`No analysis found for repository ${repositoryId}`)
      }

      return {
        repository:
          repositoryResponse.repository ||
          repositoryResponse.data ||
          repositoryResponse,

        details:
          detailsResponse.details ||
          detailsResponse.repository ||
          detailsResponse,

        analysis,
      }
    })
  )

  return results
}