<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login } from '@/stores/auth';
import logoUrl from '@/assets/logo.png';

const router = useRouter();
const route = useRoute();
const errorMessage = ref('');

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
          <input v-model="form.password" class="auth-input" type="password" placeholder="Password" required>
        </div>
        <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>
        <button class="auth-btn" type="submit">Sign in</button>
      </form>

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
</style>
