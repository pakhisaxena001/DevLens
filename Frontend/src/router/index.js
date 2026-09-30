import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Pages
import Landing from '../pages/Landing.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Analyze from '../pages/Analyze.vue'
import Repository from '../pages/Repository.vue'
import AIInsights from '../pages/AIInsights.vue'
import History from '../pages/History.vue'
import Bookmarks from '../pages/Bookmarks.vue'
import Compare from '../pages/Compare.vue'
import Profile from '../pages/Profile.vue'

// Layouts
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'

const routes = [
  {
    path: '/',
    component: Landing,
    meta: { layout: 'none' }
  },
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        component: Login,
        meta: { layout: 'auth' }
      },
      {
        path: 'register',
        component: Register,
        meta: { layout: 'auth' }
      }
    ]
  },
  {
    path: '/login',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Login,
        meta: { layout: 'auth' }
      }
    ]
  },
  {
    path: '/register',
    component: AuthLayout,
    children: [
      {
        path: '',
        component: Register,
        meta: { layout: 'auth' }
      }
    ]
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Dashboard,
      }
    ]
  },
  {
    path: '/analyze',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Analyze,
      }
    ]
  },
  {
    path: '/repository',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Repository,
      }
    ]
  },
  {
    path: '/ai-insights',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: AIInsights,
      }
    ]
  },
  {
    path: '/history',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: History,
      }
    ]
  },
  {
    path: '/bookmarks',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Bookmarks,
      }
    ]
  },
  {
    path: '/compare',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Compare,
      }
    ]
  },
  {
    path: '/profile',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Profile,
      }
    ]
  },
  {
    path: '/settings',
    component: DashboardLayout,
    meta: { requiresAuth: true, layout: 'dashboard' },
    children: [
      {
        path: '',
        component: Profile,
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation Guards
router.beforeEach((to, from) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated) {
      return true
    } else {
      return '/login'
    }
  } else if ((to.path === '/login' || to.path === '/register') && authStore.isAuthenticated) {
    return '/dashboard'
  }
  return true
})

export default router
