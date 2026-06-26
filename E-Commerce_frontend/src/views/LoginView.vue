<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login } from '@/stores/auth';
import api from '@/api/axios';
import logoUrl from '@/assets/logo.png';

const router = useRouter();
const route = useRoute();
const errorMessage = ref('');

const showPassword = ref(false);

const form = reactive({
  email: '',
  password: '',
});

async function handleSubmit() {
  errorMessage.value = '';

  try {
    await login(form);
    const redirect = route.query.redirect ?? { name: 'home' };
    await router.push(redirect);
  } catch (error) {
    errorMessage.value = error.response?.data?.message ?? 'Unable to log in.';
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
  <section class="auth-page">
    <div class="auth-card">
      <div class="auth-card__logo">
        <img :src="logoUrl" alt="E-Commerce" class="auth-logo">
      </div>
      <p class="auth-card__eyebrow">Welcome back</p>
      <h1 class="auth-card__title">Sign in</h1>
      <p class="auth-card__desc">Open your cart and orders.</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <div class="auth-field">
          <label class="auth-label">Email</label>
          <input v-model="form.email" class="auth-input" type="email" placeholder="Email address" required>
        </div>
        <div class="auth-field">
          <label class="auth-label">Password</label>
          <div class="auth-input-wrap">
            <input v-model="form.password" class="auth-input" :type="showPassword ? 'text' : 'password'" placeholder="Password" required>
            <button type="button" class="auth-pwd-toggle" @click="showPassword = !showPassword" tabindex="-1" :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <svg v-if="showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        <button class="auth-btn" type="submit">Sign in</button>
      </form>

      <div class="auth-divider">
        <span class="auth-divider__line"></span>
        <span class="auth-divider__text">Or continue with</span>
        <span class="auth-divider__line"></span>
      </div>

      <div class="auth-social">
        <button type="button" class="auth-social__btn" @click="socialLogin('google')">
          <svg class="auth-social__icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </button>
        <button type="button" class="auth-social__btn" @click="socialLogin('facebook')">
          <svg class="auth-social__icon" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Facebook
        </button>
      </div>

      <p class="auth-card__footer">
        New here? <RouterLink to="/register" class="auth-link">Register</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 64px);
  padding: 32px 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 24px;
  padding: 40px 32px 32px;
  box-shadow: 0 2px 40px rgba(0, 0, 0, 0.06), 0 1px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid var(--line);
  text-align: center;
}

.auth-card__logo {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.auth-logo {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.auth-card__eyebrow {
  margin: 0 0 4px;
  font-size: 0.78rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #16a34a;
  font-weight: 600;
}

.auth-card__title {
  margin: 0 0 6px;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text);
}

.auth-card__desc {
  margin: 0 0 28px;
  color: var(--muted);
  font-size: 0.92rem;
}

.auth-form {
  display: grid;
  gap: 16px;
  text-align: left;
}

.auth-field {
  display: grid;
  gap: 5px;
}

.auth-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);
}

.auth-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  color: var(--text);
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.auth-input::placeholder {
  color: rgba(148, 163, 184, 0.72);
}

.auth-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.auth-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.auth-input-wrap .auth-input {
  padding-right: 44px;
}

.auth-pwd-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  transition: color 0.2s;
}

.auth-pwd-toggle:hover {
  color: #64748b;
}

.auth-error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  font-size: 0.88rem;
  text-align: center;
}

.auth-btn {
  width: 100%;
  padding: 14px;
  border: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.auth-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(22, 163, 74, 0.3);
}

.auth-btn:active {
  transform: translateY(0);
}

.auth-card__footer {
  margin: 24px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
}

.auth-link {
  color: #16a34a;
  font-weight: 600;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0 16px;
}

.auth-divider__line {
  flex: 1;
  height: 1px;
  background: var(--line);
}

.auth-divider__text {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--muted);
  white-space: nowrap;
}

.auth-social {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.auth-social__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #fff;
  color: var(--text);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
}

.auth-social__btn:hover {
  background: #f8fafc;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.auth-social__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>
