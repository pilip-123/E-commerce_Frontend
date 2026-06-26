<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { login } from '@/stores/auth';

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
  <section class="auth">
    <div class="auth__panel">
      <p class="eyebrow">Welcome back</p>
      <h1>Sign in</h1>
      <p class="muted">Open your cart and orders.</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <input v-model="form.email" class="input" type="email" placeholder="Email address" required>
        <input v-model="form.password" class="input" type="password" placeholder="Password" required>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <button class="button" type="submit">Sign in</button>
      </form>

      <p class="muted">
        New here? <RouterLink to="/register">Register</RouterLink>
      </p>
    </div>
  </section>
</template>
