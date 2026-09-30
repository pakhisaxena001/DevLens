import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDashboardData } from '../services/dashboardService'

export const useDashboardStore =
  defineStore('dashboard', () => {
    const stats = ref({
      repositoriesAnalyzed: 0,
      bookmarks: 0,
      healthScore: 0,
      recommendations: 0,
      recentAnalyses: 0,
      analysesThisMonth: 0,
    })

    const recentAnalyses =
      ref([])

    const activityHistory =
      ref([])

    const repositories =
      ref([])

    const bookmarks =
      ref([])

    const topLanguages =
      ref([])

    const activity =
      ref([])

    const loading =
      ref(false)

    const error =
      ref(null)

    const fetchDashboardData =
      async () => {
        loading.value = true
        error.value = null

        try {
          const data =
            await getDashboardData()

          stats.value = {
            repositoriesAnalyzed:
              data.stats
                ?.repositoriesAnalyzed ??
              0,

            bookmarks:
              data.stats
                ?.bookmarks ??
              0,

            healthScore:
              data.stats
                ?.healthScore ??
              0,

            recommendations:
              data.stats
                ?.recommendations ??
              0,

            recentAnalyses:
              data.stats
                ?.recentAnalyses ??
              0,

            analysesThisMonth:
              data.stats
                ?.analysesThisMonth ??
              0,
          }

          repositories.value =
            data.repositories ||
            []

          bookmarks.value =
            data.bookmarks ||
            []

          topLanguages.value =
            data.topLanguages ||
            []

          activity.value =
            data.activity ||
            []

          recentAnalyses.value =
            (data.analyses || [])
              .filter(
                (item) =>
                  item.analysis
              )
              .map(
                (item) => ({
                  id:
                    item.analysis
                      .id,

                  repositoryId:
                    item.repository
                      .id,

                  name:
                    `${item.repository.owner}/${item.repository.name}`,

                  health:
                    item.analysis
                      .healthScore ??
                    0,

                  date:
                    item.analysis
                      .analysisDate ||
                    item.analysis
                      .createdAt ||
                    item.repository
                      .updatedAt,

                  aiSummary:
                    item.analysis
                      .aiSummary ||
                    null,

                  recommendations:
                    item.analysis
                      .recommendations ||
                    [],
                })
              )

          return data
        } catch (err) {
          console.error(
            'Failed to fetch dashboard data:',
            err
          )

          error.value =
            err.message ||
            'Failed to load dashboard data'

          throw err
        } finally {
          loading.value = false
        }
      }

    const fetchStats =
      async () => {
        await fetchDashboardData()
        return stats.value
      }

    const fetchRecentAnalyses =
      async () => {
        await fetchDashboardData()
        return recentAnalyses.value
      }

    const fetchActivityHistory =
      async () => {
        return activityHistory.value
      }

    return {
      stats,
      recentAnalyses,
      activityHistory,
      repositories,
      bookmarks,
      topLanguages,
      activity,
      loading,
      error,

      fetchDashboardData,
      fetchStats,
      fetchRecentAnalyses,
      fetchActivityHistory,
    }
  })