<script setup>
import { ref } from 'vue'
import Navbar from '@/components/navbar/Navbar.vue'
import Sidebar from '@/components/sidebar/Sidebar.vue'

const sidebarOpen = ref(true)
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <Sidebar
      :open="sidebarOpen"
      @update:open="sidebarOpen = $event"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="flex-1 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>
