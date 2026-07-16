<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/axios';
import { usePasswordStrength } from '@/composables/usePasswordStrength';

const route = useRoute();
const router = useRouter();

const token = ref('');
const email = ref('');
const passwordConfirmation = ref('');
const isLoading = ref(false);
const isValidating = ref(true);
const tokenError = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { password, strength } = usePasswordStrength();

const confirmError = computed(() => {
  if (!passwordConfirmation.value) return '';
  if (password.value !== passwordConfirmation.value) return 'Passwords do not match';
  return '';
});

const isFormValid = computed(() => {
  return password.value
    && passwordConfirmation.value
    && strength.value.score >= 30
    && !confirmError.value;
});

onMounted(async () => {
  token.value = route.query.token ?? '';
  email.value = route.query.email ?? '';

  if (!token.value || !email.value) {
    tokenError.value = 'Invalid password reset link.';
    isValidating.value = false;
    return;
  }

  try {
    await api.post('/admin/auth/validate-reset-token', {
      token: token.value,
      email: email.value,
    });
  } catch (error) {
    tokenError.value = error.response?.data?.message ?? 'This password reset link is invalid or has expired.';
  } finally {
    isValidating.value = false;
  }
});

watch(password, () => {
  errorMessage.value = '';
});

async function handleSubmit() {
  errorMessage.value = '';
  successMessage.value = '';

  if (!isFormValid.value) return;

  isLoading.value = true;

  try {
    const { data } = await api.post('/admin/auth/reset-password', {
      token: token.value,
      email: email.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value,
    });
    successMessage.value = data.message;
    setTimeout(() => router.push({ name: 'admin-login' }), 2000);
  } catch (error) {
    const messages = error.response?.data;
    if (messages?.errors) {
      const firstError = Object.values(messages.errors).flat()[0];
      errorMessage.value = firstError ?? 'Please correct the errors below.';
    } else if (messages?.message) {
      errorMessage.value = messages.message;
    } else {
      errorMessage.value = 'Something went wrong. Please try again.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Poppins']">
    <div class="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-white/[0.03] -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
    <div class="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-white/[0.02] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

    <div class="w-full max-w-[560px] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slideUp">
      <div class="p-8 lg:p-12 xl:p-16 flex flex-col items-center text-center">

        <div v-if="isValidating" class="py-12">
          <svg class="animate-spin h-10 w-10 text-[#1e293b] mx-auto" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p class="mt-4 text-gray-400 text-sm">Validating your reset link...</p>
        </div>

        <template v-else-if="tokenError">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
          </div>
          <h1 class="text-[#0F172A] text-[28px] lg:text-[32px] font-bold leading-tight">Invalid Link</h1>
          <p class="text-gray-400 mt-3 text-base">{{ tokenError }}</p>
          <router-link to="/admin/forgot-password"
            class="mt-6 inline-flex items-center gap-2 h-[52px] px-8 bg-gradient-to-r from-[#1e293b] to-[#334155] rounded-[14px] text-white font-semibold text-[15px] shadow-[0_4px_20px_-4px_rgba(30,41,59,0.4)] hover:shadow-[0_8px_30px_-4px_rgba(30,41,59,0.5)] transition-all duration-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Request New Link
          </router-link>
        </template>

        <template v-else>
          <div class="w-16 h-16 bg-gradient-to-br from-[#1e293b] to-[#334155] rounded-full flex items-center justify-center shadow-lg mb-6">
            <svg class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <h1 class="text-[#0F172A] text-[28px] lg:text-[32px] font-bold leading-tight">Set New Password</h1>
          <p class="text-gray-400 mt-3 text-base max-w-[380px]">
            Choose a strong password for your admin account.
          </p>

          <div v-if="successMessage" class="mt-6 w-full p-4 bg-emerald-50 border border-emerald-200 rounded-[14px] text-sm text-emerald-700 font-medium text-center animate-fadeIn">
            <svg class="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            {{ successMessage }} Redirecting to admin login...
          </div>

          <div v-if="errorMessage" class="mt-6 w-full p-4 bg-red-50 border border-red-200 rounded-[14px] text-sm text-red-600 font-medium text-center animate-fadeIn">
            <svg class="w-5 h-5 inline-block mr-2 -mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
            </svg>
            {{ errorMessage }}
          </div>

          <form @submit.prevent="handleSubmit" class="mt-8 w-full space-y-5" novalidate>
            <div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13 2 4" />
                  </svg>
                </span>
                <input :value="email" type="email" readonly disabled
                  placeholder="Email address"
                  class="w-full h-[55px] pl-12 pr-4 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none bg-gray-50 text-[15px] cursor-not-allowed">
              </div>
            </div>

            <div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#1e293b] transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="New password"
                  class="w-full h-[55px] pl-12 pr-12 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#1e293b] focus:ring-4 focus:ring-[#1e293b]/10 bg-white text-[15px]">
                <button type="button" @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  :aria-label="showPassword ? 'Hide password' : 'Show password'">
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

              <div v-if="password" class="mt-3 animate-fadeIn">
                <div class="flex gap-1.5">
                  <div v-for="i in 4" :key="i"
                    class="h-1.5 flex-1 rounded-full transition-all duration-300"
                    :class="i * 25 <= strength.score ? strength.color : 'bg-gray-200'">
                  </div>
                </div>
                <p class="text-xs mt-1.5 font-medium" :class="strength.textColor">
                  {{ strength.label }}
                  <span class="text-gray-400 font-normal">- Use at least 8 characters with mixed case, numbers & symbols</span>
                </p>
              </div>
            </div>

            <div>
              <div class="relative group">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-[#1e293b] transition-colors duration-300">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input v-model="passwordConfirmation" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm new password"
                  class="w-full h-[55px] pl-12 pr-12 border border-gray-200 rounded-[14px] text-[#1E293B] placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#1e293b] focus:ring-4 focus:ring-[#1e293b]/10 bg-white text-[15px]"
                  :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500/10': confirmError }">
                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  :aria-label="showConfirmPassword ? 'Hide password' : 'Show password'">
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
              <p v-if="confirmError" class="mt-1.5 text-sm text-red-500 font-medium text-left animate-fadeIn">{{ confirmError }}</p>
            </div>

            <button type="submit" :disabled="isLoading || !isFormValid"
              class="w-full h-[52px] bg-gradient-to-r from-[#1e293b] to-[#334155] hover:from-[#334155] hover:to-[#475569] rounded-[14px] text-white font-semibold text-[15px] tracking-wide shadow-[0_4px_20px_-4px_rgba(30,41,59,0.4)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(30,41,59,0.5)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_10px_-4px_rgba(30,41,59,0.4)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_20px_-4px_rgba(30,41,59,0.4)] flex items-center justify-center gap-2">
              <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <template v-else>
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Reset Password</span>
              </template>
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-[#64748B]">
            <RouterLink to="/admin/login" class="font-semibold text-[#1e293b] hover:text-[#334155] transition-colors duration-300">Back to Sign In</RouterLink>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slideUp {
  animation: slideUp 0.6s ease-out;
}
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>
