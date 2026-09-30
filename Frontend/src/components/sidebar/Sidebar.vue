<script setup>
import { useRouter, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  BarChart3,
  MessageSquare,
  Bookmark,
  GitCompare,
  Clock,
  Settings,
  Menu,
} from '@lucide/vue'

defineProps({
  open: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:open'])

const router = useRouter()
const route = useRoute()

const menuItems = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Analyze',
    path: '/analyze',
    icon: BarChart3,
  },
  {
    name: 'Repository',
    path: '/repository',
    icon: MessageSquare,
  },
  {
    name: 'Bookmarks',
    path: '/bookmarks',
    icon: Bookmark,
  },
  {
    name: 'Compare',
    path: '/compare',
    icon: GitCompare,
  },
  {
    name: 'History',
    path: '/history',
    icon: Clock,
  },
]

const isActive = (path) => {
  return (
    route.path === path ||
    route.path.startsWith(`${path}/`)
  )
}

const navigate = (path) => {
  router.push(path)
}
</script>

<template>
  <aside
    :class="[
      'relative flex flex-col shrink-0',
      'h-screen bg-gray-900 text-white',
      'transition-all duration-300 ease-in-out',
      open ? 'w-64' : 'w-20',
    ]"
  >
    <!-- ========================================= -->
    <!-- LOGO / COLLAPSE -->
    <!-- ========================================= -->

    <div
      class="h-18 flex items-center border-b border-gray-800 shrink-0"
      :class="
        open
          ? 'px-5 justify-between'
          : 'px-4 justify-center'
      "
    >
      <!-- Logo -->
      <button
        type="button"
        class="flex items-center gap-3 focus:outline-none"
        :class="!open ? 'cursor-pointer' : 'cursor-default'"
        @click="!open && emit('update:open', true)"
        :aria-label="
          open
            ? 'DevLens'
            : 'Expand sidebar'
        "
      >
        <div
          class="w-8 h-8 rounded-lg border border-green-400/60 bg-green-500/10 flex items-center justify-center shrink-0"
        >
          <span class="text-green-400 font-bold text-sm">
            &lt;/&gt;
          </span>
        </div>

        <span
          v-if="open"
          class="font-bold text-lg whitespace-nowrap"
        >
          DevLens
        </span>
      </button>

      <!-- Collapse button -->
      <button
        v-if="open"
        type="button"
        @click="emit('update:open', false)"
        class="w-9 h-9 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
        aria-label="Collapse sidebar"
      >
        <Menu class="w-5 h-5" />
      </button>
    </div>

    <!-- ========================================= -->
    <!-- MAIN NAVIGATION -->
    <!-- ========================================= -->

    <nav
      class="flex-1 px-3 py-5 space-y-2 overflow-y-auto"
    >
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        :title="!open ? item.name : undefined"
        :class="[
          'flex items-center rounded-lg transition-all duration-200',
          'h-11',
          open
            ? 'gap-3 px-4'
            : 'justify-center px-2',
          isActive(item.path)
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <component
          :is="item.icon"
          class="w-5 h-5 shrink-0"
        />

        <span
          v-if="open"
          class="font-medium text-sm whitespace-nowrap"
        >
          {{ item.name }}
        </span>
      </router-link>
    </nav>

    <!-- ========================================= -->
    <!-- SETTINGS -->
    <!-- ========================================= -->

    <div
      class="px-3 pb-4 pt-3 border-t border-gray-800 shrink-0"
    >
      <router-link
        to="/settings"
        :title="!open ? 'Settings' : undefined"
        :class="[
          'flex items-center rounded-lg transition-all duration-200',
          'h-11',
          open
            ? 'gap-3 px-4'
            : 'justify-center px-2',
          isActive('/settings')
            ? 'bg-green-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white',
        ]"
      >
        <Settings
          class="w-5 h-5 shrink-0"
        />

        <span
          v-if="open"
          class="font-medium text-sm whitespace-nowrap"
        >
          Settings
        </span>
      </router-link>
    </div>
  </aside>
</template>