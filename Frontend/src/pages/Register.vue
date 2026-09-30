<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Mail,
  Lock,
  User,
  EyeOff,
  Eye,
  Code2,
  ArrowRight,
  Check,
} from '@lucide/vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const agreeToTerms = ref(false)
const error = ref('')
const isLoading = ref(false)

const validateForm = () => {
  if (!formData.value.name.trim()) {
    return 'Name is required'
  }

  if (!formData.value.email.includes('@')) {
    return 'Valid email is required'
  }

  if (formData.value.password.length < 6) {
    return 'Password must be at least 6 characters'
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    return 'Passwords do not match'
  }

  if (!agreeToTerms.value) {
    return 'Please agree to the Terms and Conditions'
  }

  return ''
}

const handleSubmit = async () => {
  error.value = validateForm()

  if (error.value) return

  isLoading.value = true

  try {
    await authStore.register(
      formData.value.name,
      formData.value.email,
      formData.value.password
    )

    await router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Failed to create account'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div
    class="fixed inset-0 z-[100] min-h-screen overflow-y-auto bg-[#050b09] text-white"
  >

    <!-- Background glow -->
    <div
      class="fixed inset-0 pointer-events-none overflow-hidden"
    >
      <div
        class="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[140px]"
      ></div>

      <div
        class="absolute -bottom-40 left-0 w-[500px] h-[500px] rounded-full bg-green-500/10 blur-[140px]"
      ></div>

      <div
        class="absolute top-1/3 right-0 w-[350px] h-[350px] rounded-full bg-green-400/5 blur-[120px]"
      ></div>
    </div>


    <!-- Main layout -->
    <div
      class="relative min-h-screen grid lg:grid-cols-2"
    >

      <!-- ===================================== -->
      <!-- LEFT SIDE -->
      <!-- ===================================== -->

      <div
        class="hidden lg:flex relative items-center justify-center px-16 xl:px-24"
      >

        <!-- Grid background -->
        <div
          class="absolute inset-0 opacity-30 pointer-events-none"
          style="
            background-image:
              linear-gradient(rgba(74, 222, 128, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 222, 128, 0.08) 1px, transparent 1px);
            background-size: 140px 140px;
          "
        ></div>

        <div
          class="relative z-10 max-w-xl"
        >

          <!-- Logo -->
          <div
            class="flex items-center gap-4 mb-10"
          >

            <div
              class="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.25)]"
            >
              <Code2
                class="w-7 h-7 text-black"
              />
            </div>

            <span
              class="text-4xl font-bold tracking-tight"
            >
              Dev<span class="text-green-400">Lens</span>
            </span>

          </div>


          <!-- Heading -->
          <h1
            class="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight"
          >
            <span class="text-green-400">
              AI-Powered
            </span>

            <span class="block">
              Repository
            </span>

            <span class="block">
              Intelligence Platform
            </span>
          </h1>


          <!-- Description -->
          <p
            class="mt-8 max-w-lg text-lg xl:text-xl leading-8 text-gray-400"
          >
            Analyze repositories, discover insights, measure
            code quality, and receive AI-powered
            recommendations.
          </p>


          <!-- Feature highlights -->
          <div
            class="flex flex-wrap items-center gap-x-5 gap-y-3 mt-10"
          >

            <div
              class="flex items-center gap-2 text-gray-300 text-sm"
            >
              <span
                class="w-2.5 h-2.5 rounded-full bg-green-400"
              ></span>

              Repository Analysis
            </div>


            <div
              class="hidden sm:block w-px h-4 bg-gray-700"
            ></div>


            <div
              class="flex items-center gap-2 text-gray-300 text-sm"
            >
              <span
                class="w-2.5 h-2.5 rounded-full bg-green-400"
              ></span>

              Contributor Insights
            </div>


            <div
              class="hidden sm:block w-px h-4 bg-gray-700"
            ></div>


            <div
              class="flex items-center gap-2 text-gray-300 text-sm"
            >
              <span
                class="w-2.5 h-2.5 rounded-full bg-green-400"
              ></span>

              AI Recommendations
            </div>

          </div>

        </div>

      </div>


      <!-- ===================================== -->
      <!-- RIGHT SIDE -->
      <!-- ===================================== -->

      <div
        class="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20"
      >

        <div
          class="w-full max-w-xl"
        >

          <!-- Form card -->
          <div
            class="rounded-2xl border border-green-500/60 bg-[#07110d]/95 p-7 sm:p-9 shadow-[0_0_50px_rgba(34,197,94,0.08)]"
          >

            <!-- Heading -->
            <div class="mb-7">

              <h2
                class="text-3xl font-bold tracking-tight"
              >
                Create
                <span class="text-green-400">
                  Account
                </span>
              </h2>

              <p
                class="mt-2 text-gray-400"
              >
                Join DevLens and start analyzing repositories
              </p>

            </div>


            <!-- Error -->
            <div
              v-if="error || authStore.error"
              class="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
            >
              <p
                class="text-sm text-red-400"
              >
                {{ error || authStore.error }}
              </p>
            </div>


            <!-- Form -->
            <form
              @submit.prevent="handleSubmit"
              class="space-y-5"
            >

              <!-- Full Name -->
              <div>

                <label
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Full Name
                </label>

                <div class="relative">

                  <User
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  />

                  <input
                    v-model="formData.name"
                    type="text"
                    placeholder="Enter your full name"
                    class="w-full h-12 rounded-lg border border-white/15 bg-[#08100d] pl-12 pr-4 text-white placeholder-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />

                </div>

              </div>


              <!-- Email -->
              <div>

                <label
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Email Address
                </label>

                <div class="relative">

                  <Mail
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  />

                  <input
                    v-model="formData.email"
                    type="email"
                    placeholder="you@example.com"
                    class="w-full h-12 rounded-lg border border-white/15 bg-[#08100d] pl-12 pr-4 text-white placeholder-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />

                </div>

              </div>


              <!-- Password -->
              <div>

                <label
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Password
                </label>

                <div class="relative">

                  <Lock
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  />

                  <input
                    v-model="formData.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Create a password"
                    class="w-full h-12 rounded-lg border border-white/15 bg-[#08100d] pl-12 pr-12 text-white placeholder-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />

                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    <Eye
                      v-if="!showPassword"
                      class="w-5 h-5"
                    />

                    <EyeOff
                      v-else
                      class="w-5 h-5"
                    />
                  </button>

                </div>

              </div>


              <!-- Confirm Password -->
              <div>

                <label
                  class="block text-sm font-medium text-gray-200 mb-2"
                >
                  Confirm Password
                </label>

                <div class="relative">

                  <Lock
                    class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  />

                  <input
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="Confirm your password"
                    class="w-full h-12 rounded-lg border border-white/15 bg-[#08100d] pl-12 pr-12 text-white placeholder-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                  />

                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    <Eye
                      v-if="!showConfirmPassword"
                      class="w-5 h-5"
                    />

                    <EyeOff
                      v-else
                      class="w-5 h-5"
                    />
                  </button>

                </div>

              </div>


              <!-- Terms -->
              <label
                class="flex items-start gap-3 cursor-pointer select-none"
              >

                <input
                  v-model="agreeToTerms"
                  type="checkbox"
                  class="mt-1 w-4 h-4 rounded border-gray-600 bg-transparent text-green-400 focus:ring-green-400"
                />

                <span
                  class="text-sm text-gray-400 leading-5"
                >
                  I agree to the
                  <span class="text-green-400">
                    Terms and Conditions
                  </span>
                </span>

              </label>


              <!-- Create Account -->
              <button
                type="submit"
                :disabled="isLoading"
                class="w-full h-12 rounded-lg bg-green-400 text-black font-semibold flex items-center justify-center gap-2 transition hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >

                <span>
                  {{
                    isLoading
                      ? 'Creating Account...'
                      : 'Create Account'
                  }}
                </span>

                <ArrowRight
                  v-if="!isLoading"
                  class="w-5 h-5"
                />

              </button>


              <!-- Divider -->
              <div
                class="flex items-center gap-4 py-1"
              >

                <div
                  class="flex-1 h-px bg-white/10"
                ></div>

                <span
                  class="text-sm text-gray-500"
                >
                  OR
                </span>

                <div
                  class="flex-1 h-px bg-white/10"
                ></div>

              </div>


              <!-- GitHub -->
              <button
                type="button"
                class="w-full h-12 rounded-lg border border-white/15 bg-transparent text-gray-200 font-medium hover:bg-white/5 transition flex items-center justify-center gap-3"
              >

                <Code2 class="w-5 h-5" />

                Continue with GitHub

              </button>

            </form>


            <!-- Login -->
            <p
              class="text-center text-sm text-gray-500 mt-7"
            >
              Already have an account?

              <button
                type="button"
                @click="goToLogin"
                class="ml-1 text-green-400 hover:text-green-300 font-medium transition"
              >
                Login here
              </button>

            </p>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>