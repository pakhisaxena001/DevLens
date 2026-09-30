<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Redirect to dashboard if already logged in
if (authStore.isAuthenticated) {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen grid lg:grid-cols-2 bg-gray-100">
    <!-- Left Section -->
    <div
      class="hidden lg:flex items-center justify-center bg-gradient-to-br from-green-950 to-green-700 text-white p-12"
    >
      <div class="max-w-md">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">⚡</span>
          </div>
          <h1 class="text-4xl font-bold">DevLens</h1>
        </div>

        <h2 class="text-4xl font-bold leading-tight">
          AI-Powered Repository Intelligence Platform
        </h2>

        <p class="mt-6 text-lg text-green-100">
          Analyze repositories, discover insights, measure code quality, and receive AI-powered
          recommendations.
        </p>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center justify-center p-8">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <router-view />
      </div>
    </div>
  </div>
</template>
