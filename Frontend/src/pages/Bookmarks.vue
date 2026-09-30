<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarkStore } from '@/stores/bookmark'
import { Star, Code2 } from '@lucide/vue'

const router = useRouter()
const bookmarkStore = useBookmarkStore()

const bookmarks = ref([])
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true

  try {
    await bookmarkStore.fetchBookmarks()
    bookmarks.value = bookmarkStore.bookmarks
  } catch (error) {
    console.error('Failed to load bookmarks:', error)
  } finally {
    isLoading.value = false
  }
})

const getRepositoryOwner = (bookmark) =>
  bookmark.owner || bookmark.repository?.owner || ''

const getRepositoryName = (bookmark) => {
  const owner = getRepositoryOwner(bookmark)

  let name =
    bookmark.name ||
    bookmark.repository?.name ||
    'Unknown Repository'

  if (owner && name.startsWith(`${owner}/`)) {
    name = name.slice(owner.length + 1)
  }

  return name
}

const getHealthScore = (bookmark) =>
  bookmark.healthScore ??
  bookmark.health ??
  bookmark.repository?.healthScore ??
  bookmark.repository?.health ??
  0

const getLanguage = (bookmark) =>
  bookmark.language ||
  bookmark.repository?.language ||
  'Unknown'

const getRepositoryUrl = (bookmark) => {
  return (
    bookmark.url ||
    bookmark.repository?.url ||
    ''
  )
}

const getRepositoryId = (bookmark) => {
  return (
    bookmark.repositoryId ||
    bookmark.repository?.id ||
    bookmark.id
  )
}

const openRepository = (bookmark) => {
  const repositoryId = getRepositoryId(bookmark)

  if (
    repositoryId &&
    bookmark.repository?.id
  ) {
    router.push({
      path: '/repository',
      query: {
        id: repositoryId,
      },
    })

    return
  }

  const url = getRepositoryUrl(bookmark)

  if (url) {
    window.open(url, '_blank')
  }
}

const removeBookmark = async (bookmark) => {
  try {
    await bookmarkStore.removeBookmark(bookmark.id)

    bookmarks.value =
      bookmarks.value.filter(
        (item) => item.id !== bookmark.id
      )
  } catch (error) {
    console.error(
      'Failed to remove bookmark:',
      error
    )
  }
}
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Bookmarked Repositories
        </h1>

        <p class="text-gray-600">
          Your saved repositories for quick access.
        </p>
      </div>

      <!-- Loading -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-16"
      >
        <div class="text-center">
          <div
            class="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3"
          ></div>

          <p class="text-sm text-gray-500">
            Loading bookmarks...
          </p>
        </div>
      </div>

      <!-- Bookmarks -->
      <div
        v-else-if="bookmarks.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >

        <!-- Bookmark Card -->
        <div
          v-for="bookmark in bookmarks"
          :key="bookmark.id"
          @click="openRepository(bookmark)"
          class="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition cursor-pointer"
        >
          <div class="flex items-start justify-between gap-3 mb-6">
            <div class="min-w-0">
              <h2 class="text-base font-semibold text-gray-900 truncate">
                <span v-if="getRepositoryOwner(bookmark)">
                  {{ getRepositoryOwner(bookmark) }} /
                </span>
                {{ getRepositoryName(bookmark) }}
              </h2>
            </div>

            <button
              type="button"
              @click.stop="removeBookmark(bookmark)"
              title="Remove bookmark"
              class="shrink-0 p-1 rounded hover:bg-yellow-50 transition"
            >
              <Star
                class="w-5 h-5 text-yellow-500"
                fill="currentColor"
              />
            </button>
          </div>

          <div class="mb-5">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-bold text-gray-900">
                {{ getHealthScore(bookmark) }}
              </span>

              <span class="text-sm text-gray-500">
                /100
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm text-gray-600">
            <span class="w-2 h-2 rounded-full bg-yellow-400 shrink-0"></span>
            <span>{{ getLanguage(bookmark) }}</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="bg-white border border-gray-200 rounded-xl py-16 text-center"
      >

        <Star
          class="w-12 h-12 mx-auto mb-4 text-gray-300"
        />

        <h2
          class="text-lg font-semibold text-gray-900 mb-2"
        >
          No bookmarks yet
        </h2>

        <p
          class="text-sm text-gray-500 mb-5"
        >
          Save repositories you want to access quickly.
        </p>

        <router-link
          to="/analyze"
          class="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Analyze a Repository
        </router-link>

      </div>

    </div>
  </div>
</template>