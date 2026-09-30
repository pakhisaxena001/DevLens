<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRepositoryStore } from '@/stores/repository'
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  ShieldCheck,
  CircleAlert,
  Lightbulb,
  ArrowLeft,
  Star,
} from '@lucide/vue'

const route = useRoute()
const router = useRouter()
const repositoryStore = useRepositoryStore()

const repository = ref(null)
const analysis = ref(null)
const loading = ref(true)
const error = ref('')

const aiSummary = computed(() => analysis.value?.aiSummary || null)

const summary = computed(() => aiSummary.value?.summary || '')

const strengths = computed(() =>
  Array.isArray(aiSummary.value?.strengths)
    ? aiSummary.value.strengths
    : []
)

const weaknesses = computed(() =>
  Array.isArray(aiSummary.value?.weaknesses)
    ? aiSummary.value.weaknesses
    : []
)

const recommendations = computed(() =>
  Array.isArray(aiSummary.value?.recommendations)
    ? aiSummary.value.recommendations
    : []
)

const healthScore = computed(() => analysis.value?.healthScore ?? 0)

const securityScore = computed(
  () => analysis.value?.securityScore ?? analysis.value?.scores?.security ?? 0
)

const beginnerFriendlyScore = computed(
  () =>
    analysis.value?.beginnerFriendlyScore ??
    analysis.value?.beginnerFriendly ??
    0
)

const openIssues = computed(() => repository.value?.openIssues ?? 0)

const overallRisk = computed(() => {
  if (securityScore.value < 50 || openIssues.value > 1000) {
    return {
      label: 'High',
      color: 'text-red-600',
      bg: 'bg-red-50',
      icon: AlertTriangle,
    }
  }

  if (securityScore.value < 70 || openIssues.value > 500) {
    return {
      label: 'Medium',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      icon: AlertTriangle,
    }
  }

  return {
    label: 'Low',
    color: 'text-green-600',
    bg: 'bg-green-50',
    icon: ShieldCheck,
  }
})

const beginnerStars = computed(() => {
  return Math.round(beginnerFriendlyScore.value / 20)
})

const getRecommendationIcon = (index) => {
  if (index === 0) return AlertTriangle
  if (index === 1) return Lightbulb
  return CheckCircle
}

const goBack = () => {
  const repositoryId = route.query.id

  if (repositoryId) {
    router.push({
      path: '/repository',
      query: { id: repositoryId },
    })
    return
  }

  router.push('/repository')
}

onMounted(async () => {
  loading.value = true
  error.value = ''

  try {
    const repositoryId = route.query.id

    if (!repositoryId) {
      throw new Error('Repository ID is required to view AI insights.')
    }

    repository.value = await repositoryStore.getRepositoryDetails(repositoryId)

    analysis.value = await repositoryStore.getInsights(repositoryId)

    if (!analysis.value) {
      throw new Error('No analysis is available for this repository.')
    }
  } catch (err) {
    console.error('Failed to load AI insights:', err)

    error.value = err.message || 'Failed to load AI insights.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading -->
    <div
      v-if="loading"
      class="min-h-screen flex items-center justify-center"
    >
      <div class="text-center">
        <Sparkles class="w-8 h-8 text-green-600 mx-auto mb-3 animate-pulse" />
        <p class="text-sm text-gray-500">
          Generating AI insights...
        </p>
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="max-w-5xl mx-auto px-6 py-10"
    >
      <div class="bg-white border border-red-200 rounded-xl p-6 text-center">
        <CircleAlert class="w-8 h-8 text-red-500 mx-auto mb-3" />

        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          Unable to load AI insights
        </h2>

        <p class="text-sm text-gray-500 mb-5">
          {{ error }}
        </p>

        <button
          type="button"
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft class="w-4 h-4" />
          Back to Repository
        </button>
      </div>
    </div>

    <!-- Main -->
    <main
      v-else
      class="max-w-7xl mx-auto px-6 py-6"
    >
      <!-- Back -->
      <button
        type="button"
        @click="goBack"
        class="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4"
      >
        <ArrowLeft class="w-4 h-4" />
        Back to Repository
      </button>

      <!-- Header -->
      <div class="mb-6">
        <div class="flex items-center gap-2 mb-1">
          <Sparkles class="w-6 h-6 text-green-600" />

          <h1 class="text-2xl font-bold text-gray-900">
            AI Insights & Recommendations
          </h1>
        </div>

        <p class="text-sm text-gray-500">
          AI-powered analysis of
          <span class="font-medium text-gray-700">
            {{ repository?.owner }}/{{ repository?.name }}
          </span>
        </p>
      </div>

      <!-- Score cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-medium text-gray-500 mb-2">
            Health Score
          </p>

          <div class="flex items-end gap-1">
            <span class="text-3xl font-bold text-green-600">
              {{ healthScore }}
            </span>

            <span class="text-sm text-gray-400 mb-1">
              /100
            </span>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-medium text-gray-500 mb-2">
            Beginner Friendly
          </p>

          <div class="flex items-end gap-1">
            <span class="text-3xl font-bold text-gray-900">
              {{ beginnerFriendlyScore }}
            </span>

            <span class="text-sm text-gray-400 mb-1">
              /100
            </span>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-xl p-5">
          <p class="text-xs font-medium text-gray-500 mb-2">
            AI Recommendations
          </p>

          <span class="text-3xl font-bold text-blue-600">
            {{ recommendations.length }}
          </span>
        </div>
      </div>

      <!-- Main content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <!-- Left -->
        <div class="lg:col-span-2 space-y-5">
          <!-- AI Summary -->
          <section class="bg-white border border-gray-200 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-4">
              <Sparkles class="w-5 h-5 text-green-600" />

              <h2 class="text-base font-bold text-gray-900">
                AI Summary
              </h2>
            </div>

            <p class="text-sm text-gray-600 leading-6">
              {{ summary }}
            </p>
          </section>

          <!-- Beginner Friendliness -->
          <section class="bg-white border border-gray-200 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-4">
              <Star class="w-5 h-5 text-yellow-500" />

              <h2 class="text-base font-bold text-gray-900">
                Beginner Friendliness
              </h2>
            </div>

            <div class="flex items-center gap-1 mb-3">
              <Star
                v-for="star in 5"
                :key="star"
                class="w-5 h-5"
                :class="
                  star <= beginnerStars
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                "
              />
            </div>

            <p class="text-sm font-semibold text-gray-900 mb-1">
              {{
                beginnerFriendlyScore >= 80
                  ? 'Very beginner friendly'
                  : beginnerFriendlyScore >= 60
                    ? 'Moderately beginner friendly'
                    : beginnerFriendlyScore >= 40
                      ? 'Somewhat beginner friendly'
                      : 'Not very beginner friendly'
              }}
            </p>

            <p class="text-xs text-gray-500">
              This score is based on the DevLens beginner-friendliness analysis.
            </p>
          </section>

          <!-- Strengths -->
          <section class="bg-white border border-gray-200 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-4">
              <CheckCircle class="w-5 h-5 text-green-600" />

              <h2 class="text-base font-bold text-gray-900">
                Key Strengths
              </h2>
            </div>

            <ul class="space-y-3">
              <li
                v-for="item in strengths"
                :key="item"
                class="flex items-start gap-3 text-sm text-gray-600"
              >
                <span class="text-green-600 mt-1">
                  •
                </span>

                <span>{{ item }}</span>
              </li>
            </ul>
          </section>

          <!-- Areas to Improve -->
          <section class="bg-white border border-gray-200 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-4">
              <AlertTriangle class="w-5 h-5 text-orange-500" />

              <h2 class="text-base font-bold text-gray-900">
                Areas to Improve
              </h2>
            </div>

            <ul class="space-y-3">
              <li
                v-for="item in weaknesses"
                :key="item"
                class="flex items-start gap-3 text-sm text-gray-600"
              >
                <span class="text-orange-500 mt-1">
                  •
                </span>

                <span>{{ item }}</span>
              </li>
            </ul>
          </section>
        </div>

        <!-- Right -->
        <div class="space-y-5">
          <!-- Recommendations -->
          <section class="bg-white border border-gray-200 rounded-xl p-6">
            <div class="flex items-center gap-2 mb-4">
              <Lightbulb class="w-5 h-5 text-blue-600" />

              <h2 class="text-base font-bold text-gray-900">
                AI Recommendations
              </h2>
            </div>

            <div class="space-y-3">
              <div
                v-for="(item, index) in recommendations"
                :key="item"
                class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start gap-3">
                  <component
                    :is="getRecommendationIcon(index)"
                    class="w-4 h-4 text-blue-600 mt-0.5 shrink-0"
                  />

                  <div>
                    <p class="text-sm text-gray-700 leading-5">
                      {{ item }}
                    </p>

                    <span
                      class="inline-block mt-2 text-[11px] font-medium px-2 py-1 rounded-full"
                      :class="
                        index === 0
                          ? 'bg-red-50 text-red-600'
                          : index === 1
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-green-50 text-green-600'
                      "
                    >
                      {{
                        index === 0
                          ? 'High Priority'
                          : index === 1
                            ? 'Medium Priority'
                            : 'Recommended'
                      }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Risk Analysis -->
          <section class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-base font-bold text-gray-900 mb-4">
              Risk Analysis
            </h2>

            <div class="space-y-3">
              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <ShieldCheck class="w-4 h-4 text-green-600" />

                  <div>
                    <p class="text-sm font-medium text-gray-800">
                      Security Risk
                    </p>

                    <p class="text-xs text-gray-500 mt-1">
                      Security score: {{ securityScore }}/100
                    </p>
                  </div>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <CircleAlert class="w-4 h-4 text-green-600" />

                  <div>
                    <p class="text-sm font-medium text-gray-800">
                      Open Issues
                    </p>

                    <p class="text-xs text-gray-500 mt-1">
                      {{ openIssues }} open issues currently tracked.
                    </p>
                  </div>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-4">
                <div class="flex items-center gap-3">
                  <AlertTriangle class="w-4 h-4 text-orange-500" />

                  <div>
                    <p class="text-sm font-medium text-gray-800">
                      AI-Identified Areas to Improve
                    </p>

                    <p class="text-xs text-gray-500 mt-1">
                      {{ weaknesses.length }} areas identified.
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="rounded-lg p-4"
                :class="overallRisk.bg"
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="overallRisk.icon"
                    class="w-5 h-5"
                    :class="overallRisk.color"
                  />

                  <div>
                    <p class="text-xs text-gray-500">
                      Overall Risk
                    </p>

                    <p
                      class="text-sm font-bold"
                      :class="overallRisk.color"
                    >
                      {{ overallRisk.label }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>