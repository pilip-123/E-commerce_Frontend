<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useNotifications, fetchNotifications, markAsRead, markAllAsRead, startPolling, stopPolling } from '@/stores/notification';

const notifications = useNotifications();
const showDropdown = ref(false);
const dropdownRef = ref(null);
const animatingId = ref(null);

const sorted = computed(() => {
  return [...notifications.notifications].sort((a, b) => {
    if (!a.read_at && b.read_at) return -1;
    if (a.read_at && !b.read_at) return 1;
    return 0;
  });
});

function toggle() {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value) fetchNotifications();
}

function onMark(id) {
  animatingId.value = id;
  setTimeout(() => { animatingId.value = null; }, 300);
  markAsRead(id);
}

function onMarkAll() {
  markAllAsRead();
}

function onClickOutside(e) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
    showDropdown.value = false;
  }
}

function iconSvg(type) {
  const i = (type ?? '').toLowerCase();
  if (i.includes('star')) {
    return '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>';
  }
  if (i.includes('box') || i.includes('seam')) {
    return '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>';
  }
  if (i.includes('person') || i.includes('user')) {
    return '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>';
  }
  if (i.includes('receipt') || i.includes('cart') || i.includes('order')) {
    return '<path d="M4 2h16v20l-4-2-4 2-4-2-4 2V2z"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/>';
  }
  if (i.includes('megaphone') || i.includes('announce') || i.includes('announcement')) {
    return '<path d="M21 6v12"/><path d="M16 7v10a1 1 0 0 0 1 1h4V6h-4a1 1 0 0 0-1 1z"/><path d="M5 8h6l4-2v12l-4-2H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z"/>';
  }
  if (i.includes('percent') || i.includes('tag') || i.includes('promo')) {
    return '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9h.01"/><path d="M15 15h.01"/>';
  }
  return '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>';
}

onMounted(() => {
  startPolling();
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  stopPolling();
  document.removeEventListener('click', onClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="notif" :class="{ 'notif--open': showDropdown }">
    <button class="notif__btn" type="button" @click="toggle" :title="notifications.unreadCount > 0 ? notifications.unreadCount + ' unread' : 'Notifications'">
      <svg class="notif__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="notifications.unreadCount" class="notif__badge">{{ notifications.unreadCount > 99 ? '99+' : notifications.unreadCount }}</span>
    </button>

    <Transition name="drop">
      <div v-if="showDropdown" class="notif__drop">
        <div class="notif__head">
          <div>
            <span class="notif__head-title">Notifications</span>
            <span v-if="notifications.unreadCount" class="notif__head-count">{{ notifications.unreadCount }} new</span>
          </div>
          <button v-if="notifications.unreadCount" class="notif__mark-all" type="button" @click="onMarkAll" title="Mark all as read">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>

        <div class="notif__list">
          <div v-if="!notifications.notifications.length" class="notif__empty">
            <svg class="notif__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p class="notif__empty-text">No notifications yet</p>
            <p class="notif__empty-sub">You'll see updates here when something happens.</p>
          </div>

          <button
            v-for="n in sorted"
            :key="n.id"
            class="notif__item"
            :class="{ 'notif__item--new': !n.read_at, 'notif__item--fade': animatingId === n.id }"
            type="button"
            @click="onMark(n.id)"
          >
            <span class="notif__dot" :class="{ 'notif__dot--seen': n.read_at }" />
            <span class="notif__item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="iconSvg(n.data?.icon)"/>
            </span>
            <span class="notif__item-body">
              <strong class="notif__item-title">{{ n.data?.title ?? '' }}</strong>
              <p class="notif__item-msg">{{ n.data?.message ?? '' }}</p>
              <span class="notif__item-time">{{ n.created_at }}</span>
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.notif {
  position: relative;
}

.notif__btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.notif__btn:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.notif__icon {
  width: 20px;
  height: 20px;
}

.notif__badge {
  position: absolute;
  top: 1px;
  right: 1px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  line-height: 17px;
  text-align: center;
  box-shadow: 0 0 0 2px #fff;
}

.notif__drop {
  position: absolute;
  top: calc(100% + 10px);
  right: -8px;
  width: 380px;
  max-height: 520px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-strong);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.10);
  overflow: hidden;
  z-index: 100;
}

.notif__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid var(--line);
}

.notif__head > div {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.notif__head-title {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text);
}

.notif__head-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 2px 8px;
  border-radius: 999px;
}

.notif__mark-all {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: var(--accent);
  background: none;
  border: 1px solid transparent;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.15s, border-color 0.15s;
}

.notif__mark-all:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.notif__mark-all svg {
  flex: none;
}

.notif__list {
  max-height: 400px;
  overflow-y: auto;
}

.notif__list::-webkit-scrollbar {
  width: 4px;
}

.notif__list::-webkit-scrollbar-track {
  background: transparent;
}

.notif__list::-webkit-scrollbar-thumb {
  background: var(--line-strong);
  border-radius: 999px;
}

.notif__empty {
  padding: 48px 20px;
  text-align: center;
}

.notif__empty-icon {
  width: 36px;
  height: 36px;
  color: var(--line-strong);
  margin-bottom: 12px;
}

.notif__empty-text {
  margin: 0 0 4px;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text);
}

.notif__empty-sub {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
}

.notif__item {
  display: flex;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-bottom: 1px solid var(--line);
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}

.notif__item:last-child {
  border-bottom: none;
}

.notif__item:hover {
  background: var(--bg-soft);
}

.notif__item--new {
  background: var(--bg);
}

.notif__item--new:hover {
  background: var(--accent-soft);
}

.notif__item--fade {
  background: transparent !important;
}

.notif__dot {
  flex: none;
  width: 8px;
  height: 8px;
  margin-top: 6px;
  border-radius: 50%;
  background: var(--accent);
  transition: opacity 0.2s;
}

.notif__dot--seen {
  opacity: 0;
}

.notif__item-icon {
  flex: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
}

.notif__item-icon svg {
  width: 16px;
  height: 16px;
}

.notif__item-body {
  flex: 1;
  min-width: 0;
}

.notif__item-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 2px;
  color: var(--text);
}

.notif__item-msg {
  margin: 0;
  font-size: 0.8rem;
  color: var(--muted);
  line-height: 1.45;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notif__item-time {
  display: block;
  margin-top: 4px;
  font-size: 0.68rem;
  color: #9ca3af;
  font-weight: 500;
}

.drop-enter-active,
.drop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

@media (max-width: 640px) {
  .notif__drop {
    position: fixed;
    top: 84px;
    left: 8px;
    right: 8px;
    width: auto;
    max-height: calc(100vh - 100px);
  }
}
</style>
