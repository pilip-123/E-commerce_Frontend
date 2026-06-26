import { reactive } from 'vue';
import api from '@/api/axios';

const state = reactive({
  user: null,
  token: localStorage.getItem('ecommerce_token') ?? '',
  ready: false,
});

export function useAuth() {
  return state;
}

function persistAuth(token, user) {
  state.token = token;
  state.user = user;
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
