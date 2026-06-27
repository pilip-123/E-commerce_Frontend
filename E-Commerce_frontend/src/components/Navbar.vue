<script setup>
import { ref, computed } from 'vue';
import logoUrl from '@/assets/logo.png';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import { logout, useAuth } from '@/stores/auth';
import ConfirmModal from './ConfirmModal.vue';
import NotificationBell from './NotificationBell.vue';

const auth = useAuth();
const router = useRouter();
const showLogoutModal = ref(false);
const mobileOpen = ref(false);

const initials = computed(() => {
  if (!auth.user?.name) return '?';
  return auth.user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

function confirmLogout() {
  showLogoutModal.value = true;
  mobileOpen.value = false;
}

async function handleLogout() {
  await logout();
  showLogoutModal.value = false;
  await router.push({ name: 'login' });
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <RouterLink class="brand" to="/">
        <img class="brand__logo" :src="logoUrl" alt="E-Commerce">
        <span class="brand__copy">
          <strong>E-Commerce</strong>
        </span>
      </RouterLink>

      <button class="hamburger" :class="{ 'hamburger--open': mobileOpen }" type="button" @click="mobileOpen = !mobileOpen" aria-label="Menu">
        <span /><span /><span />
      </button>

      <nav class="nav" :class="{ 'nav--open': mobileOpen }">
        <div class="nav__primary">
          <RouterLink to="/" class="nav__link" @click="mobileOpen = false">Home</RouterLink>
          <RouterLink to="/products" class="nav__link" @click="mobileOpen = false">Products</RouterLink>
          <RouterLink to="/promotions" class="nav__link nav__link--hot" @click="mobileOpen = false">Promotions</RouterLink>
        </div>

        <div v-if="auth.user" class="nav__secondary">
          <RouterLink to="/cart" class="nav__link" @click="mobileOpen = false">Cart</RouterLink>
          <RouterLink to="/wishlist" class="nav__link" @click="mobileOpen = false">Wishlist</RouterLink>
          <RouterLink to="/orders" class="nav__link" @click="mobileOpen = false">Orders</RouterLink>
          <RouterLink v-if="auth.user?.role === 'admin'" to="/admin/promotions" class="nav__link nav__link--admin" @click="mobileOpen = false">Manage Promos</RouterLink>
        </div>
      </nav>

      <div class="nav-actions">
        <template v-if="auth.user">
          <NotificationBell />
          <div class="nav-user">
            <RouterLink to="/profile" class="nav-user__avatar">
              <img v-if="auth.user.image_url" :src="auth.user.image_url" :alt="auth.user.name" class="nav-user__img">
              <span v-else class="nav-user__initials">{{ initials }}</span>
            </RouterLink>
            <button class="nav-logout" type="button" @click="confirmLogout" title="Sign out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        </template>
        <template v-else>
          <RouterLink class="button button--ghost button--sm" to="/login">Login</RouterLink>
          <RouterLink class="button button--sm" to="/register">Register</RouterLink>
        </template>
      </div>
    </div>
  </header>

  <ConfirmModal
    :show="showLogoutModal"
    title="Sign out"
    message="Are you sure you want to sign out?"
    confirm-text="Sign out"
    :danger="true"
    @confirm="handleLogout"
    @cancel="showLogoutModal = false"
  />
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.site-header__inner {
  display: flex;
  align-items: center;
  gap: 24px;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
}

/* ─── Brand ─── */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}

.brand__logo {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.brand__copy strong {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
}

/* ─── Hamburger ─── */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.2s, opacity 0.2s;
}

.hamburger--open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger--open span:nth-child(2) {
  opacity: 0;
}

.hamburger--open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ─── Nav ─── */
.nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.nav__primary {
  display: flex;
  align-items: center;
  gap: 2px;
}

.nav__secondary {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.nav__link {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
}

.nav__link:hover {
  color: var(--text);
  background: var(--accent-soft);
}

.nav__link:global(.router-link-exact-active) {
  color: var(--accent);
  background: var(--accent-soft);
}

.nav__link--hot {
  position: relative;
  color: #dc2626;
}

.nav__link--hot:hover {
  background: transparent;
}

.nav__link--hot:global(.router-link-exact-active) {
  color: #dc2626;
  background: transparent;
}

/* ─── Actions ─── */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-user__avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  flex: none;
  border: 2px solid var(--line);
  transition: border-color 0.2s;
}

.nav-user__avatar:hover {
  border-color: var(--accent);
}

.nav-user__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-user__initials {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
}

.nav-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.nav-logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

@media (max-width: 900px) {
  .hamburger {
    display: flex;
  }

  .nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 16px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transform: translateX(100%);
    transition: transform 0.25s ease;
    overflow-y: auto;
    z-index: 40;
  }

  .nav--open {
    transform: translateX(0);
  }

  .nav__primary,
  .nav__secondary {
    flex-direction: column;
    gap: 2px;
  }

  .nav__secondary {
    margin-left: 0;
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid var(--line);
  }

  .nav__link {
    padding: 12px 16px;
    font-size: 1rem;
  }

  .nav-actions {
    gap: 4px;
  }
}
</style>
