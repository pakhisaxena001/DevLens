<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useBookmarkStore } from '@/stores/bookmark'
import { User, Mail, Lock, CornerDownLeftIcon, LogOut, Eye } from '@lucide/vue'

const router = useRouter()
const profileStore = useProfileStore()
const bookmarkStore = useBookmarkStore()

const activeTab = ref('repositories')
const isEditing = ref(false)
const isSaving = ref(false)
const showPasswordForm = ref(false)

const profile = ref({
  name: '',
  email: '',
  bio: '',
})

const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const user = computed(() => profileStore.user)

const bookmarks = computed(() => bookmarkStore.bookmarks)

const isLoading = computed(
  () => profileStore.isLoading || bookmarkStore.isLoading
)

const getInitials = (name) => {
  if (!name) return 'U'

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

const memberSince = computed(() => {
  if (!user.value?.createdAt) {
    return 'Member since recently'
  }

  const date = new Date(user.value.createdAt)

  if (Number.isNaN(date.getTime())) {
    return 'Member since recently'
  }

  return `Member since ${date.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })}`
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

const getHealthScore = (bookmark) => {
  const score =
    bookmark.healthScore ??
    bookmark.health ??
    bookmark.repository?.healthScore ??
    bookmark.repository?.health

  return typeof score === 'number' ? score : null
}

const getBookmarkDate = (bookmark) => {
  const dateValue =
    bookmark.createdAt ||
    bookmark.date

  if (!dateValue) return '-'

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return '-'

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getHealthColor = (score) => {
  if (score === null) return 'text-gray-500'
  if (score >= 85) return 'text-green-600'
  if (score >= 70) return 'text-yellow-600'
  return 'text-red-600'
}

const getRepositoryId = (bookmark) =>
  bookmark.repositoryId ||
  bookmark.repository?.id

const openRepository = (bookmark) => {
  const repositoryId = getRepositoryId(bookmark)

  if (repositoryId) {
    router.push({
      path: '/repository',
      query: {
        id: repositoryId,
      },
    })
    return
  }

  if (bookmark.url) {
    window.open(bookmark.url, '_blank')
  }
}

const startEditing = () => {
  profile.value = {
    name: user.value?.name || '',
    email: user.value?.email || '',
    bio: user.value?.bio || '',
  }

  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveProfile = async () => {
  isSaving.value = true

  try {
    await profileStore.updateProfile({
      name: profile.value.name,
      bio: profile.value.bio,
    })

    isEditing.value = false
  } catch (error) {
    alert(error.message || 'Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

const changePassword = async () => {
  if (
    !passwordData.value.currentPassword ||
    !passwordData.value.newPassword
  ) {
    alert('Please fill in all password fields')
    return
  }

  if (
    passwordData.value.newPassword !==
    passwordData.value.confirmPassword
  ) {
    alert('Passwords do not match')
    return
  }

  alert(
    'Password update is not connected to the backend yet.'
  )
}

const logout = async () => {
  await profileStore.$dispose?.()
  await router.push('/login')
}

onMounted(async () => {
  try {
    await Promise.all([
      profileStore.fetchProfile(),
      bookmarkStore.fetchBookmarks(),
    ])
  } catch (error) {
    console.error('Failed to load profile:', error)
  }
})
</script>

<template>
  <div class="flex-1 overflow-auto bg-gray-50">
    <div class="p-8">

      <!-- Header -->
      <div class="mb-7">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          Profile
        </h1>

        <p class="text-gray-600">
          Manage your account and preferences.
        </p>
      </div>

      <!-- Profile Header Card -->
      <div
        class="bg-white border border-gray-200 rounded-xl p-6 mb-5"
      >
        <div class="flex items-center justify-between gap-6">

          <div class="flex items-center gap-5 min-w-0">

            <!-- Avatar -->
            <div
              class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center shrink-0"
            >
              <span class="text-2xl font-semibold text-gray-600">
                {{ getInitials(user?.name) }}
              </span>
            </div>

            <!-- User Details -->
            <div class="min-w-0">
              <h2 class="text-xl font-bold text-gray-900">
                {{ user?.name || 'User' }}
              </h2>

              <p class="text-sm text-gray-600 mt-1">
                {{ user?.email || 'No email available' }}
              </p>

              <p class="text-sm text-gray-500 mt-1">
                {{ memberSince }}
              </p>
            </div>

          </div>

          <!-- Edit -->
          <button
            type="button"
            @click="startEditing"
            class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition shrink-0"
          >
            Edit Profile
          </button>

        </div>

        <!-- Edit Form -->
        <div
          v-if="isEditing"
          class="mt-6 pt-6 border-t border-gray-200"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name
              </label>

              <div class="relative">
                <User
                  class="absolute left-3 top-3 w-5 h-5 text-gray-400"
                />

                <input
                  v-model="profile.name"
                  type="text"
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>

              <div class="relative">
                <Mail
                  class="absolute left-3 top-3 w-5 h-5 text-gray-400"
                />

                <input
                  v-model="profile.email"
                  type="email"
                  readonly
                  class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
            </div>

            <div class="md:col-span-2">
              <label
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Bio
              </label>

              <textarea
                v-model="profile.bio"
                rows="3"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 resize-none"
              ></textarea>
            </div>

          </div>

          <div class="flex justify-end gap-3 mt-5">
            <button
              type="button"
              @click="cancelEditing"
              class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              @click="saveProfile"
              :disabled="isSaving"
              class="px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-semibold transition"
            >
              {{ isSaving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div
        class="bg-white border border-gray-200 rounded-t-xl"
      >
        <div class="flex items-center border-b border-gray-200 px-6">

          <button
            type="button"
            @click="activeTab = 'repositories'"
            class="px-5 py-4 text-sm font-semibold transition relative"
            :class="
              activeTab === 'repositories'
                ? 'text-green-700'
                : 'text-gray-500 hover:text-gray-800'
            "
          >
            Saved Repositories

            <span
              v-if="activeTab === 'repositories'"
              class="absolute left-0 right-0 bottom-0 h-0.5 bg-green-600"
            ></span>
          </button>

          <button
            type="button"
            @click="activeTab = 'account'"
            class="px-5 py-4 text-sm font-semibold transition relative"
            :class="
              activeTab === 'account'
                ? 'text-green-700'
                : 'text-gray-500 hover:text-gray-800'
            "
          >
            Account Settings

            <span
              v-if="activeTab === 'account'"
              class="absolute left-0 right-0 bottom-0 h-0.5 bg-green-600"
            ></span>
          </button>

          <button
            type="button"
            @click="activeTab = 'preferences'"
            class="px-5 py-4 text-sm font-semibold transition relative"
            :class="
              activeTab === 'preferences'
                ? 'text-green-700'
                : 'text-gray-500 hover:text-gray-800'
            "
          >
            Preferences

            <span
              v-if="activeTab === 'preferences'"
              class="absolute left-0 right-0 bottom-0 h-0.5 bg-green-600"
            ></span>
          </button>

        </div>

        <!-- Saved Repositories -->
        <div
          v-if="activeTab === 'repositories'"
          class="overflow-hidden rounded-b-xl"
        >

          <div
            v-if="isLoading"
            class="py-14 text-center"
          >
            <div
              class="w-8 h-8 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-3"
            ></div>

            <p class="text-sm text-gray-500">
              Loading repositories...
            </p>
          </div>

          <div
            v-else-if="bookmarks.length"
            class="divide-y divide-gray-200"
          >

            <div
              v-for="bookmark in bookmarks"
              :key="bookmark.id"
              @click="openRepository(bookmark)"
              class="grid grid-cols-[1fr_140px_150px] items-center gap-5 px-7 py-5 hover:bg-gray-50 transition cursor-pointer"
            >

              <!-- Repository -->
              <div class="flex items-center gap-4 min-w-0">

                <div
                  class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                >
                  <Code
                    class="w-5 h-5 text-gray-700"
                  />
                </div>

                <div class="min-w-0">
                  <p class="font-semibold text-gray-900 truncate">
                    <span v-if="getRepositoryOwner(bookmark)">
                      {{ getRepositoryOwner(bookmark) }} /
                    </span>

                    {{ getRepositoryName(bookmark) }}
                  </p>
                </div>

              </div>

              <!-- Health -->
              <div
                class="font-semibold"
                :class="getHealthColor(getHealthScore(bookmark))"
              >
                {{
                  getHealthScore(bookmark) !== null
                    ? `${getHealthScore(bookmark)}/100`
                    : '-'
                }}
              </div>

              <!-- Date -->
              <div
                class="text-sm text-gray-600 text-right"
              >
                {{ getBookmarkDate(bookmark) }}
              </div>

            </div>

          </div>

          <div
            v-else
            class="py-14 text-center"
          >
            <Github
              class="w-10 h-10 mx-auto mb-3 text-gray-300"
            />

            <h3
              class="font-semibold text-gray-900 mb-1"
            >
              No saved repositories
            </h3>

            <p class="text-sm text-gray-500">
              Bookmark repositories to see them here.
            </p>
          </div>

        </div>

        <!-- Account Settings -->
        <div
          v-else-if="activeTab === 'account'"
          class="p-7 space-y-6"
        >

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-gray-900">
                  Password
                </h3>

                <p class="text-sm text-gray-500 mt-1">
                  Update your account password.
                </p>
              </div>

              <button
                v-if="!showPasswordForm"
                type="button"
                @click="showPasswordForm = true"
                class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition flex items-center gap-2"
              >
                <Lock class="w-4 h-4" />
                Change Password
              </button>
            </div>

            <div
              v-if="showPasswordForm"
              class="mt-5 max-w-lg space-y-4"
            >
              <input
                v-model="passwordData.currentPassword"
                type="password"
                placeholder="Current password"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />

              <input
                v-model="passwordData.newPassword"
                type="password"
                placeholder="New password"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />

              <input
                v-model="passwordData.confirmPassword"
                type="password"
                placeholder="Confirm new password"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
              />

              <div class="flex gap-3">
                <button
                  type="button"
                  @click="changePassword"
                  class="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold"
                >
                  Update Password
                </button>

                <button
                  type="button"
                  @click="showPasswordForm = false"
                  class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Github class="w-5 h-5 text-gray-700" />

                <div>
                  <h3 class="font-semibold text-gray-900">
                    GitHub
                  </h3>

                  <p class="text-sm text-gray-500">
                    {{ user?.githubUsername
                      ? `Connected as @${user.githubUsername}`
                      : 'GitHub account connected'
                    }}
                  </p>
                </div>
              </div>

              <span
                class="text-sm font-semibold text-green-600"
              >
                Connected
              </span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="font-semibold text-red-700 mb-2">
              Danger Zone
            </h3>

            <p class="text-sm text-gray-500 mb-4">
              Sign out of your DevLens account.
            </p>

            <button
              type="button"
              @click="logout"
              class="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition"
            >
              <LogOut class="w-4 h-4" />
              Logout
            </button>
          </div>

        </div>

        <!-- Preferences -->
        <div
          v-else
          class="p-7"
        >
          <h3 class="font-semibold text-gray-900 mb-2">
            Preferences
          </h3>

          <p class="text-sm text-gray-500">
            Preference controls can be added here as the
            application settings are expanded.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>