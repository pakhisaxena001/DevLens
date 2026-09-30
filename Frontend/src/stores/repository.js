import { defineStore } from 'pinia'
import { ref } from 'vue'

import * as repositoryService from '@/services/repositoryService'
import * as analysisService from '@/services/historyService'

export const useRepositoryStore = defineStore('repository', () => {
  const currentRepository = ref(null)
  const analysisResults = ref(null)

  const isAnalyzing = ref(false)
  const error = ref(null)

  // ==================================================
  // Analyze repository
  // ==================================================
  const analyzeRepository = async (repoUrl) => {
    isAnalyzing.value = true
    error.value = null

    try {
      // ------------------------------------------------
      // STEP 1: Sync repository
      // ------------------------------------------------
      const repositoryResponse =
        await repositoryService.syncRepository({
          url: repoUrl,
        })

      const syncData =
        repositoryResponse.data ||
        repositoryResponse

      const repository =
        syncData.repository ||
        null

      if (!repository?.id) {
        console.error(
          'Unexpected repository sync response:',
          repositoryResponse
        )

        throw new Error(
          'Repository was synced but no repository ID was returned.'
        )
      }

      currentRepository.value = {
        ...repository,

        metrics:
          syncData.metrics || null,

        languages:
          syncData.languages || null,
      }

      // ------------------------------------------------
      // STEP 2: Create analysis
      // ------------------------------------------------
      const analysisResponse =
        await analysisService.createAnalysis(
          repository.id,
          {}
        )

      const createdAnalysis =
        analysisResponse.analysis ||
        analysisResponse.data?.analysis ||
        analysisResponse.data ||
        null

      // ------------------------------------------------
      // STEP 3: Fetch saved analysis
      // ------------------------------------------------
      const savedAnalysisResponse =
        await analysisService.getAnalysis(
          repository.id
        )

      const savedAnalysis =
        savedAnalysisResponse.analysis ||
        savedAnalysisResponse.data?.analysis ||
        savedAnalysisResponse.data ||
        createdAnalysis ||
        null

      analysisResults.value =
        savedAnalysis

      return {
        repository:
          currentRepository.value,

        analysis:
          savedAnalysis,
      }
    } catch (err) {
      console.error(
        'Repository analysis failed:',
        err
      )

      error.value =
        err.message ||
        'Failed to analyze repository.'

      throw err
    } finally {
      isAnalyzing.value = false
    }
  }

  // ==================================================
  // Get user's repositories
  // ==================================================
  const getUserRepositories = async () => {
    try {
      const response =
        await repositoryService.getUserRepositories()

      const repositories =
        response.repositories ||
        response.data?.repositories ||
        response.data ||
        []

      return repositories
    } catch (err) {
      error.value =
        err.message ||
        'Failed to load repositories.'

      throw err
    }
  }

  // ==================================================
  // Load latest repository
  // ==================================================
  const loadLatestRepository = async () => {
    try {
      const repositories =
        await getUserRepositories()

      if (!repositories.length) {
        throw new Error(
          'No repositories have been analyzed yet.'
        )
      }

      /*
       * Backend already returns repositories ordered
       * by updatedAt descending.
       *
       * So the first repository is the latest one.
       */
      const repository =
        repositories[0]

      currentRepository.value =
        repository

      return repository
    } catch (err) {
      error.value =
        err.message ||
        'Failed to load latest repository.'

      throw err
    }
  }

  // ==================================================
  // Get repository details
  // ==================================================
  const getRepositoryDetails = async (id) => {
    try {
      const response =
        await repositoryService.getRepositoryDetails(
          id
        )

      const details =
        response.details ||
        response.data?.details ||
        response.data ||
        response

      if (details.repository) {
        currentRepository.value = {
          ...details.repository,

          metrics:
            details.metrics || null,

          languages:
            details.languages || null,

          commits:
            details.commits || [],

          issues:
            details.issues || [],

          pullRequests:
            details.pullRequests || [],

          contributors:
            details.contributors || [],
        }
      } else {
        currentRepository.value =
          details
      }

      return currentRepository.value
    } catch (err) {
      error.value =
        err.message ||
        'Failed to load repository details.'

      throw err
    }
  }

  // ==================================================
  // Get analysis / AI insights
  // ==================================================
  const getInsights = async (id) => {
    const response =
      await analysisService.getAnalysis(id)

    const analysis =
      response.analysis ||
      response.data?.analysis ||
      response.data ||
      response

    analysisResults.value =
      analysis

    return analysis
  }

  // ==================================================
  // Get analysis history
  // ==================================================
  const getHistory = async (id) => {
    const response =
      await analysisService.getAnalysis(id)

    return (
      response.analysis ||
      response.data?.analysis ||
      response.data ||
      response
    )
  }

  return {
    currentRepository,
    analysisResults,
    isAnalyzing,
    error,

    analyzeRepository,
    getUserRepositories,
    loadLatestRepository,
    getRepositoryDetails,
    getInsights,
    getHistory,
  }
})