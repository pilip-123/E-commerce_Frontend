import { reactive, watch } from 'vue';
import api from '@/api/axios';
import { useAuth } from '@/stores/auth';

const state = reactive({
  notifications: [],
  unreadCount: 0,
  loading: false,
});

let pollTimer = null;

export function useNotifications() {
  return state;
}

export async function fetchNotifications() {
  const auth = useAuth();
  if (!auth.token) return;

  state.loading = true;
  try {
    const { data } = await api.get('/notifications');
    state.notifications = data.notifications ?? [];
    state.unreadCount = data.unread_count ?? 0;
  } catch {
  } finally {
    state.loading = false;
  }
}

export async function markAsRead(id) {
  try {
    await api.post(`/notifications/${id}/read`);
    const notification = state.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read_at = new Date().toISOString();
    }
    state.unreadCount = Math.max(0, state.unreadCount - 1);
  } catch {
  }
}

export async function markAllAsRead() {
  try {
    await api.post('/notifications/read-all');
    state.notifications.forEach((n) => {
      n.read_at = new Date().toISOString();
    });
    state.unreadCount = 0;
  } catch {
  }
}

export function startPolling(interval = 30000) {
  stopPolling();
  fetchNotifications();
  pollTimer = setInterval(fetchNotifications, interval);
}

export function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}
