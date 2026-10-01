<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepositoryStore } from '@/stores/repository'
import { useBookmarkStore } from '@/stores/bookmark'
import {
  Star,
  Share2,
  Eye,
  GitBranch,
  Users,
  CircleAlert,
  GitPullRequest,
  ShieldCheck,
  FileText,
  Gauge,
  Code2,
  Sparkles,
  GitCommit,
  Activity,
} from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const repositoryStore = useRepositoryStore()
const bookmarkStore = useBookmarkStore()

const repository = ref(null)
const analysis = ref(null)
const isBookmarked = ref(false)
const activeTab = ref('overview')
const loading = ref(true)
const error = ref('')

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'health', label: 'Health Score' },
  { id: 'ai', label: 'AI Insights' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'contributors', label: 'Contributors' },
  { id: 'commits', label: 'Commits' },
  { id: 'languages', label: 'Languages' },
]

const healthScore = computed(() =>
  analysis.value?.healthScore ??
  analysis.value?.scores?.healthScore ??
  0
)

const stars = computed(() => repository.value?.stars ?? 0)
const forks = computed(() => repository.value?.forks ?? 0)
const watchers = computed(() => repository.value?.watchers ?? 0)

const openIssues = computed(() =>
  repository.value?.openIssues ??
  analysis.value?.issues ??
  analysis.value?.metrics?.issues ??
  repository.value?.metrics?.issues ??
  0
)

const contributors = computed(() =>
  analysis.value?.contributors ??
  analysis.value?.metrics?.contributors ??
  repository.value?.metrics?.contributors ??
  0
)

const commits = computed(() =>
  analysis.value?.commits ??
  analysis.value?.metrics?.commits ??
  repository.value?.metrics?.commits ??
  0
)

const pullRequests = computed(() =>
  analysis.value?.pullRequests ??
  analysis.value?.metrics?.pullRequests ??
  repository.value?.metrics?.pullRequests ??
  0
)

const repositoryLanguage = computed(() =>
  repository.value?.language || 'Unknown'
)

const repositoryLicense = computed(() =>
  repository.value?.license?.name ||
  repository.value?.license ||
  null
)

const repositoryHomepage = computed(() =>
  repository.value?.homepage ||
  repository.value?.url ||
  null
)

const codeQualityScore = computed(() =>
  analysis.value?.codeQualityScore ??
  analysis.value?.scores?.codeQuality ??
  analysis.value?.scores?.codeQualityScore ??
  0
)

const testCoverageScore = computed(() =>
  analysis.value?.testCoverageScore ??
  analysis.value?.scores?.testCoverage ??
  analysis.value?.scores?.testCoverageScore ??
  0
)

const documentationScore = computed(() =>
  analysis.value?.documentationScore ??
  analysis.value?.scores?.documentation ??
  analysis.value?.scores?.documentationScore ??
  0
)

const performanceScore = computed(() =>
  analysis.value?.performanceScore ??
  analysis.value?.scores?.performance ??
  analysis.value?.scores?.performanceScore ??
  0
)

const securityScore = computed(() =>
  analysis.value?.securityScore ??
  analysis.value?.scores?.security ??
  analysis.value?.scores?.securityScore ??
  0
)

const recommendations = computed(() =>
  Array.isArray(analysis.value?.recommendations)
    ? analysis.value.recommendations
    : []
)

const aiSummary = computed(() =>
  analysis.value?.aiSummary || null
)

const aiStrengths = computed(() =>
  Array.isArray(aiSummary.value?.strengths)
    ? aiSummary.value.strengths
    : []
)

const aiWeaknesses = computed(() =>
  Array.isArray(aiSummary.value?.weaknesses)
    ? aiSummary.value.weaknesses
    : []
)

const aiRecommendations = computed(() =>
  Array.isArray(aiSummary.value?.recommendations)
    ? aiSummary.value.recommendations
    : []
)

const languages = computed(() => {
  const data =
    analysis.value?.languages ||
    repository.value?.languages ||
    null

  if (!data) return []

  if (Array.isArray(data)) {
    return data.map((item) => {
      if (typeof item === 'string') {
        return {
          name: item,
          value: 0,
          percentage: 0,
        }
      }

      return {
        name: item.name || item.language || 'Unknown',
        value: item.value || item.size || item.bytes || 0,
        percentage: item.percentage || 0,
      }
    })
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data)
    const total = entries.reduce(
      (sum, [, value]) =>
        sum + (typeof value === 'number' ? value : 0),
      0
    )

    return entries.map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? value : 0,
      percentage:
        total > 0
          ? Math.round((value / total) * 100)
          : 0,
    }))
  }

  return []
})

const languageColors = [
  '#3b82f6',
  '#eab308',
  '#ef4444',
  '#a855f7',
  '#14b8a6',
  '#9ca3af',
]

const languageGradient = computed(() => {
  if (!languages.value.length) {
    return 'conic-gradient(#e5e7eb 0% 100%)'
  }

  let current = 0

  const stops = languages.value.slice(0, 6).map((language, index) => {
    const start = current
    const end = current + Number(language.percentage || 0)
    current = end

    return `${languageColors[index % languageColors.length]} ${start}% ${end}%`
  })

  if (current < 100) {
    stops.push(`#e5e7eb ${current}% 100%`)
  }

  return `conic-gradient(${stops.join(', ')})`
})

const scoreCards = computed(() => [
  {
    label: 'Code Quality',
    value: codeQualityScore.value,
    icon: Code2,
  },
  {
    label: 'Test Coverage',
    value: testCoverageScore.value,
    icon: FileText,
  },
  {
    label: 'Documentation',
    value: documentationScore.value,
    icon: FileText,
  },
  {
    label: 'Performance',
    value: performanceScore.value,
    icon: Gauge,
  },
  {
    label: 'Security',
    value: securityScore.value,
    icon: ShieldCheck,
  },
])

const formatNumber = (value) => {
  const number = Number(value) || 0
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number)
}

const formatDate = (date) => {
  if (!date) return 'N/A'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return parsed.toLocaleString()
}

const shareRepository = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch (err) {
    console.error('Failed to copy repository URL:', err)
  }
}

const toggleBookmark = async () => {
  if (!repository.value) return

  try {
    if (isBookmarked.value) {
      await bookmarkStore.removeBookmark(repository.value.id)
    } else {
      await bookmarkStore.addBookmark(repository.value)
    }

    isBookmarked.value = !isBookmarked.value
  } catch (err) {
    console.error('Bookmark operation failed:', err)
  }
}



onMounted(async () => {
  loading.value = true
  error.value = ''

  try {
    const routeRepositoryId = route.query.id

    // 1. If coming from History, ALWAYS use the repository
    //    specified in the URL.
    if (routeRepositoryId) {
      const repositoryId = String(routeRepositoryId)

      repository.value =
        await repositoryStore.getRepositoryDetails(repositoryId)

      analysis.value =
        await repositoryStore.getInsights(repositoryId)
    }

    // 2. Otherwise, use the currently selected repository.
    else if (repositoryStore.currentRepository) {
      repository.value = repositoryStore.currentRepository

      analysis.value =
        await repositoryStore.getInsights(repository.value.id)
    }

    // 3. If nothing is selected, load the latest repository.
    else {
      repository.value =
        await repositoryStore.loadLatestRepository()

      if (repository.value?.id) {
        analysis.value =
          await repositoryStore.getInsights(repository.value.id)
      }
    }

    if (!repository.value) {
      throw new Error('No repository has been analyzed yet.')
    }
  } catch (err) {
    console.error('Failed to load repository:', err)

    error.value =
      err.message || 'Failed to load repository.'
  } finally {
    loading.value = false
  }
})


</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50">
    <div
      v-if="loading"
      class="min-h-full flex items-center justify-center p-10"
    >
      <div class="text-center">
        <div
          class="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"
        ></div>
        <p class="text-gray-600">
          Loading repository analysis...
        </p>
      </div>
    </div>

    <div
      v-else-if="error"
      class="p-8"
    >
      <div
        class="bg-red-50 border border-red-200 rounded-xl p-6"
      >
        <h2 class="font-semibold text-red-800 mb-2">
          Unable to load repository
        </h2>
        <p class="text-sm text-red-700">
          {{ error }}
        </p>
      </div>
    </div>

    <div
      v-else-if="repository"
      class="p-6 md:p-8"
    >
      <!-- Repository Header -->
      <div class="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        <!-- Repository Information -->
        <section
          class="xl:col-span-3 bg-white border border-gray-200 rounded-xl p-6"
        >
          <div
            class="flex items-center justify-between mb-5"
          >
            <div
              class="flex items-center gap-2 text-xs text-gray-500"
            >
              <span>Dashboard</span>
              <span>›</span>
              <span class="font-medium text-gray-700">
                {{ repository.owner }}/{{ repository.name }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="router.push('/analyze')"
                class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Sparkles class="w-4 h-4" />
                Re-analyze
              </button>

              <button
                @click="toggleBookmark"
                class="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Star
                  class="w-4 h-4"
                  :class="isBookmarked
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-700'"
                />
                {{ isBookmarked ? 'Bookmarked' : 'Bookmark' }}
              </button>
            </div>
          </div>

          <h1
            class="text-3xl font-bold text-gray-900 mb-2"
          >
            {{ repository.owner }}/{{ repository.name }}
          </h1>

          <p
            v-if="repository.description"
            class="text-sm text-gray-600 mb-4"
          >
            {{ repository.description }}
          </p>

          <div
            class="flex flex-wrap items-center gap-5 text-xs text-gray-500 mb-6"
          >
            <div
              v-if="repositoryLanguage"
              class="flex items-center gap-2"
            >
              <span
                class="w-2 h-2 rounded-full bg-yellow-400"
              ></span>
              <span>{{ repositoryLanguage }}</span>
            </div>

            <div
              v-if="repositoryLicense"
              class="flex items-center gap-1.5"
            >
              <span>ⓘ</span>
              <span>{{ repositoryLicense }}</span>
            </div>

            <a
              v-if="repositoryHomepage"
              :href="repositoryHomepage"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 hover:text-green-600 transition"
            >
              <span>🔗</span>
              <span>
                {{ repositoryHomepage.replace('https://', '') }}
              </span>
            </a>
          </div>

          <!-- Repository Stats -->
          <div
            class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          >
            <div
              class="border border-gray-200 rounded-lg p-3"
            >
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 mb-2"
              >
                <Star class="w-4 h-4" />
                <span>Stars</span>
              </div>
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(stars) }}
              </p>
            </div>

            <div
              class="border border-gray-200 rounded-lg p-3"
            >
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 mb-2"
              >
                <GitBranch class="w-4 h-4" />
                <span>Forks</span>
              </div>
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(forks) }}
              </p>
            </div>

            <div
              class="border border-gray-200 rounded-lg p-3"
            >
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 mb-2"
              >
                <Eye class="w-4 h-4" />
                <span>Watchers</span>
              </div>
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(watchers) }}
              </p>
            </div>

            <div
              class="border border-gray-200 rounded-lg p-3"
            >
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 mb-2"
              >
                <CircleAlert class="w-4 h-4" />
                <span>Open Issues</span>
              </div>
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(openIssues) }}
              </p>
            </div>

            <div
              class="border border-gray-200 rounded-lg p-3"
            >
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 mb-2"
              >
                <GitPullRequest class="w-4 h-4" />
                <span>Pull Requests</span>
              </div>
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(pullRequests) }}
              </p>
            </div>

            <div
              class="border border-gray-200 rounded-lg p-3"
            >
              <div
                class="flex items-center gap-1.5 text-xs text-gray-500 mb-2"
              >
                <Users class="w-4 h-4" />
                <span>Contributors</span>
              </div>
              <p class="text-base font-semibold text-gray-900">
                {{ formatNumber(contributors) }}
              </p>
            </div>
          </div>
        </section>

        <!-- Health Score -->
        <aside
          class="xl:col-span-1 bg-white border border-gray-200 rounded-xl p-6"
        >
          <div class="flex items-center gap-2 mb-5">
            <Gauge class="w-5 h-5 text-gray-700" />
            <h2 class="font-bold text-gray-900">
              Health Score
            </h2>
          </div>

          <div
            class="relative w-44 h-44 mx-auto"
          >
            <svg
              viewBox="0 0 200 200"
              class="w-full h-full -rotate-90"
            >
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="#e5e7eb"
                stroke-width="18"
              />

              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="#16a34a"
                stroke-width="18"
                stroke-linecap="round"
                stroke-dasharray="490"
                :stroke-dashoffset="
                  490 -
                  (490 * Math.min(
                    Number(healthScore) || 0,
                    100
                  )) / 100
                "
              />
            </svg>

            <div
              class="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span
                class="text-4xl font-bold text-gray-900"
              >
                {{ healthScore }}
              </span>
              <span class="text-sm text-gray-500">
                /100
              </span>
            </div>
          </div>

          <div class="text-center mt-3">
            <span
              class="inline-flex px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold"
            >
              Repository Health
            </span>
          </div>

        </aside>
      </div>

      <!-- Tabs -->
      <div
        class="bg-white border border-gray-200 rounded-xl mb-6 overflow-x-auto"
      >
        <div
          class="flex items-center px-5 border-b border-gray-200 min-w-max"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-4 text-sm font-medium border-b-2 transition whitespace-nowrap"
            :class="activeTab === tab.id
              ? 'text-green-600 border-green-600'
              : 'text-gray-500 border-transparent hover:text-gray-900'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Overview -->
      <div
        v-if="activeTab === 'overview'"
        class="grid grid-cols-1 xl:grid-cols-3 gap-6"
      >
        <!-- Health Breakdown -->
        <section
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div class="mb-6">
            <h2
              class="text-lg font-bold text-gray-900"
            >
              Repository Health Breakdown
            </h2>
            <p class="text-xs text-gray-500 mt-1">
              Deterministic DevLens quality indicators
            </p>
          </div>

          <div class="space-y-5">
            <div
              v-for="score in scoreCards"
              :key="score.label"
            >
              <div
                class="flex items-center justify-between mb-2"
              >
                <div
                  class="flex items-center gap-2"
                >
                  <component
                    :is="score.icon"
                    class="w-4 h-4 text-gray-500"
                  />
                  <span
                    class="text-sm text-gray-700"
                  >
                    {{ score.label }}
                  </span>
                </div>

                <span
                  class="text-xs font-semibold text-gray-900"
                >
                  {{ score.value }}/100
                </span>
              </div>

              <div
                class="h-2 bg-gray-100 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-green-600 rounded-full"
                  :style="{
                    width: `${Math.min(
                      Number(score.value) || 0,
                      100
                    )}%`
                  }"
                ></div>
              </div>
            </div>

            <div>
              <div
                class="flex items-center justify-between mb-2"
              >
                <div class="flex items-center gap-2">
                  <Activity
                    class="w-4 h-4 text-gray-500"
                  />
                  <span class="text-sm text-gray-700">
                    Overall
                  </span>
                </div>

                <span
                  class="text-xs font-semibold text-gray-900"
                >
                  {{ healthScore }}/100
                </span>
              </div>

              <div
                class="h-2 bg-gray-100 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-green-600 rounded-full"
                  :style="{
                    width: `${Math.min(
                      Number(healthScore) || 0,
                      100
                    )}%`
                  }"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <!-- AI Summary -->
        <section
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div class="flex items-center gap-2 mb-5">
            <Sparkles class="w-5 h-5 text-gray-700" />

            <h2 class="text-lg font-bold text-gray-900">
              AI Summary
            </h2>
          </div>

          <div
            v-if="aiSummary"
            class="space-y-5"
          >
            <p
              class="text-sm text-gray-600 leading-6"
            >
              {{ aiSummary.summary }}
            </p>

            <div
              v-if="aiStrengths.length"
            >
              <h3
                class="text-sm font-semibold text-gray-900 mb-2"
              >
                Key Strengths
              </h3>

              <ul class="space-y-2">
                <li
                  v-for="item in aiStrengths"
                  :key="item"
                  class="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span class="text-green-600 mt-0.5">
                    •
                  </span>

                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div
              v-if="aiWeaknesses.length"
            >
              <h3
                class="text-sm font-semibold text-gray-900 mb-2"
              >
                Areas to Improve
              </h3>

              <ul class="space-y-2">
                <li
                  v-for="item in aiWeaknesses"
                  :key="item"
                  class="flex items-start gap-2 text-sm text-gray-600"
                >
                  <span class="text-orange-500 mt-0.5">
                    •
                  </span>

                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Read Full Summary -->
            <button
              type="button"
              @click="router.push({
                path: '/ai-insights',
                query: { id: repository.id }
              })"
              class="mt-2 px-4 py-2 border border-green-600 text-green-700 hover:bg-green-50 rounded-lg text-sm font-semibold transition"
            >
              Read Full Summary
            </button>
          </div>

          <div
            v-else
            class="py-10 text-center"
          >
            <Sparkles
              class="w-8 h-8 text-gray-300 mx-auto mb-3"
            />

            <p class="text-sm text-gray-500">
              AI insights are not available
              for this analysis yet.
            </p>
          </div>
        </section>

        <!-- Language Distribution -->
        <section
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div class="mb-5">
            <h2
              class="text-lg font-bold text-gray-900"
            >
              Language Distribution
            </h2>
            <p class="text-xs text-gray-500 mt-1">
              Languages detected in this repository
            </p>
          </div>

          <div
            v-if="languages.length"
            class="flex items-center gap-6"
          >
            <div
              class="relative w-36 h-36 shrink-0 rounded-full"
              :style="{
                background: languageGradient
              }"
            >
              <div
                class="absolute inset-7 bg-white rounded-full flex items-center justify-center"
              >
                <Code2
                  class="w-7 h-7 text-gray-500"
                />
              </div>
            </div>

            <div
              class="flex-1 space-y-3 min-w-0"
            >
              <div
                v-for="(language, index) in languages.slice(0, 6)"
                :key="language.name"
                class="flex items-center justify-between gap-3"
              >
                <div
                  class="flex items-center gap-2 min-w-0"
                >
                  <span
                    class="w-2.5 h-2.5 rounded-full shrink-0"
                    :style="{
                      backgroundColor:
                        languageColors[index]
                    }"
                  ></span>

                  <span
                    class="text-sm text-gray-700 truncate"
                  >
                    {{ language.name }}
                  </span>
                </div>

                <span
                  class="text-sm font-semibold text-gray-900"
                >
                  {{ language.percentage }}%
                </span>
              </div>
            </div>
          </div>

          <div
            v-else
            class="h-36 flex items-center justify-center"
          >
            <p class="text-sm text-gray-500">
              Language distribution is not available.
            </p>
          </div>
        </section>
      </div>

      <!-- Health Score Tab -->
      <div
        v-else-if="activeTab === 'health'"
        class="bg-white border border-gray-200 rounded-xl p-6"
      >
        <div class="mb-6">
          <h2
            class="text-xl font-bold text-gray-900"
          >
            Repository Health
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            Deterministic DevLens quality indicators
          </p>
        </div>

        <div class="space-y-6">
          <div
            v-for="score in scoreCards"
            :key="score.label"
          >
            <div
              class="flex items-center justify-between mb-2"
            >
              <div
                class="flex items-center gap-2"
              >
                <component
                  :is="score.icon"
                  class="w-5 h-5 text-gray-500"
                />
                <span class="font-medium text-gray-700">
                  {{ score.label }}
                </span>
              </div>

              <span class="font-semibold">
                {{ score.value }}/100
              </span>
            </div>

            <div
              class="h-3 bg-gray-100 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-green-600 rounded-full"
                :style="{
                  width: `${Math.min(
                    Number(score.value) || 0,
                    100
                  )}%`
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Insights Tab -->
      <div
        v-else-if="activeTab === 'ai'"
        class="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <section
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div class="flex items-center gap-2 mb-5">
            <Sparkles
              class="w-5 h-5 text-gray-700"
            />
            <h2
              class="text-xl font-bold text-gray-900"
            >
              AI Summary
            </h2>
          </div>

          <p
            v-if="aiSummary"
            class="text-sm text-gray-600 leading-6"
          >
            {{ aiSummary.summary }}
          </p>

          <p
            v-else
            class="text-sm text-gray-500"
          >
            AI insights are not available.
          </p>
        </section>

        <section
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <h2
            class="text-xl font-bold text-gray-900 mb-5"
          >
            Recommendations
          </h2>

          <div
            v-if="aiSummary?.recommendations?.length"
            class="space-y-3"
          >
            <div
              v-for="item in aiSummary.recommendations"
              :key="item"
              class="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
            >
              {{ item }}
            </div>
          </div>

          <p
            v-else
            class="text-sm text-gray-500"
          >
            No AI recommendations available.
          </p>
        </section>
      </div>

      <!-- Metrics Tab -->
      <div
        v-else-if="activeTab === 'metrics'"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <div
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <GitCommit
            class="w-5 h-5 text-gray-500 mb-3"
          />
          <p class="text-sm text-gray-500">
            Commits
          </p>
          <p
            class="text-2xl font-bold text-gray-900 mt-1"
          >
            {{ formatNumber(commits) }}
          </p>
        </div>

        <div
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <Users
            class="w-5 h-5 text-gray-500 mb-3"
          />
          <p class="text-sm text-gray-500">
            Contributors
          </p>
          <p
            class="text-2xl font-bold text-gray-900 mt-1"
          >
            {{ formatNumber(contributors) }}
          </p>
        </div>

        <div
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <GitPullRequest
            class="w-5 h-5 text-gray-500 mb-3"
          />
          <p class="text-sm text-gray-500">
            Pull Requests
          </p>
          <p
            class="text-2xl font-bold text-gray-900 mt-1"
          >
            {{ formatNumber(pullRequests) }}
          </p>
        </div>

        <div
          class="bg-white border border-gray-200 rounded-xl p-6"
        >
          <CircleAlert
            class="w-5 h-5 text-gray-500 mb-3"
          />
          <p class="text-sm text-gray-500">
            Open Issues
          </p>
          <p
            class="text-2xl font-bold text-gray-900 mt-1"
          >
            {{ formatNumber(openIssues) }}
          </p>
        </div>
      </div>

      <!-- Contributors Tab -->
      <div
        v-else-if="activeTab === 'contributors'"
        class="bg-white border border-gray-200 rounded-xl p-8"
      >
        <div class="flex items-center gap-3 mb-5">
          <Users class="w-6 h-6 text-gray-700" />
          <h2
            class="text-xl font-bold text-gray-900"
          >
            Contributors
          </h2>
        </div>

        <p class="text-sm text-gray-500">
          Contributors detected in this analysis:
        </p>

        <p
          class="text-4xl font-bold text-gray-900 mt-2"
        >
          {{ formatNumber(contributors) }}
        </p>
      </div>

      <!-- Commits Tab -->
      <div
        v-else-if="activeTab === 'commits'"
        class="bg-white border border-gray-200 rounded-xl p-8"
      >
        <div class="flex items-center gap-3 mb-5">
          <GitCommit
            class="w-6 h-6 text-gray-700"
          />
          <h2
            class="text-xl font-bold text-gray-900"
          >
            Commits
          </h2>
        </div>

        <p class="text-sm text-gray-500">
          Commits detected in this analysis:
        </p>

        <p
          class="text-4xl font-bold text-gray-900 mt-2"
        >
          {{ formatNumber(commits) }}
        </p>
      </div>

      <!-- Languages Tab -->
      <div
        v-else-if="activeTab === 'languages'"
        class="bg-white border border-gray-200 rounded-xl p-8"
      >
        <div class="flex items-center gap-3 mb-6">
          <Code2
            class="w-6 h-6 text-gray-700"
          />
          <h2
            class="text-xl font-bold text-gray-900"
          >
            Language Distribution
          </h2>
        </div>

        <div
          v-if="languages.length"
          class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
        >
          <div
            class="relative w-56 h-56 mx-auto rounded-full"
            :style="{
              background: languageGradient
            }"
          >
            <div
              class="absolute inset-10 bg-white rounded-full flex items-center justify-center"
            >
              <Code2
                class="w-10 h-10 text-gray-500"
              />
            </div>
          </div>

          <div class="space-y-4">
            <div
              v-for="(language, index) in languages"
              :key="language.name"
              class="flex items-center justify-between"
            >
              <div
                class="flex items-center gap-3"
              >
                <span
                  class="w-3 h-3 rounded-full"
                  :style="{
                    backgroundColor:
                      languageColors[
                        index % languageColors.length
                      ]
                  }"
                ></span>

                <span
                  class="text-sm text-gray-700"
                >
                  {{ language.name }}
                </span>
              </div>

              <span
                class="text-sm font-semibold text-gray-900"
              >
                {{ language.percentage }}%
              </span>
            </div>
          </div>
        </div>

        <p
          v-else
          class="text-sm text-gray-500"
        >
          Language distribution is not available.
        </p>
      </div>

      <!-- Analysis Date -->
      <p
        v-if="analysis?.analysisDate || analysis?.createdAt"
        class="text-xs text-gray-500 mt-6"
      >
        Analysis date:
        {{
          formatDate(
            analysis.analysisDate ||
            analysis.createdAt
          )
        }}
      </p>
    </div>
  </div>
</template>