<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/stores/auth';
import api from '@/api/axios';
import logoUrl from '@/assets/logo.png';
import { useLocale } from '@/composables/useLocale';

const router = useRouter();
const errorMessage = ref('');
const isLoading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
});

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
});

const { t } = useLocale();

function validateForm() {
  let valid = true;
  errors.first_name = '';
  errors.last_name = '';
  errors.email = '';
  errors.phone = '';
  errors.password = '';
  errors.password_confirmation = '';

  if (!form.first_name) {
    errors.first_name = 'First name is required';
    valid = false;
  }

  if (!form.last_name) {
    errors.last_name = 'Last name is required';
    valid = false;
  }

  if (!form.email) {
    errors.email = 'Email is required';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email';
    valid = false;
  }

  if (!form.password) {
    errors.password = 'Password is required';
    valid = false;
  } else if (form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
    valid = false;
  }

  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match';
    valid = false;
  }

  return valid;
}

async function handleSubmit() {
  errorMessage.value = '';
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    await register({ ...form, name: form.first_name + ' ' + form.last_name });
    await router.push({ name: 'home' });
  } catch (error) {
    errorMessage.value = error.response?.data?.message ?? 'Unable to register.';
  } finally {
    isLoading.value = false;
  }
}

async function socialLogin(provider) {
  try {
    const { data } = await api.get('/auth/' + provider + '/redirect');
    window.location.href = data.url;
  } catch (e) {
    errorMessage.value = 'Unable to initiate ' + provider + ' login.';
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Poppins']">
    <!-- Decorative circles -->
    <div class="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-white/10 -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
    <div class="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-white/[0.07] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
    <div class="fixed top-1/3 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.05] translate-x-1/2 pointer-events-none"></div>
    <div class="fixed bottom-1/4 left-0 w-[250px] h-[250px] rounded-full bg-white/[0.06] -translate-x-1/2 pointer-events-none"></div>

    <!-- Main card -->
    <div class="w-full max-w-[1200px] bg-white rounded-[20px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-slideUp">
      <!-- Left Column -->
      <div class="relative bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] p-8 lg:p-12 xl:p-16 flex flex-col min-h-[500px] lg:min-h-[700px]">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <img :src="logoUrl" alt="Logo" class="h-20 w-20 rounded-full object-cover border-[4px] border-white shadow-lg">
        </div>

        <!-- Illustration -->
        <div class="flex-1 flex items-center justify-center py-6">
          <svg viewBox="0 0 400 400" class="w-full max-w-[320px] h-auto">
            <defs>
              <linearGradient id="greenGradR" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#22c55e" />
                <stop offset="100%" stop-color="#16a34a" />
              </linearGradient>
              <linearGradient id="shieldGradR" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#22c55e" />
                <stop offset="100%" stop-color="#15803d" />
              </linearGradient>
            </defs>
            <circle cx="200" cy="200" r="170" fill="url(#greenGradR)" opacity="0.08" />
            <circle cx="200" cy="200" r="130" fill="url(#greenGradR)" opacity="0.12" />
            <circle cx="200" cy="200" r="90" fill="url(#greenGradR)" opacity="0.15" />
            <path d="M200 85 L290 130 L290 215 C290 280 200 335 200 335 C200 335 110 280 110 215 L110 130 Z"
              fill="url(#shieldGradR)" opacity="0.9" />
            <rect x="170" y="200" width="60" height="40" rx="6" fill="white" opacity="0.95" />
            <path d="M180 200 V185 C180 172 188 165 200 165 C212 165 220 172 220 185 V200"
              fill="none" stroke="white" stroke-width="5" stroke-linecap="round" opacity="0.95" />
            <circle cx="200" cy="218" r="7" fill="#22c55e" />
            <path d="M200 225 V233" stroke="#22c55e" stroke-width="3" stroke-linecap="round" />
            <circle cx="130" cy="140" r="8" fill="#22c55e" opacity="0.3" />
            <circle cx="280" cy="125" r="5" fill="#22c55e" opacity="0.4" />
            <circle cx="145" cy="310" r="6" fill="#22c55e" opacity="0.25" />
            <circle cx="270" cy="290" r="10" fill="#22c55e" opacity="0.2" />
            <circle cx="100" cy="220" r="4" fill="#22c55e" opacity="0.2" />
            <circle cx="300" cy="240" r="6" fill="#22c55e" opacity="0.15" />
            <circle cx="310" cy="100" r="20" fill="#22c55e" opacity="0.9" />
            <path d="M302 100 L308 108 L320 93" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <!-- Copyright -->
        <div class="flex-shrink-0 text-center lg:text-left">
          <p class="text-sm text-gray-400">&copy; 2026 E-Commerce. {{ t('footer.rights') }}</p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="p-8 lg:p-12 xl:p-16 flex flex-col justify-center overflow-y-auto">
        <!-- Heading -->
        <h1 class="text-[#0F172A] text-[36px] lg:text-[44px] font-bold leading-tight">{{ t('auth.register_btn') }}</h1>
        <p class="text-gray-400 mt-2 text-lg">{{ t('home.subtitle') }}</p>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="mt-8 space-y-4" novalidate>
          <!-- First & Last Name -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input v-model="form.first_name" type="text" placeholder="First Name *"
                  class="w-full h-[50px] pl-12 pr-4 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 bg-white text-[15px]"
                  @input="errors.first_name = ''">
              </div>
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-500 font-medium">{{ errors.first_name }}</p>
            </div>
            <div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input v-model="form.last_name" type="text" placeholder="Last Name *"
                  class="w-full h-[50px] pl-12 pr-4 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 bg-white text-[15px]"
                  @input="errors.last_name = ''">
              </div>
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-500 font-medium">{{ errors.last_name }}</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
              </span>
              <input v-model="form.email" type="email" :placeholder="t('auth.email')"
                class="w-full h-[50px] pl-12 pr-4 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 bg-white text-[15px]"
                @input="errors.email = ''">
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-500 font-medium">{{ errors.email }}</p>
          </div>

          <!-- Phone -->
          <div>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <input v-model="form.phone" type="text" placeholder="Phone"
                class="w-full h-[50px] pl-12 pr-4 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 bg-white text-[15px]"
                @input="errors.phone = ''">
            </div>
            <p v-if="errors.phone" class="mt-1 text-sm text-red-500 font-medium">{{ errors.phone }}</p>
          </div>

          <!-- Password -->
          <div>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" :placeholder="t('auth.password')"
                class="w-full h-[50px] pl-12 pr-12 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 bg-white text-[15px]"
                @input="errors.password = ''">
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                :aria-label="showPassword ? t('general.cancel') : t('general.view')">
                <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-red-500 font-medium">{{ errors.password }}</p>
          </div>

          <!-- Confirm Password -->
          <div>
            <div class="relative group">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#22c55e] transition-colors duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input v-model="form.password_confirmation" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm password"
                class="w-full h-[50px] pl-12 pr-12 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#22c55e] focus:ring-4 focus:ring-[#22c55e]/10 bg-white text-[15px]">
              <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                :aria-label="showConfirmPassword ? t('general.cancel') : t('general.view')">
                <svg v-if="showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
                <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <p v-if="errors.password_confirmation" class="mt-1 text-sm text-red-500 font-medium">{{ errors.password_confirmation }}</p>
          </div>

          <!-- Global error -->
          <p v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-[10px] text-sm text-red-600 font-medium text-center">{{ errorMessage }}</p>

          <!-- Submit -->
          <button type="submit" :disabled="isLoading"
            class="w-full h-[52px] bg-gradient-to-r from-[#22c55e] to-[#16a34a] hover:from-[#16a34a] hover:to-[#15803d] rounded-[14px] text-white font-semibold text-[15px] tracking-wide shadow-[0_4px_20px_-4px_rgba(34,197,94,0.4)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_10px_-4px_rgba(34,197,94,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_20px_-4px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2">
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <template v-else>
              <span>{{ t('auth.register_btn') }}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </template>
          </button>
        </form>

        <!-- Social login -->
        <div class="mt-6 flex items-center gap-3">
          <span class="flex-1 h-px bg-gray-200"></span>
          <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">or</span>
          <span class="flex-1 h-px bg-gray-200"></span>
        </div>
        <div class="mt-4 grid grid-cols-2 gap-3">
          <button type="button" @click="socialLogin('google')"
            class="flex items-center justify-center gap-3 h-[50px] border border-gray-200 rounded-[14px] text-sm font-semibold text-[#1E293B] bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
          <button type="button" @click="socialLogin('github')"
            class="flex items-center justify-center gap-3 h-[50px] border border-gray-200 rounded-[14px] text-sm font-semibold text-[#1E293B] bg-white hover:bg-gray-50 hover:shadow-md transition-all duration-300">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1B1F23">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

        <!-- Login link -->
        <p class="mt-6 text-center text-sm text-[#64748B]">
          {{ t('auth.has_account') }}
          <RouterLink to="/login" class="font-semibold text-[#22c55e] hover:text-[#16a34a] transition-colors duration-300">{{ t('auth.login_btn') }}</RouterLink>
        </p>

        <!-- Bottom links -->
        <div class="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-400">
          <a href="#" class="hover:text-gray-600 transition-colors duration-300">Terms</a>
          <span class="text-gray-300">|</span>
          <a href="#" class="hover:text-gray-600 transition-colors duration-300">Privacy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideUp {
  animation: slideUp 0.6s ease-out;
}
</style>
