<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(async () => {
  // Restore session if available
  await authStore.restoreSession()
})
</script>

<template>
  <router-view />
</template>
