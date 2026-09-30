<script setup>
import { computed, ref } from 'vue'
import { useCompareStore } from '@/stores/compare'
import { Plus, X, ArrowRight } from '@lucide/vue'

const compareStore = useCompareStore()

const newRepoUrl = ref('')
const comparison = computed(() => compareStore.comparison)
const repositories = computed(() => compareStore.repositories)
const isLoading = computed(() => compareStore.isLoading)
const error = computed(() => compareStore.error)

const addRepository = async () => {
  const url = newRepoUrl.value.trim()

  if (!url || repositories.value.length >= 2) return

  try {
    await compareStore.addRepository(url)
    newRepoUrl.value = ''
  } catch (err) {
    console.error('Failed to add repository:', err)
  }
}

const removeRepository = (index) => {
  compareStore.removeRepository(index)
}

const runComparison = async () => {
  try {
    await compareStore.compare()
  } catch (err) {
    console.error('Failed to compare repositories:', err)
  }
}

const getRepositoryName = (repository) => {
  if (!repository) return ''

  return repository.name || 'Unknown Repository'
}

const getRepositoryOwner = (repository) => {
  if (!repository) return ''

  return repository.owner || ''
}

const getFullName = (repository) => {
  const owner = getRepositoryOwner(repository)
  const name = getRepositoryName(repository)

  return owner ? `${owner} / ${name}` : name
}

const getRepositoryData = (item) => item?.repository || {}
const getDetails = (item) => item?.details || {}
const getAnalysis = (item) => item?.analysis || {}

const getHealthScore = (item) => {
  const score = getAnalysis(item).healthScore

  return typeof score === 'number' ? score : '-'
}

const getStars = (item) => {
  const value = getRepositoryData(item).stars
  return typeof value === 'number' ? value.toLocaleString() : '-'
}

const getForks = (item) => {
  const value = getRepositoryData(item).forks
  return typeof value === 'number' ? value.toLocaleString() : '-'
}

const getWatchers = (item) => {
  const value = getRepositoryData(item).watchers
  return typeof value === 'number' ? value.toLocaleString() : '-'
}

const getOpenIssues = (item) => {
  const value = getRepositoryData(item).openIssues

  return typeof value === 'number'
    ? value.toLocaleString()
    : '-'
}

const getContributors = (item) => {
  const details = getDetails(item)
  const contributors = details.contributors

  if (Array.isArray(contributors)) {
    return contributors.length.toLocaleString()
  }

  if (typeof contributors === 'number') {
    return contributors.toLocaleString()
  }

  return '-'
}

const getLastCommit = (item) => {
  const details = getDetails(item)
  const commits = details.commits

  if (!Array.isArray(commits) || !commits.length) {
    return '-'
  }

  const latestCommit = commits[0]

  const date =
    latestCommit?.date ||
    latestCommit?.commit?.author?.date ||
    latestCommit?.commit?.committer?.date ||
    latestCommit?.author?.date ||
    latestCommit?.committer?.date

  if (!date) return '-'

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return '-'
  }

  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getDocumentation = (item) => {
  const analysis = getAnalysis(item)

  return (
    analysis.documentationScore ??
    analysis.documentation ??
    '-'
  )
}

const getBeginnerFriendly = (item) => {
  const analysis = getAnalysis(item)

  if (analysis.beginnerFriendly !== undefined) {
    return analysis.beginnerFriendly
      ? 'Yes'
      : 'No'
  }

  if (analysis.beginnerFriendlyScore !== undefined) {
    return analysis.beginnerFriendlyScore
  }

  return '-'
}

const getHealthClass = (score) => {
  if (typeof score !== 'number') return 'text-gray-600'
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const formatMetric = (value) => {
  if (value === '-' || value === null || value === undefined) {
    return '-'
  }

  return value
}
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Compare Repositories
        </h1>

        <p class="text-gray-600">
          Select up to 2 repositories to compare.
        </p>
      </div>

      <!-- Repository Selection -->
      <div
        class="bg-white rounded-xl border border-gray-200 p-6 mb-8"
      >
        <div class="flex flex-col lg:flex-row items-center gap-4">

          <!-- Repository 1 -->
          <div class="flex-1 w-full">
            <div
              class="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800"
            >
              <span v-if="repositories[0]">
                {{ getFullName(repositories[0]) }}
              </span>

              <span v-else class="text-gray-400">
                Repository 1
              </span>
            </div>
          </div>

          <ArrowRight
            class="w-6 h-6 text-green-600 shrink-0"
          />

          <!-- Repository 2 -->
          <div class="flex-1 w-full">
            <div
              class="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800"
            >
              <span v-if="repositories[1]">
                {{ getFullName(repositories[1]) }}
              </span>

              <span v-else class="text-gray-400">
                Repository 2
              </span>
            </div>
          </div>

          <!-- Compare -->
          <button
            type="button"
            @click="runComparison"
            :disabled="
              repositories.length !== 2 ||
              isLoading
            "
            class="px-7 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
          >
            {{ isLoading ? 'Comparing...' : 'Compare' }}
          </button>

        </div>

        <!-- Add Repository -->
        <div class="flex gap-3 mt-5">
          <input
            v-model="newRepoUrl"
            @keyup.enter="addRepository"
            type="text"
            :disabled="repositories.length >= 2"
            placeholder="https://github.com/username/repository"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 disabled:bg-gray-100"
          />

          <button
            type="button"
            @click="addRepository"
            :disabled="
              !newRepoUrl.trim() ||
              repositories.length >= 2 ||
              isLoading
            "
            class="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg flex items-center gap-2 transition"
          >
            <Plus class="w-5 h-5" />
            Add
          </button>
        </div>

        <!-- Selected Repository Controls -->
        <div
          v-if="repositories.length"
          class="flex flex-wrap gap-2 mt-4"
        >
          <div
            v-for="(repository, index) in repositories"
            :key="repository.id"
            class="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm"
          >
            <span class="font-medium text-gray-700">
              {{ getFullName(repository) }}
            </span>

            <button
              type="button"
              @click="removeRepository(index)"
              class="p-0.5 rounded hover:bg-gray-200"
            >
              <X class="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        <p
          v-if="error"
          class="mt-3 text-sm text-red-600"
        >
          {{ error }}
        </p>
      </div>

      <!-- Comparison -->
      <div
        v-if="comparison.length === 2"
        class="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >

        <div class="overflow-x-auto">
          <table class="w-full">

            <thead>
              <tr class="border-b border-gray-200">
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-600 w-1/3"
                >
                  Metric
                </th>

                <th
                  v-for="item in comparison"
                  :key="item.repository.id"
                  class="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                >
                  {{ getFullName(item.repository) }}
                </th>
              </tr>
            </thead>

            <tbody>

              <!-- Health Score -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm font-semibold text-gray-700">
                  Health Score
                </td>

                <td
                  v-for="item in comparison"
                  :key="`health-${item.repository.id}`"
                  class="px-6 py-4 text-sm font-semibold"
                  :class="getHealthClass(getHealthScore(item))"
                >
                  {{ getHealthScore(item) }}/100
                </td>
              </tr>

              <!-- Stars -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Stars
                </td>

                <td
                  v-for="item in comparison"
                  :key="`stars-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ getStars(item) }}
                </td>
              </tr>

              <!-- Forks -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Forks
                </td>

                <td
                  v-for="item in comparison"
                  :key="`forks-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ getForks(item) }}
                </td>
              </tr>

              <!-- Watchers -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Watchers
                </td>

                <td
                  v-for="item in comparison"
                  :key="`watchers-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ getWatchers(item) }}
                </td>
              </tr>

              <!-- Open Issues -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Open Issues
                </td>

                <td
                  v-for="item in comparison"
                  :key="`issues-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ getOpenIssues(item) }}
                </td>
              </tr>

              <!-- Contributors -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Contributors
                </td>

                <td
                  v-for="item in comparison"
                  :key="`contributors-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ getContributors(item) }}
                </td>
              </tr>

              <!-- Documentation -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Documentation
                </td>

                <td
                  v-for="item in comparison"
                  :key="`documentation-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ formatMetric(getDocumentation(item)) }}
                </td>
              </tr>

              <!-- Beginner Friendly -->
              <tr class="border-b border-gray-100">
                <td class="px-6 py-4 text-sm text-gray-700">
                  Beginner Friendly
                </td>

                <td
                  v-for="item in comparison"
                  :key="`beginner-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ formatMetric(getBeginnerFriendly(item)) }}
                </td>
              </tr>

              <!-- Last Commit -->
              <tr>
                <td class="px-6 py-4 text-sm text-gray-700">
                  Last Commit
                </td>

                <td
                  v-for="item in comparison"
                  :key="`commit-${item.repository.id}`"
                  class="px-6 py-4 text-sm text-gray-700"
                >
                  {{ getLastCommit(item) }}
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white rounded-xl border border-gray-200 py-16 text-center"
      >
        <Plus
          class="w-12 h-12 mx-auto mb-4 text-gray-300"
        />

        <p class="text-gray-600 mb-2">
          Select two repositories to compare
        </p>

        <p class="text-sm text-gray-500">
          Add repositories above to start comparing.
        </p>
      </div>

    </div>
  </div>
</template>