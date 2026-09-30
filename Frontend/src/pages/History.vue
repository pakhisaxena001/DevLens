<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoryStore } from '@/stores/history'
import { Clock, Eye } from '@lucide/vue'

const router = useRouter()
const historyStore = useHistoryStore()

const analyses = computed(() => historyStore.analyses)
const isLoading = computed(() => historyStore.isLoading)

const averageHealth = computed(() => {
  if (!analyses.value.length) return 0

  const total = analyses.value.reduce(
    (sum, analysis) => sum + analysis.health,
    0
  )

  return Math.round(total / analyses.value.length)
})

const thisMonthCount = computed(() => {
  const now = new Date()

  return analyses.value.filter((analysis) => {
    const date = new Date(analysis.date)

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    )
  }).length
})

const getHealthColor = (health) => {
  if (health >= 85) return 'text-green-600'
  if (health >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return dateValue
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatTime = (dateValue) => {
  if (!dateValue) return ''

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

const viewAnalysis = (analysis) => {
  router.push({
    path: '/repository',
    query: {
      id: analysis.repositoryId,
    },
  })
}

onMounted(async () => {
  try {
    await historyStore.fetchAnalyses()
  } catch (error) {
    console.error('Failed to load history:', error)
  }
})
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Analysis History
        </h1>

        <p class="text-gray-600">
          View all your previous repository analyses.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="bg-white border border-gray-200 rounded-xl"
      >
        <div class="flex flex-col items-center justify-center py-16">
          <div
            class="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-4"
          ></div>

          <p class="text-sm text-gray-500">
            Loading analysis history...
          </p>
        </div>
      </div>

      <!-- Content -->
      <div v-else>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <p class="text-sm text-gray-500 mb-2">
              Total Analyses
            </p>

            <p class="text-3xl font-bold text-gray-900">
              {{ analyses.length }}
            </p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <p class="text-sm text-gray-500 mb-2">
              Average Health Score
            </p>

            <p class="text-3xl font-bold text-green-600">
              {{ averageHealth }}%
            </p>
          </div>

          <div class="bg-white rounded-xl p-6 border border-gray-200">
            <p class="text-sm text-gray-500 mb-2">
              This Month
            </p>

            <p class="text-3xl font-bold text-blue-600">
              {{ thisMonthCount }}
            </p>
          </div>

        </div>

        <!-- History Table -->
        <div
          v-if="analyses.length"
          class="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >

          <!-- Table Header -->
          <div
            class="grid grid-cols-[2fr_1fr_1.5fr_80px] items-center px-7 py-4 border-b border-gray-200 text-sm font-medium text-gray-500"
          >
            <div>Repository</div>
            <div>Health Score</div>
            <div>Analyzed On</div>
            <div class="text-center">Actions</div>
          </div>

          <!-- Rows -->
          <div
            v-for="(analysis, index) in analyses"
            :key="analysis.id"
            class="grid grid-cols-[2fr_1fr_1.5fr_80px] items-center px-7 py-5"
            :class="{
              'border-b border-gray-200':
                index !== analyses.length - 1,
            }"
          >

            <!-- Repository -->
            <div class="flex items-center gap-3 min-w-0">
              <Clock
                class="w-5 h-5 text-gray-400 flex-shrink-0"
              />

              <span
                class="font-semibold text-gray-800 truncate"
              >
                {{ analysis.name }}
              </span>
            </div>

            <!-- Health -->
            <div
              :class="[
                getHealthColor(analysis.health),
                'font-semibold'
              ]"
            >
              {{ analysis.health }}/100
            </div>

            <!-- Date -->
            <div class="text-sm text-gray-600">
              {{ formatDate(analysis.date) }},
              {{ formatTime(analysis.date) }}
            </div>

            <!-- Action -->
            <div class="flex justify-center">
              <button
                type="button"
                @click="viewAnalysis(analysis)"
                class="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
                title="View analysis"
              >
                <Eye class="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else
          class="bg-white border border-gray-200 rounded-xl py-16 text-center"
        >
          <Clock
            class="w-12 h-12 mx-auto mb-4 text-gray-300"
          />

          <h2 class="text-lg font-semibold text-gray-900 mb-2">
            No analyses yet
          </h2>

          <p class="text-sm text-gray-500">
            Start by analyzing a repository.
          </p>
        </div>

      </div>
    </div>
  </div>
</template>