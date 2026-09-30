import { getBookmarks } from './bookmarkService'
import { getUserRepositories } from './repositoryService'
import { getAnalysis } from './historyService'

const getAnalysisFromResponse = (response) => {
  return (
    response?.analysis ||
    response?.data?.analysis ||
    response?.data ||
    null
  )
}

const getMonthKey = (date) => {
  if (!date) return null

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return null
  }

  return `${value.getFullYear()}-${String(
    value.getMonth() + 1
  ).padStart(2, '0')}`
}

const getDateKey = (date) => {
  if (!date) return null

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return null
  }

  return `${value.getFullYear()}-${String(
    value.getMonth() + 1
  ).padStart(2, '0')}-${String(
    value.getDate()
  ).padStart(2, '0')}`
}

const formatActivityLabel = (date) => {
  if (!date) return ''

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  return value.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export const getDashboardData = async () => {
  // ==================================================
  // Load repositories + bookmarks
  // ==================================================
  const [
    repositoryResponse,
    bookmarkResponse,
  ] = await Promise.all([
    getUserRepositories(),
    getBookmarks(),
  ])

  const repositories =
    repositoryResponse?.repositories ||
    repositoryResponse?.data?.repositories ||
    []

  const bookmarks =
    bookmarkResponse?.bookmarks ||
    bookmarkResponse?.data?.bookmarks ||
    []

  // ==================================================
  // Load analysis for every repository
  // ==================================================
  const analysisResults =
    await Promise.all(
      repositories.map(async (repository) => {
        try {
          const response =
            await getAnalysis(repository.id)

          const analysis =
            getAnalysisFromResponse(response)

          return {
            repository,
            analysis,
          }
        } catch (error) {
          return {
            repository,
            analysis: null,
          }
        }
      })
    )

  const validAnalyses =
    analysisResults.filter(
      (item) => item.analysis
    )

  // ==================================================
  // Health score
  // ==================================================
  const healthScores =
    validAnalyses
      .map(
        (item) =>
          item.analysis?.healthScore
      )
      .filter(
        (score) =>
          typeof score === 'number'
      )

  const averageHealthScore =
    healthScores.length
      ? Math.round(
          healthScores.reduce(
            (sum, score) =>
              sum + score,
            0
          ) /
            healthScores.length
        )
      : 0

  // ==================================================
  // Recommendations
  // ==================================================
  const recommendationCount =
    validAnalyses.reduce(
      (total, item) => {
        const recommendations =
          item.analysis?.recommendations

        return (
          total +
          (Array.isArray(
            recommendations
          )
            ? recommendations.length
            : 0)
        )
      },
      0
    )

  // ==================================================
  // Analyses this month
  // ==================================================
  const now = new Date()

  const currentMonthKey =
    `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, '0')}`

  const analysesThisMonth =
    validAnalyses.filter(
      (item) => {
        const date =
          item.analysis?.analysisDate ||
          item.analysis?.createdAt

        return (
          getMonthKey(date) ===
          currentMonthKey
        )
      }
    ).length

  // ==================================================
  // Top Languages
  //
  // Use the primary language already stored with
  // each repository. This avoids expensive GitHub
  // repository-details requests.
  // ==================================================
  const languageCounts = {}

  repositories.forEach((repository) => {
    const language =
      repository?.language

    if (!language) return

    languageCounts[language] =
      (languageCounts[language] || 0) + 1
  })

  const sortedLanguages =
    Object.entries(languageCounts)
      .sort(
        ([, a], [, b]) =>
          b - a
      )

  const totalRepositoriesWithLanguage =
    sortedLanguages.reduce(
      (sum, [, count]) =>
        sum + count,
      0
    )

  const topLanguages =
    sortedLanguages
      .slice(0, 4)
      .map(
        ([name, count]) => ({
          name,
          count,
          percentage:
            totalRepositoriesWithLanguage
              ? Math.round(
                  (count /
                    totalRepositoriesWithLanguage) *
                    100
                )
              : 0,
        })
      )

  // Put everything after the first 4 languages
  // into "Other".
  const otherCount =
    sortedLanguages
      .slice(4)
      .reduce(
        (sum, [, count]) =>
          sum + count,
        0
      )

  if (
    otherCount > 0 &&
    totalRepositoriesWithLanguage > 0
  ) {
    topLanguages.push({
      name: 'Other',
      count: otherCount,
      percentage: Math.round(
        (otherCount /
          totalRepositoriesWithLanguage) *
          100
      ),
    })
  }

  // ==================================================
  // Recent analyses
  // ==================================================
  const analyses =
    analysisResults
      .filter(
        (item) =>
          item.analysis
      )
      .sort(
        (a, b) => {
          const dateA =
            new Date(
              a.analysis?.analysisDate ||
              a.analysis?.createdAt ||
              0
            )

          const dateB =
            new Date(
              b.analysis?.analysisDate ||
              b.analysis?.createdAt ||
              0
            )

          return dateB - dateA
        }
      )

  // ==================================================
  // Activity data
  //
  // This represents actual analysis activity
  // currently available from the backend.
  // ==================================================
  const activityMap = {}

  validAnalyses.forEach(
    (item) => {
      const date =
        item.analysis?.analysisDate ||
        item.analysis?.createdAt

      const key =
        getDateKey(date)

      if (!key) return

      activityMap[key] =
        (activityMap[key] || 0) +
        1
    }
  )

  const activity = []

  for (let i = 6; i >= 0; i--) {
    const date =
      new Date()

    date.setDate(
      date.getDate() - i
    )

    const key =
      getDateKey(date)

    activity.push({
      date: key,
      label:
        formatActivityLabel(
          date
        ),
      value:
        activityMap[key] || 0,
    })
  }

  // ==================================================
  // Return Dashboard data
  // ==================================================
  return {
    repositories,
    bookmarks,

    analyses:
      analysisResults,

    topLanguages,

    activity,

    stats: {
      repositoriesAnalyzed:
        validAnalyses.length,

      bookmarks:
        bookmarks.length,

      healthScore:
        averageHealthScore,

      recommendations:
        recommendationCount,

      recentAnalyses:
        validAnalyses.length,

      analysesThisMonth,
    },

    meta: {
      totalRepositoriesWithLanguage,
    },
  }
}