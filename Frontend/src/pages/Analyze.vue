<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRepositoryStore } from '@/stores/repository'
import { Link, Send, Loader,BarChart3,Users, Sparkles, } from '@lucide/vue'

const router = useRouter()
const repositoryStore = useRepositoryStore()

const repoUrl = ref('')
const isAnalyzing = ref(false)
const error = ref('')

const exampleRepositories = [
  {
    name: 'facebook/react',
    url: 'https://github.com/facebook/react',
  },
  {
    name: 'vercel/next.js',
    url: 'https://github.com/vercel/next.js',
  },
  {
    name: 'tensorflow/tensorflow',
    url: 'https://github.com/tensorflow/tensorflow',
  },
  {
    name: 'vuejs/vue',
    url: 'https://github.com/vuejs/vue',
  },
]

const selectExample = (url) => {
  repoUrl.value = url
  error.value = ''
}

const handleAnalyze = async () => {
  error.value = ''

  const url = repoUrl.value.trim()

  if (!url) {
    error.value = 'Please enter a GitHub repository URL.'
    return
  }

  if (!url.startsWith('https://github.com/')) {
    error.value =
      'Please enter a valid GitHub repository URL.'
    return
  }

  isAnalyzing.value = true

  try {
    const result =
      await repositoryStore.analyzeRepository(url)

    const repository =
      result?.repository ||
      repositoryStore.currentRepository

    if (!repository?.id) {
      throw new Error(
        'Analysis completed, but repository information was not returned.'
      )
    }

    await router.push({
      path: '/repository',
      query: {
        id: repository.id,
      },
    })
  } catch (err) {
    console.error(
      'Failed to analyze repository:',
      err
    )

    error.value =
      err.message ||
      'Failed to analyze repository.'
  } finally {
    isAnalyzing.value = false
  }
}
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50">

    <div
      class="min-h-full flex flex-col items-center px-6 py-14"
    >

      <!-- ========================================= -->
      <!-- HERO -->
      <!-- ========================================= -->

      <div
        class="w-full max-w-4xl text-center"
      >

        

        <h1
          class="text-4xl font-bold
                 tracking-tight
                 text-gray-900"
        >
          Analyze a Repository
        </h1>

        <p
          class="mt-3
                 text-base
                 text-gray-500"
        >
          Enter a GitHub repository URL to generate
          AI-powered insights.
        </p>

      </div>


      <!-- ========================================= -->
      <!-- MAIN ANALYSIS AREA -->
      <!-- ========================================= -->

      <div
        class="w-full max-w-4xl mt-10"
      >

        <div
          class="bg-white
                 border
                 border-gray-200
                 rounded-2xl
                 shadow-sm
                 p-7 md:p-8"
        >

          <!-- Error -->

          <div
            v-if="error"
            class="mb-5
                   px-4
                   py-3
                   bg-red-50
                   border
                   border-red-200
                   rounded-lg"
          >

            <p
              class="text-sm
                     text-red-700"
            >
              {{ error }}
            </p>

          </div>


          <!-- URL LABEL -->

          <label
            class="block
                   text-sm
                   font-semibold
                   text-gray-800
                   mb-3"
          >
            GitHub Repository URL
          </label>


          <!-- INPUT + BUTTON -->

          <div
            class="flex flex-col sm:flex-row gap-3"
          >

            <!-- URL INPUT -->

            <div
              class="relative flex-1"
            >

              <Link
                class="absolute
                       left-4
                       top-1/2
                       -translate-y-1/2
                       w-5
                       h-5
                       text-gray-400"
              />

              <input
                v-model="repoUrl"
                type="url"
                autocomplete="url"
                placeholder="https://github.com/owner/repository"
                :disabled="isAnalyzing"
                class="w-full
                       h-13
                       pl-12
                       pr-4
                       bg-gray-50
                       border
                       border-gray-300
                       rounded-xl
                       text-sm
                       text-gray-900
                       placeholder-gray-400
                       focus:outline-none
                       focus:bg-white
                       focus:border-green-500
                       focus:ring-2
                       focus:ring-green-100
                       transition
                       disabled:bg-gray-100
                       disabled:cursor-not-allowed"
                @keyup.enter="handleAnalyze"
              />

            </div>


            <!-- ANALYZE BUTTON -->

            <button
              type="button"
              @click="handleAnalyze"
              :disabled="
                isAnalyzing ||
                !repoUrl.trim()
              "
              class="h-13
                    px-8
                    bg-green-600
                    hover:bg-green-700
                    active:bg-green-800
                    disabled:bg-green-600
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    text-white
                    font-semibold
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-sm
                    hover:shadow-md
                    transition
                    whitespace-nowrap"
            >

              <Loader
                v-if="isAnalyzing"
                class="w-5 h-5 animate-spin"
              />

              <Send
                v-else
                class="w-4 h-4"
              />

              {{
                isAnalyzing
                  ? 'Analyzing...'
                  : 'Analyze'
              }}

            </button>

          </div>


          <!-- HELPER TEXT -->

          <p
            class="mt-3
                   text-xs
                   text-gray-400"
          >
            Example:
            https://github.com/facebook/react
          </p>


          <!-- ===================================== -->
          <!-- EXAMPLES -->
          <!-- ===================================== -->

          <div
            class="mt-8
                   pt-7
                   border-t
                   border-gray-100"
          >

            <div
              class="flex
                     flex-col
                     sm:flex-row
                     sm:items-center
                     gap-4"
            >

              <p
                class="text-sm
                       font-semibold
                       text-gray-700
                       whitespace-nowrap"
              >
                Try these examples:
              </p>


              <div
                class="flex
                       flex-wrap
                       gap-2"
              >

                <button
                  v-for="repository in exampleRepositories"
                  :key="repository.name"
                  type="button"
                  @click="
                    selectExample(repository.url)
                  "
                  :disabled="isAnalyzing"
                  class="px-4
                         py-2
                         bg-gray-50
                         border
                         border-gray-200
                         rounded-lg
                         text-sm
                         text-gray-600
                         hover:bg-green-50
                         hover:border-green-300
                         hover:text-green-700
                         transition
                         disabled:opacity-50
                         disabled:cursor-not-allowed"
                >
                  {{ repository.name }}
                </button>

              </div>

            </div>

          </div>

        </div>


        <!-- ========================================= -->
        <!-- WHAT DEVLENS ANALYZES -->
        <!-- ========================================= -->

        <div
          class="mt-8
                 grid
                 grid-cols-1
                 md:grid-cols-3
                 gap-4"
        >

          <div
            class="bg-white
                   border
                   border-gray-200
                   rounded-xl
                   p-5"
          >

          <div class="mb-4">
            <BarChart3 class="w-7 h-7 text-gray-700" />
          </div>

            <h3
              class="font-semibold
                     text-gray-900
                     text-sm"
            >
              Repository Metrics
            </h3>

            <p
              class="mt-1
                     text-xs
                     leading-5
                     text-gray-500"
            >
              Analyze activity, commits,
              issues, pull requests and
              repository health.
            </p>

          </div>


          <div
            class="bg-white
                   border
                   border-gray-200
                   rounded-xl
                   p-5"
          >

          <div class="mb-4">
            <Users class="w-7 h-7 text-gray-700" />
          </div>

            <h3
              class="font-semibold
                     text-gray-900
                     text-sm"
            >
              Developer Activity
            </h3>

            <p
              class="mt-1
                     text-xs
                     leading-5
                     text-gray-500"
            >
              Understand contributors,
              collaboration and repository
              activity.
            </p>

          </div>


          <div
            class="bg-white
                   border
                   border-gray-200
                   rounded-xl
                   p-5"
          >

        <div class="mb-4">
          <Sparkles class="w-7 h-7 text-gray-700" />
        </div>

            <h3
              class="font-semibold
                     text-gray-900
                     text-sm"
            >
              AI Insights
            </h3>

            <p
              class="mt-1
                     text-xs
                     leading-5
                     text-gray-500"
            >
              Get technical interpretation
              and recommendations powered
              by Gemini.
            </p>

          </div>

        </div>


        <!-- FOOTER TEXT -->

        <p
          class="mt-7
                 text-center
                 text-xs
                 text-gray-400"
        >
          DevLens turns repository data into
          actionable engineering insights.
        </p>

      </div>

    </div>

  </div>
</template>