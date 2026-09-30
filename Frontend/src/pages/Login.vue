<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Code2,
  ArrowRight,
} from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  email: '',
  password: '',
})

const rememberMe = ref(false)
const showPassword = ref(false)
const error = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  error.value = ''

  if (!formData.value.email || !formData.value.password) {
    error.value = 'Email and password are required'
    return
  }

  isLoading.value = true

  try {
    await authStore.login(
      formData.value.email,
      formData.value.password
    )

    await router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}

const forgotPassword = () => {
  // Keep this ready for the forgot-password flow.
  router.push('/login')
}
</script>

<template>
  <div
    class="fixed inset-0 z-[100] min-h-screen overflow-y-auto bg-[#050b09] text-white"
  >

    <!-- ========================================= -->
    <!-- BACKGROUND GLOW -->
    <!-- ========================================= -->

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


    <!-- ========================================= -->
    <!-- MAIN LAYOUT -->
    <!-- ========================================= -->

    <div
      class="relative min-h-screen grid lg:grid-cols-2"
    >

      <!-- ======================================= -->
      <!-- LEFT SIDE -->
      <!-- ======================================= -->

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


          <!-- Main heading -->
          <h1
            class="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight"
          >

            <span class="text-green-400">
              AI-Powered
            </span>

            <span class="text-white">
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

        </div>

      </div>


      <!-- ======================================= -->
      <!-- RIGHT SIDE -->
      <!-- ======================================= -->

      <div
        class="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20"
      >

        <div
          class="w-full max-w-xl"
        >

          <!-- Outer glowing card -->
          <div
            class="rounded-2xl border border-green-500/70 bg-[#07110d]/95 p-7 sm:p-9 shadow-[0_0_60px_rgba(34,197,94,0.12)]"
          >

            <!-- Inner card -->
            <div
              class="rounded-xl border border-green-500/10 bg-[#07100d]/60 p-1"
            >

              <div
                class="p-5 sm:p-7"
              >

                <!-- Heading -->
                <div
                  class="mb-8"
                >

                  <h2
                    class="text-3xl font-bold tracking-tight"
                  >
                    Welcome back!
                  </h2>

                  <p
                    class="mt-2 text-gray-400"
                  >
                    Login to continue analyzing and managing
                    repositories
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

                  <!-- Email -->
                  <div>

                    <label
                      class="block text-sm font-medium text-gray-200 mb-2"
                    >
                      Email Address
                    </label>

                    <div
                      class="relative"
                    >

                      <Mail
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                      />

                      <input
                        v-model="formData.email"
                        type="email"
                        autocomplete="email"
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

                    <div
                      class="relative"
                    >

                      <Lock
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                      />

                      <input
                        v-model="formData.password"
                        :type="showPassword ? 'text' : 'password'"
                        autocomplete="current-password"
                        placeholder="••••••••"
                        class="w-full h-12 rounded-lg border border-white/15 bg-[#08100d] pl-12 pr-12 text-white placeholder-gray-600 outline-none transition focus:border-green-400 focus:ring-1 focus:ring-green-400"
                      />

                      <button
                        type="button"
                        @click="showPassword = !showPassword"
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        aria-label="Toggle password visibility"
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


                  <!-- Remember + Forgot -->
                  <div
                    class="flex items-center justify-between"
                  >

                    <label
                      class="flex items-center gap-3 cursor-pointer select-none"
                    >

                      <input
                        v-model="rememberMe"
                        type="checkbox"
                        class="w-4 h-4 rounded border-gray-600 bg-transparent text-green-400 focus:ring-green-400"
                      />

                      <span
                        class="text-sm text-gray-400"
                      >
                        Remember me
                      </span>

                    </label>


                    <button
                      type="button"
                      @click="forgotPassword"
                      class="text-sm text-green-400 hover:text-green-300 transition"
                    >
                      Forgot password?
                    </button>

                  </div>


                  <!-- Login button -->
                  <button
                    type="submit"
                    :disabled="isLoading"
                    class="w-full h-12 rounded-lg bg-green-400 text-black font-semibold flex items-center justify-center gap-2 transition hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >

                    <span>
                      {{
                        isLoading
                          ? 'Logging in...'
                          : 'Login'
                      }}
                    </span>

                    <ArrowRight
                      v-if="!isLoading"
                      class="w-5 h-5"
                    />

                  </button>


                  <!-- Divider -->
                  <div
                    class="flex items-center gap-4 py-2"
                  >

                    <div
                      class="flex-1 h-px bg-white/10"
                    ></div>

                    <span
                      class="text-sm text-gray-500 whitespace-nowrap"
                    >
                      Or continue with
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

                    <!-- GitHub icon -->
                    <svg
                      class="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.544 2.914 1.186.092-.923.35-1.544.637-1.9-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.137 18.191 20 14.435 20 10.017 20 4.484 15.522 0 10 0z"
                        clip-rule="evenodd"
                      />
                    </svg>

                    Continue with GitHub

                  </button>

                </form>


                <!-- Register -->
                <p
                  class="text-center text-sm text-gray-500 mt-7"
                >

                  Don't have an account?

                  <button
                    type="button"
                    @click="goToRegister"
                    class="ml-1 text-green-400 hover:text-green-300 font-medium transition"
                  >
                    Register here
                  </button>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
</template>