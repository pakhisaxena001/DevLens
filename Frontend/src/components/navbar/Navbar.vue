<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  LogOut,
  Settings,
  User,
  ChevronDown,
} from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const showUserMenu = ref(false)

const logout = async () => {
  showUserMenu.value = false

  await authStore.logout()

  await router.push('/')
}

const navigateTo = (path) => {
  showUserMenu.value = false
  router.push(path)
}
</script>

<template>
  <header
    class="h-16 bg-gray-900 border-b border-gray-800 sticky top-0 z-40"
  >

    <div
      class="h-full flex items-center justify-between px-8 lg:px-12"
    >

      <!-- ========================================= -->
      <!-- LOGO -->
      <!-- ========================================= -->

      <button
        @click="router.push('/dashboard')"
        class="text-3xl font-bold tracking-tight"
      >
        <span class="text-white">Dev</span><span class="text-green-400">Lens</span>
      </button>


      <!-- ========================================= -->
      <!-- RIGHT USER -->
      <!-- ========================================= -->

      <div class="relative">

        <button
          @click="showUserMenu = !showUserMenu"
          class="flex items-center gap-4 text-white transition"
        >

          <!-- User circle -->
          <div class="flex items-center justify-center">
            <User class="w-8 h-8 text-gray-300" />
          </div>


          <!-- Username -->
          <span
            class="hidden sm:block text-xl font-semibold text-white"
          >
            {{ authStore.user?.name || 'User' }}
          </span>


          <!-- Arrow -->
          <ChevronDown
            class="w-5 h-5 text-gray-300 transition-transform"
            :class="{ 'rotate-180': showUserMenu }"
          />

        </button>


        <!-- ======================================= -->
        <!-- USER DROPDOWN -->
        <!-- ======================================= -->

        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-4 w-56 overflow-hidden rounded-xl border border-green-500/30 bg-[#08100d] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        >

          <!-- Profile -->
          <button
            @click="navigateTo('/profile')"
            class="w-full flex items-center gap-3 px-5 py-4 text-gray-200 hover:bg-green-500/10 hover:text-green-400 transition text-left"
          >
            <User class="w-5 h-5" />

            <span>
              Profile
            </span>
          </button>


          <!-- Settings -->
          <button
            @click="navigateTo('/settings')"
            class="w-full flex items-center gap-3 px-5 py-4 text-gray-200 hover:bg-green-500/10 hover:text-green-400 transition text-left"
          >
            <Settings class="w-5 h-5" />

            <span>
              Settings
            </span>
          </button>


          <!-- Divider -->
          <div class="border-t border-white/10"></div>


          <!-- Logout -->
          <button
            @click="logout"
            class="w-full flex items-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 transition text-left"
          >
            <LogOut class="w-5 h-5" />

            <span>
              Logout
            </span>
          </button>

        </div>

      </div>

    </div>

  </header>
</template>