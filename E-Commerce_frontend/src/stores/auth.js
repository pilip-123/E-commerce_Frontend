import { reactive } from 'vue';
import api from '@/api/axios';

function restoreUser() {
  try {
    return JSON.parse(localStorage.getItem('ecommerce_user'));
  } catch {
    return null;
  }
}

const state = reactive({
  user: restoreUser(),
  token: localStorage.getItem('ecommerce_token') ?? '',
  ready: false,
});

export function useAuth() {
  return state;
}

export function persistAuth(token, user) {
  state.token = token;
  state.user = user;
  state.ready = true;
  localStorage.setItem('ecommerce_token', token);
  localStorage.setItem('ecommerce_user', JSON.stringify(user));
}

export function clearAuth() {
  state.user = null;
  state.token = '';
  state.ready = true;
  localStorage.removeItem('ecommerce_token');
  localStorage.removeItem('ecommerce_user');
}

export async function fetchCurrentUser() {
  if (!state.token) {
    state.ready = true;
    return null;
  }

  try {
    const { data } = await api.get('/auth/me');
    state.user = data.user;
    localStorage.setItem('ecommerce_user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    clearAuth();
    throw error;
  } finally {
    state.ready = true;
  }
}

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials);
  persistAuth(data.token, data.user);
  state.ready = true;
  return data;
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload);
  persistAuth(data.token, data.user);
  state.ready = true;
  return data;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    // Clear local state even if the server already invalidated the token.
  } finally {
    clearAuth();
  }
}

export async function forgotPassword(email, role) {
  const endpoint = role === 'admin' ? '/admin/auth/forgot-password' : '/auth/forgot-password';
  const { data } = await api.post(endpoint, { email, ...(role ? { role } : {}) });
  return data;
}

export async function resetPassword(payload, role) {
  const endpoint = role === 'admin' ? '/admin/auth/reset-password' : '/auth/reset-password';
  const { data } = await api.post(endpoint, payload);
  return data;
}
