<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  BarChart3,
  TrendingUp,
  Bookmark,
  Activity,
  ArrowRight,
  Sparkles,
} from '@lucide/vue'
import { useDashboardStore } from '@/stores/dashboard'

const router = useRouter()
const dashboardStore = useDashboardStore()

const stats = computed(() => dashboardStore.stats)

const recentAnalyses = computed(() => {
  return dashboardStore.recentAnalyses || []
})

const latestAIInsight = computed(() => {
  return (
    recentAnalyses.value.find(
      (item) =>
        item.aiSummary &&
        item.aiSummary.summary
    ) || null
  )
})

const aiSummary = computed(() => {
  return latestAIInsight.value?.aiSummary || null
})

const aiStrengths = computed(() => {
  return Array.isArray(aiSummary.value?.strengths)
    ? aiSummary.value.strengths.slice(0, 2)
    : []
})

const aiRepositoryName = computed(() => {
  return latestAIInsight.value?.name || 'Repository'
})

const activity = computed(() => {
  const analyses = dashboardStore.recentAnalyses || []

  const days = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - i)

    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const count = analyses.filter((item) => {
      if (!item.date) return false

      const analysisDate = new Date(item.date)

      return analysisDate >= date && analysisDate < nextDate
    }).length

    days.push({
      date: date.toISOString(),
      label: date.toLocaleDateString('en-US', {
        weekday: 'short',
      }),
      value: count,
    })
  }

  return days
})

const goToRepository = (repositoryId) => {
  if (!repositoryId) return

  router.push({
    path: '/repository',
    query: {
      id: repositoryId,
    },
  })
}

const goToAIInsights = () => {
  if (!latestAIInsight.value?.repositoryId) return

  router.push({
    path: '/ai-insights',
    query: {
      id: latestAIInsight.value.repositoryId,
    },
  })
}

onMounted(async () => {
  try {
    await dashboardStore.fetchDashboardData()
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
})
</script>

<template>
  <div class="min-h-full bg-gray-50 px-6 py-8">

    <!-- ========================================= -->
    <!-- HEADER -->
    <!-- ========================================= -->

    <div class="max-w-7xl mx-auto">

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">
          Welcome back, {{ dashboardStore.user?.name || 'User' }}! 
        </h1>

        <p class="text-gray-600 mt-2">
          Here's what's happening with your repositories today.
        </p>
      </div>


      <!-- ========================================= -->
      <!-- STATS -->
      <!-- ========================================= -->

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6"
      >

        <!-- Repositories -->
        <div
          class="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div class="flex items-start justify-between">

            <div>
              <p class="text-sm text-gray-500">
                Repositories Analyzed
              </p>

              <p class="text-3xl font-bold text-gray-900 mt-3">
                {{ stats.repositoriesAnalyzed || 0 }}
              </p>
            </div>

            <div
              class="w-11 h-11 rounded-lg bg-blue-500 flex items-center justify-center"
            >
              <BarChart3 class="w-5 h-5 text-white" />
            </div>

          </div>
        </div>


        <!-- Health Score -->
        <div
          class="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div class="flex items-start justify-between">

            <div>
              <p class="text-sm text-gray-500">
                Average Health Score
              </p>

              <div class="flex items-end gap-1 mt-3">
                <p class="text-3xl font-bold text-gray-900">
                  {{ stats.healthScore || 0 }}
                </p>

                <span class="text-sm text-gray-500 mb-1">
                  /100
                </span>
              </div>
            </div>

            <div
              class="w-11 h-11 rounded-lg bg-green-500 flex items-center justify-center"
            >
              <TrendingUp class="w-5 h-5 text-white" />
            </div>

          </div>
        </div>


        <!-- Bookmarks -->
        <div
          class="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div class="flex items-start justify-between">

            <div>
              <p class="text-sm text-gray-500">
                Bookmarks
              </p>

              <p class="text-3xl font-bold text-gray-900 mt-3">
                {{ stats.bookmarks || 0 }}
              </p>
            </div>

            <div
              class="w-11 h-11 rounded-lg bg-purple-500 flex items-center justify-center"
            >
              <Bookmark class="w-5 h-5 text-white" />
            </div>

          </div>
        </div>


        <!-- Analyses This Month -->
        <div
          class="bg-white border border-gray-200 rounded-xl p-5"
        >
          <div class="flex items-start justify-between">

            <div>
              <p class="text-sm text-gray-500">
                Analyses This Month
              </p>

              <p class="text-3xl font-bold text-gray-900 mt-3">
                {{ stats.analysesThisMonth || 0 }}
              </p>
            </div>

            <div
              class="w-11 h-11 rounded-lg bg-orange-500 flex items-center justify-center"
            >
              <Activity class="w-5 h-5 text-white" />
            </div>

          </div>
        </div>

      </div>


      <!-- ========================================= -->
      <!-- RECENT ANALYSES + AI INSIGHTS -->
      <!-- ========================================= -->

      <div
        class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6"
      >

        <!-- ======================================= -->
        <!-- RECENT ANALYSES -->
        <!-- ======================================= -->

        <section
          class="lg:col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden"
        >

          <div
            class="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
          >

            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Recent Analyses
              </h2>

              <p class="text-sm text-gray-500 mt-1">
                Your latest repository analyses
              </p>
            </div>

            <button
              @click="router.push('/history')"
              class="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              View all
              <ArrowRight class="w-4 h-4" />
            </button>

          </div>


          <!-- Analysis list -->
          <div
            v-if="recentAnalyses.length"
          >

            <div
              v-for="item in recentAnalyses.slice(0, 5)"
              :key="item.id"
              @click="goToRepository(item.repositoryId)"
              class="px-6 py-4 border-b border-gray-100 last:border-b-0 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
            >

              <div class="flex items-center gap-3 min-w-0">

                <div
                  class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
                >
                  <span class="text-sm text-gray-600 font-mono">
                    &lt;/&gt;
                  </span>
                </div>

                <div class="min-w-0">

                  <p
                    class="font-semibold text-gray-900 truncate"
                  >
                    {{ item.name }}
                  </p>

                  <p class="text-xs text-gray-500 mt-1">
                    {{ item.date
                      ? new Date(item.date).toLocaleString()
                      : 'Recently analyzed'
                    }}
                  </p>

                </div>

              </div>


              <div class="flex items-center gap-4 shrink-0">

                <div class="text-right">

                  <p
                    class="text-lg font-bold"
                    :class="
                      item.health >= 70
                        ? 'text-green-600'
                        : item.health >= 50
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    "
                  >
                    {{ item.health }}
                  </p>

                  <p class="text-xs text-gray-400">
                    /100
                  </p>

                </div>

                <ArrowRight
                  class="w-4 h-4 text-gray-400"
                />

              </div>

            </div>

          </div>


          <!-- Empty state -->
          <div
            v-else
            class="py-12 text-center"
          >
            <BarChart3
              class="w-8 h-8 text-gray-300 mx-auto mb-3"
            />

            <p class="text-sm text-gray-500">
              No repository analyses yet.
            </p>

            <button
              @click="router.push('/analyze')"
              class="mt-3 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Analyze a repository
            </button>
          </div>

        </section>


        <!-- ======================================= -->
        <!-- AI INSIGHTS -->
        <!-- ======================================= -->

        <section
          class="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden"
        >

          <!-- Card Header -->
          <div
            class="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
          >

            <div>
              <h2 class="text-lg font-bold text-gray-900">
                AI Insights
              </h2>

              <p class="text-sm text-gray-500 mt-1">
                Latest repository analysis
              </p>
            </div>

            <div
              class="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center"
            >
              <Sparkles
                class="w-5 h-5 text-green-500"
              />
            </div>

          </div>


          <!-- AI Content -->
          <div
            v-if="aiSummary"
            class="p-6"
          >

            <!-- Repository -->
            <div class="mb-4">

              <p
                class="text-xs font-semibold uppercase tracking-wide text-gray-400"
              >
                Repository
              </p>

              <p
                class="text-sm font-semibold text-gray-900 mt-1"
              >
                {{ aiRepositoryName }}
              </p>

            </div>


            <!-- Summary -->
            <div class="mb-5">

              <p
                class="text-sm text-gray-600 leading-6 line-clamp-4"
              >
                {{ aiSummary.summary }}
              </p>

            </div>


            <!-- Strengths -->
            <div
              v-if="aiStrengths.length"
              class="mb-5"
            >

              <p
                class="text-sm font-semibold text-gray-900 mb-2"
              >
                Key Strengths
              </p>

              <div class="space-y-2">

                <div
                  v-for="strength in aiStrengths"
                  :key="strength"
                  class="flex items-start gap-2"
                >

                  <span
                    class="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0"
                  ></span>

                  <p
                    class="text-sm text-gray-600 leading-5"
                  >
                    {{ strength }}
                  </p>

                </div>

              </div>

            </div>


            <!-- Full Insights Button -->
            <button
              @click="goToAIInsights"
              class="w-full py-2.5 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 font-semibold text-sm transition"
            >
              View Full AI Insights
              <span class="ml-1">→</span>
            </button>

          </div>


          <!-- No AI Insight -->
          <div
            v-else
            class="p-8 text-center"
          >

            <Sparkles
              class="w-9 h-9 text-gray-300 mx-auto mb-3"
            />

            <p
              class="text-sm font-medium text-gray-700"
            >
              No AI insights yet
            </p>

            <p
              class="text-xs text-gray-500 mt-1 leading-5"
            >
              Analyze a repository to generate AI-powered insights.
            </p>

            <button
              @click="router.push('/analyze')"
              class="mt-4 text-sm font-semibold text-green-600 hover:text-green-700"
            >
              Analyze Repository →
            </button>

          </div>

        </section>

      </div>


      <!-- ========================================= -->
      <!-- ACTIVITY -->
      <!-- ========================================= -->

<!-- Your Activity -->
<!-- Your Activity -->
      <section class="bg-white border border-gray-200 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900">
              Your Activity
            </h2>

            <p class="text-sm text-gray-500 mt-1">
              Repository analysis activity over the last 7 days
            </p>
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-500">
            <Activity class="w-5 h-5" />
            <span>Last 7 days</span>
          </div>
        </div>

        <div v-if="activity.length" class="mt-8">
          <svg
            viewBox="0 0 1000 300"
            class="w-full h-75"
            preserveAspectRatio="none"
          >
            <!-- Horizontal grid lines -->
            <line
              x1="30"
              y1="55"
              x2="970"
              y2="55"
              stroke="#e5e7eb"
              stroke-width="1"
            />

            <line
              x1="30"
              y1="130"
              x2="970"
              y2="130"
              stroke="#e5e7eb"
              stroke-width="1"
            />

            <line
              x1="30"
              y1="205"
              x2="970"
              y2="205"
              stroke="#e5e7eb"
              stroke-width="1"
            />

            <!-- Filled area -->
            <polygon
              :points="
                `30,255 ${
                  activity
                    .map((item, index) => {
                      const maxValue = Math.max(
                        ...activity.map(a => a.value),
                        1
                      )

                      const x =
                        30 +
                        (index * 940) /
                          Math.max(activity.length - 1, 1)

                      const y =
                        255 -
                        (item.value / maxValue) * 200

                      return `${x},${y}`
                    })
                    .join(' ')
                } 970,255`
              "
              fill="#dcfce7"
            />

            <!-- Activity line -->
            <polyline
              :points="
                activity
                  .map((item, index) => {
                    const maxValue = Math.max(
                      ...activity.map(a => a.value),
                      1
                    )

                    const x =
                      30 +
                      (index * 940) /
                        Math.max(activity.length - 1, 1)

                    const y =
                      255 -
                      (item.value / maxValue) * 200

                    return `${x},${y}`
                  })
                  .join(' ')
              "
              fill="none"
              stroke="#16a34a"
              stroke-width="4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- Points -->
            <g
              v-for="(item, index) in activity"
              :key="`${item.date}-${index}`"
            >
              <circle
                :cx="
                  30 +
                  (index * 940) /
                    Math.max(activity.length - 1, 1)
                "
                :cy="
                  255 -
                  (item.value /
                    Math.max(
                      ...activity.map(a => a.value),
                      1
                    )) *
                    200
                "
                r="7"
                fill="#16a34a"
              />
            </g>

            <!-- Dates -->
            <g
              v-for="(item, index) in activity"
              :key="`label-${item.date}-${index}`"
            >
              <text
                :x="
                  30 +
                  (index * 940) /
                    Math.max(activity.length - 1, 1)
                "
                y="285"
                text-anchor="middle"
                fill="#64748b"
                font-size="13"
              >
                {{ item.label || item.date }}
              </text>
            </g>

            <!-- Values -->
            <g
              v-for="(item, index) in activity"
              :key="`value-${item.date}-${index}`"
            >
              <text
                :x="
                  30 +
                  (index * 940) /
                    Math.max(activity.length - 1, 1)
                "
                y="305"
                text-anchor="middle"
                fill="#111827"
                font-size="13"
                font-weight="600"
              >
                {{ item.value }}
              </text>
            </g>
          </svg>
        </div>

        <div
          v-else
          class="h-75 flex items-center justify-center text-sm text-gray-500"
        >
          No activity available yet.
        </div>
      </section>



    </div>

  </div>
</template>