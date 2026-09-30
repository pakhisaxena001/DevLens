<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getProfile } from '@/services/profileService'
import { useDashboardStore } from '@/stores/dashboard'

import {
  BarChart3,
  TrendingUp,
  Bookmark,
  ArrowRight,
  Activity,
  Code2,
  CalendarDays,
  Loader2,
} from '@lucide/vue'

const dashboardStore = useDashboardStore()
const userName = ref('')
const activityHistory = ref([])

// ==================================================
// Helpers
// ==================================================

const formatDate = (date) => {
  if (!date) return 'Unknown date'

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return 'Unknown date'
  }

  return value.toLocaleDateString(
    'en-US',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }
  )
}

const getRelativeDate = (date) => {
  if (!date) return ''

  const value = new Date(date)

  if (Number.isNaN(value.getTime())) {
    return ''
  }

  const now = new Date()

  const difference =
    now.getTime() -
    value.getTime()

  const minutes =
    Math.floor(
      difference / 60000
    )

  if (minutes < 1) {
    return 'Just now'
  }

  if (minutes < 60) {
    return `${minutes} min ago`
  }

  const hours =
    Math.floor(
      minutes / 60
    )

  if (hours < 24) {
    return `${hours} hr ago`
  }

  const days =
    Math.floor(
      hours / 24
    )

  if (days < 7) {
    return `${days} day${
      days === 1 ? '' : 's'
    } ago`
  }

  return formatDate(date)
}

// ==================================================
// Statistics
// ==================================================

const statsCards = computed(() => [
  {
    label: 'Repositories Analyzed',
    value:
      dashboardStore.stats
        .repositoriesAnalyzed,
    icon: BarChart3,
    iconClass:
      'bg-blue-500',
  },

  {
    label: 'Average Health Score',
    value:
      dashboardStore.stats
        .healthScore,
    suffix: '/100',
    icon: TrendingUp,
    iconClass:
      'bg-green-500',
  },

  {
    label: 'Bookmarks',
    value:
      dashboardStore.stats
        .bookmarks,
    icon: Bookmark,
    iconClass:
      'bg-purple-500',
  },

  {
    label: 'Analyses This Month',
    value:
      dashboardStore.stats
        .analysesThisMonth,
    icon: BarChart3,
    iconClass:
      'bg-orange-500',
  },
])

// ==================================================
// Recent analyses
// ==================================================

const recentAnalyses = computed(() => {
  return dashboardStore.recentAnalyses.slice(0, 5)
})

// ==================================================
// Languages
// ==================================================

const languageColors = [
  'bg-blue-500',
  'bg-yellow-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-gray-400',
]

const languages =
  computed(() =>
    dashboardStore
      .topLanguages
      .map(
        (language, index) => ({
          ...language,
          color:
            languageColors[
              index %
                languageColors.length
            ],
        })
      )
  )

// ==================================================
// Activity chart
// ==================================================

const activity =
  computed(() =>
    dashboardStore.activity
  )

const maxActivity =
  computed(() => {
    const values =
      activity.value.map(
        (item) =>
          item.value
      )

    return Math.max(
      ...values,
      1
    )
  })

const activityPoints =
  computed(() => {
    if (
      !activity.value.length
    ) {
      return ''
    }

    const width = 700
    const height = 180
    const padding = 20

    const usableWidth =
      width -
      padding * 2

    const usableHeight =
      height -
      padding * 2

    return activity.value
      .map(
        (item, index) => {
          const x =
            activity.value.length ===
            1
              ? width / 2
              : padding +
                (index /
                  (activity.value.length -
                    1)) *
                  usableWidth

          const y =
            height -
            padding -
            (item.value /
              maxActivity.value) *
              usableHeight

          return `${x},${y}`
        }
      )
      .join(' ')
  })


/* =====================================
   Dynamic language donut
===================================== */

const languageGradient = computed(() => {
  if (!languages.value.length) {
    return '#e5e7eb'
  }

  const colors = [
    '#3b82f6',
    '#eab308',
    '#ef4444',
    '#a855f7',
    '#9ca3af',
  ]

  let current = 0

  const segments = languages.value.map((language, index) => {
    const start = current

    current += Number(language.percentage) || 0

    return `${colors[index % colors.length]} ${start}% ${current}%`
  })

  return `conic-gradient(${segments.join(', ')})`
})

// ==================================================
// Dashboard loading
// ==================================================

onMounted(async () => {
  try {
    const [dashboardData, profileResponse] =
      await Promise.all([
        dashboardStore.fetchDashboardData(),
        getProfile(),
      ])


    activityHistory.value =
      await dashboardStore.fetchActivityHistory()

    userName.value =
      profileResponse.user?.name || ''
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  }
})
</script>

<template>
  <div
    class="flex-1 overflow-auto bg-gray-50"
  >
    <div
      class="p-6 lg:p-8 max-w-[1600px] mx-auto"
    >

      <!-- =========================================
           HEADER
      ========================================== -->

      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Welcome back<span v-if="userName">, {{ userName }}</span>! 👋
        </h1>

        <p
          class="text-gray-600 mt-2"
        >
          Here's what's happening with
          your repositories today.
        </p>
      </div>

      <!-- =========================================
           LOADING
      ========================================== -->

      <div
        v-if="dashboardStore.loading"
        class="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center"
      >
        <Loader2
          class="w-8 h-8 text-green-600 animate-spin"
        />

        <p
          class="text-gray-600 mt-3"
        >
          Loading dashboard...
        </p>
      </div>

      <!-- =========================================
           ERROR
      ========================================== -->

      <div
        v-else-if="dashboardStore.error"
        class="mb-8 bg-red-50 border border-red-200 rounded-xl p-5"
      >
        <p
          class="font-semibold text-red-800"
        >
          Unable to load dashboard
        </p>

        <p
          class="text-sm text-red-700 mt-1"
        >
          {{ dashboardStore.error }}
        </p>
      </div>

      <!-- =========================================
           DASHBOARD CONTENT
      ========================================== -->

      <template v-else>

        <!-- =======================================
             STAT CARDS
        ======================================== -->

        <div
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6"
        >

          <div
            v-for="stat in statsCards"
            :key="stat.label"
            class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
          >

            <div
              class="flex items-start justify-between"
            >

              <div>
                <p
                  class="text-sm text-gray-500 mb-3"
                >
                  {{ stat.label }}
                </p>

                <div
                  class="flex items-baseline gap-1"
                >
                  <span
                    class="text-3xl font-bold text-gray-900"
                  >
                    {{ stat.value }}
                  </span>

                  <span
                    v-if="stat.suffix"
                    class="text-sm font-medium text-gray-500"
                  >
                    {{ stat.suffix }}
                  </span>
                </div>
              </div>

              <div
                :class="[
                  stat.iconClass,
                  'w-11 h-11 rounded-lg flex items-center justify-center'
                ]"
              >
                <component
                  :is="stat.icon"
                  class="w-5 h-5 text-white"
                />
              </div>

            </div>
          </div>

        </div>

        <!-- =======================================
             MAIN GRID
        ======================================== -->

        <div
          class="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-6"
        >

          <!-- =====================================
               RECENT ANALYSES
          ====================================== -->

          <section
            class="xl:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden"
          >

            <div
              class="px-6 py-5 border-b border-gray-100 flex items-center justify-between"
            >

              <div>
                <h2
                  class="text-lg font-bold text-gray-900"
                >
                  Recent Analyses
                </h2>

                <p
                  class="text-xs text-gray-500 mt-1"
                >
                  Your latest repository analyses
                </p>
              </div>

              <RouterLink
                to="/history"
                class="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center gap-1"
              >
                View all

                <ArrowRight
                  class="w-4 h-4"
                />
              </RouterLink>

            </div>

            <div
              v-if="
                recentAnalyses.length
              "
              class="divide-y divide-gray-100"
            >

              <RouterLink
                v-for="analysis in recentAnalyses"
                :key="analysis.id"
                :to="{
                  path: '/repository',
                  query: {
                    id: analysis.repositoryId,
                  },
                }"
                class="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition group"
              >

                <div
                  class="flex items-center gap-3 min-w-0"
                >

                  <div
                    class="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
                  >
                    <Code2
                      class="w-4 h-4 text-gray-600"
                    />
                  </div>

                  <div
                    class="min-w-0"
                  >
                    <p
                      class="font-semibold text-gray-900 truncate"
                    >
                      {{ analysis.name }}
                    </p>

                    <p
                      class="text-xs text-gray-500 mt-1"
                    >
                      {{
                        getRelativeDate(
                          analysis.date
                        )
                      }}
                    </p>
                  </div>

                </div>

                <div
                  class="flex items-center gap-5 ml-4"
                >

                  <div
                    class="text-right"
                  >
                    <p
                      class="text-xl font-bold text-green-600"
                    >
                      {{ analysis.health }}
                    </p>

                    <p
                      class="text-[11px] text-gray-500"
                    >
                      /100
                    </p>
                  </div>

                  <ArrowRight
                    class="w-4 h-4 text-gray-400 group-hover:text-green-600 transition"
                  />

                </div>

              </RouterLink>

            </div>

            <div
              v-else
              class="p-10 text-center"
            >
              <Code2
                class="w-8 h-8 text-gray-300 mx-auto"
              />

              <p
                class="text-sm text-gray-500 mt-3"
              >
                No analyses yet.
              </p>

              <RouterLink
                to="/analyze"
                class="inline-block mt-3 text-sm font-semibold text-green-600 hover:text-green-700"
              >
                Analyze a repository
              </RouterLink>
            </div>

          </section>

          <!-- =====================================
               TOP LANGUAGES
          ====================================== -->

          <section
            class="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-6"
          >

            <div
              class="mb-5"
            >
              <h2
                class="text-lg font-bold text-gray-900"
              >
                Top Languages
              </h2>

              <p
                class="text-xs text-gray-500 mt-1"
              >
                Across your analyzed repositories
              </p>
            </div>

            <div
              v-if="languages.length"
              class="flex items-center gap-7"
            >

              <!-- Donut -->

              <div
                class="relative w-36 h-36 shrink-0 rounded-full"
                :style="{
                  background: languageGradient
                }"
              >

                <div
                  class="absolute inset-5 bg-white rounded-full"
                ></div>

              </div>

              <!-- Legend -->

              <div
                class="flex-1 space-y-3"
              >

                <div
                  v-for="language in languages"
                  :key="language.name"
                  class="flex items-center justify-between gap-3"
                >

                  <div
                    class="flex items-center gap-2 min-w-0"
                  >
                    <span
                      :class="[
                        language.color,
                        'w-2.5 h-2.5 rounded-full shrink-0'
                      ]"
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
              class="h-36 flex items-center justify-center text-sm text-gray-500"
            >
              Language data is not available yet.
            </div>

          </section>

        </div>

        <!-- =======================================
             ACTIVITY
        ======================================== -->

        <section
          class="bg-white rounded-xl border border-gray-200 p-6"
        >

          <div
            class="flex items-start justify-between mb-5"
          >

            <div>
              <h2
                class="text-lg font-bold text-gray-900"
              >
                Your Activity
              </h2>

              <p
                class="text-xs text-gray-500 mt-1"
              >
                Repository analysis activity over the last 7 days
              </p>
            </div>

            <div
              class="flex items-center gap-2 text-xs text-gray-500"
            >
              <Activity
                class="w-4 h-4"
              />
              Last 7 days
            </div>

          </div>

          <div
            v-if="activity.length"
            class="w-full overflow-hidden"
          >

            <svg
              viewBox="0 0 700 220"
              preserveAspectRatio="none"
              class="w-full h-56"
            >

              <!-- Grid -->

              <line
                x1="20"
                y1="40"
                x2="680"
                y2="40"
                stroke="#e5e7eb"
                stroke-width="1"
              />

              <line
                x1="20"
                y1="100"
                x2="680"
                y2="100"
                stroke="#e5e7eb"
                stroke-width="1"
              />

              <line
                x1="20"
                y1="160"
                x2="680"
                y2="160"
                stroke="#e5e7eb"
                stroke-width="1"
              />

              <!-- Area -->

              <polygon
                v-if="activityPoints"
                :points="`20,200 ${activityPoints} 680,200`"
                fill="#dcfce7"
              />

              <!-- Line -->

              <polyline
                v-if="activityPoints"
                :points="activityPoints"
                fill="none"
                stroke="#16a34a"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />

              <!-- Points -->

              <circle
                v-for="(item, index) in activity"
                :key="item.date"
                :cx="
                  activity.length === 1
                    ? 350
                    : 20 +
                      (index /
                        (activity.length - 1)) *
                        660
                "
                :cy="
                  200 -
                  (item.value /
                    maxActivity) *
                    160
                "
                r="5"
                fill="#16a34a"
              />

            </svg>

            <!-- Labels -->

            <div
              class="grid grid-cols-7 gap-2 mt-1"
            >

              <div
                v-for="item in activity"
                :key="`${item.date}-label`"
                class="text-center"
              >

                <p
                  class="text-[11px] text-gray-500"
                >
                  {{ item.label }}
                </p>

                <p
                  class="text-xs font-semibold text-gray-800 mt-1"
                >
                  {{ item.value }}
                </p>

              </div>

            </div>

          </div>

          <div
            v-else
            class="h-56 flex items-center justify-center bg-gray-50 rounded-lg"
          >
            <p
              class="text-sm text-gray-500"
            >
              No activity data available yet.
            </p>
          </div>

        </section>

      </template>

    </div>
  </div>
</template>