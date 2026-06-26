<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/stores/auth';

const router = useRouter();
const errorMessage = ref('');

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  password_confirmation: '',
});

async function handleSubmit() {
  errorMessage.value = '';

  try {
    await register(form);
    await router.push({ name: 'home' });
  } catch (error) {
    errorMessage.value = error.response?.data?.message ?? 'Unable to register.';
  }
}
</script>

<template>
  <section class="auth">
    <div class="auth__panel">
      <p class="eyebrow">Create account</p>
      <h1>Register</h1>
      <p class="muted">Customer access is created automatically.</p>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <input v-model="form.name" class="input" type="text" placeholder="Full name" required>
        <input v-model="form.email" class="input" type="email" placeholder="Email address" required>
        <input v-model="form.phone" class="input" type="text" placeholder="Phone number">
        <textarea v-model="form.address" class="textarea" rows="3" placeholder="Address"></textarea>
        <input v-model="form.password" class="input" type="password" placeholder="Password" required>
        <input v-model="form.password_confirmation" class="input" type="password" placeholder="Confirm password" required>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <button class="button" type="submit">Create account</button>
      </form>

      <p class="muted">
        Already have an account? <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </div>
  </section>
</template>
