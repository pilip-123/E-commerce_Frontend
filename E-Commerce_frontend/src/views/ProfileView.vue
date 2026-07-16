<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/api/axios';
import { useAuth } from '@/stores/auth';
import { useLocale } from '@/composables/useLocale';

const auth = useAuth();
const loading = ref(false);
const saving = ref(false);
const message = ref('');
const errorMessage = ref('');
const activeTab = ref('profile');

const form = reactive({
  name: '',
  phone: '',
  address: '',
});

const summary = ref({
  orders: 0,
  wishlist: 0,
  cart: 0,
  reviews: 0,
});

const recentOrders = ref([]);

const email = computed(() => auth.user?.email ?? '');
const avatarUrl = computed(() => auth.user?.image_url ?? null);
const imageFile = ref(null);
const imageInput = ref(null);
const avatarPreview = ref(null);

const initials = computed(() => {
  if (!auth.user?.name) return '?';
  return auth.user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const joinedDate = computed(() => {
  if (!auth.user?.created_at) return '';
  return new Date(auth.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const { t } = useLocale();

async function loadProfile() {
  loading.value = true;
  try {
    const { data } = await api.get('/profile');
    form.name = data.user.name;
    form.phone = data.user.phone ?? '';
    form.address = data.user.address ?? '';
    summary.value = data.summary;
    auth.user = data.user;
  } finally {
    loading.value = false;
  }
}

async function loadRecentOrders() {
  try {
    const { data } = await api.get('/orders?per_page=3');
    recentOrders.value = data.data ?? [];
  } catch {
    // silently fail
  }
}

function handleImageChange(event) {
  const file = event.target.files?.[0] ?? null;
  if (file) {
    imageFile.value = file;
    avatarPreview.value = URL.createObjectURL(file);
  }
}

function openImagePicker() {
  imageInput.value?.click();
}

function removeImage() {
  imageFile.value = null;
  avatarPreview.value = null;
  if (imageInput.value) {
    imageInput.value.value = '';
  }
}

async function handleSubmit() {
  saving.value = true;
  message.value = '';
  errorMessage.value = '';

  try {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone ?? '');
    formData.append('address', form.address ?? '');
    if (imageFile.value) {
      formData.append('image', imageFile.value);
    }
    formData.append('_method', 'PATCH');

    const { data } = await api.post('/profile', formData);
    auth.user = data.user;
    imageFile.value = null;
    avatarPreview.value = null;
    message.value = data.message;
  } catch (error) {
    errorMessage.value = error.response?.data?.message ?? 'Unable to update profile.';
  } finally {
    saving.value = false;
  }
}

onMounted(async () => {
  await loadProfile();
  await loadRecentOrders();
});
</script>

<template>
  <div class="profile-page">

    <!-- Cover Banner -->
    <div class="cover-banner">
      <div class="cover-wave"></div>
    </div>

    <!-- Profile Info Bar -->
    <div class="profile-bar">
      <div class="profile-bar__stats">
        <div class="stat-item">
          <svg class="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <span class="stat-value">{{ summary.orders }}</span>
          <span class="stat-label">{{ t('orders.title') }}</span>
        </div>
        <div class="stat-item">
          <svg class="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="stat-value">{{ summary.wishlist }}</span>
          <span class="stat-label">{{ t('wishlist.title') }}</span>
        </div>
        <div class="stat-item">
          <svg class="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          <span class="stat-value">{{ summary.cart }}</span>
          <span class="stat-label">{{ t('cart.title') }}</span>
        </div>
        <div class="stat-item">
          <svg class="stat-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span class="stat-value">{{ summary.reviews }}</span>
          <span class="stat-label">{{ t('product.reviews') }}</span>
        </div>
      </div>

      <div class="profile-bar__avatar">
        <div class="avatar-frame" @click="openImagePicker">
          <img v-if="avatarPreview || avatarUrl" :src="avatarPreview || avatarUrl" :alt="auth.user?.name" class="avatar-img">
          <div v-else class="avatar-placeholder">{{ initials }}</div>
          <div class="avatar-overlay">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          </div>
        </div>
        <h1 class="profile-name">{{ auth.user?.name ?? 'User' }}</h1>
        <p class="profile-role">{{ auth.user?.role === 'admin' ? t('profile.title') : t('profile.title') }}</p>
        <input ref="imageInput" class="hidden-file-input" type="file" accept="image/*" @change="handleImageChange">
      </div>

      <div class="profile-bar__actions">
        <RouterLink class="action-btn" to="/orders" :title="t('orders.title')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
        </RouterLink>
        <RouterLink class="action-btn" to="/wishlist" :title="t('wishlist.title')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </RouterLink>
        <button class="action-btn-primary" type="button" @click="activeTab = 'edit'" :title="t('profile.update')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-bar">
      <div class="tabs">
        <button class="tab" :class="{ active: activeTab === 'profile' }" @click="activeTab = 'profile'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {{ t('profile.personal') }}
        </button>
        <button class="tab" :class="{ active: activeTab === 'orders' }" @click="activeTab = 'orders'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
          {{ t('orders.title') }}
        </button>
        <button class="tab" :class="{ active: activeTab === 'wishlist' }" @click="activeTab = 'wishlist'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          {{ t('wishlist.title') }}
        </button>
        <button class="tab" :class="{ active: activeTab === 'edit' }" @click="activeTab = 'edit'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          {{ t('profile.update') }}
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="profile-content">

      <!-- Profile Tab -->
      <template v-if="activeTab === 'profile'">
        <div class="content-layout">
          <aside class="content-sidebar">
            <div class="card">
              <h3 class="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {{ t('profile.personal') }}
              </h3>
              <p class="card-text">{{ t('general.no_data') }} {{ joinedDate }}.</p>
              <div class="info-rows">
                <div class="info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span>{{ auth.user?.email }}</span>
                </div>
                <div v-if="auth.user?.phone" class="info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>{{ auth.user.phone }}</span>
                </div>
                <div v-if="auth.user?.address" class="info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>{{ auth.user.address }}</span>
                </div>
                <div class="info-row">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{{ t('general.no_data') }} {{ joinedDate }}</span>
                </div>
              </div>
            </div>

            <div class="card stats-card">
              <h3 class="card-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                {{ t('orders.title') }}
              </h3>
              <div class="stats-grid">
                <div class="mini-stat">
                  <span class="mini-stat__value">{{ summary.orders }}</span>
                  <span class="mini-stat__label">{{ t('orders.title') }}</span>
                </div>
                <div class="mini-stat">
                  <span class="mini-stat__value">{{ summary.wishlist }}</span>
                  <span class="mini-stat__label">{{ t('wishlist.title') }}</span>
                </div>
                <div class="mini-stat">
                  <span class="mini-stat__value">{{ summary.cart }}</span>
                  <span class="mini-stat__label">{{ t('cart.title') }}</span>
                </div>
                <div class="mini-stat">
                  <span class="mini-stat__value">{{ summary.reviews }}</span>
                  <span class="mini-stat__label">{{ t('product.reviews') }}</span>
                </div>
              </div>
            </div>
          </aside>

          <main class="content-main">
            <!-- Composer -->
            <div class="card composer-card">
              <RouterLink to="/products" class="composer-input">
                <span>{{ t('products.empty_hint') }}</span>
              </RouterLink>
              <div class="composer-actions">
                <RouterLink to="/orders" class="composer-btn">
                  <span class="badge-icon badge-icon--teal">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>
                  </span>
                  {{ t('orders.title') }}
                </RouterLink>
                <RouterLink to="/wishlist" class="composer-btn">
                  <span class="badge-icon badge-icon--indigo">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </span>
                  {{ t('wishlist.title') }}
                </RouterLink>
                <RouterLink to="/cart" class="btn-primary btn-small">{{ t('general.view') }}</RouterLink>
              </div>
            </div>

            <!-- Recent Orders -->
            <div v-for="order in recentOrders" :key="order.id" class="card post-card">
              <div class="post-header">
                <div class="post-author">
                  <img v-if="auth.user?.image_url" :src="auth.user.image_url" :alt="auth.user.name" class="post-avatar">
                  <div v-else class="post-avatar post-avatar--initials">{{ initials }}</div>
                  <div>
                    <span class="post-name">{{ auth.user?.name }}</span>
                    <span class="post-time">{{ new Date(order.created_at).toLocaleDateString() }}</span>
                  </div>
                </div>
                <span class="badge badge--status">{{ order.status }}</span>
              </div>
              <p class="post-body">Order #{{ order.id }} — <strong>${{ Number(order.total_amount).toFixed(2) }}</strong></p>
              <div class="post-items">
                <span v-for="item in order.items?.slice(0, 3)" :key="item.id" class="post-item-chip">
                  {{ item.product?.name ?? 'Product' }} x{{ item.quantity }}
                </span>
                <span v-if="order.items?.length > 3" class="post-item-chip post-item-chip--more">+{{ order.items.length - 3 }} {{ t('general.view') }}</span>
              </div>
            </div>

            <div v-if="!recentOrders.length" class="card empty-card">
              <p>{{ t('orders.empty_hint') }}</p>
              <RouterLink to="/products" class="btn-primary">{{ t('home.shop_now') }}</RouterLink>
            </div>
          </main>
        </div>
      </template>

      <!-- Orders Tab -->
      <template v-if="activeTab === 'orders'">
        <div class="card">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="card-title mb-0">{{ t('orders.title') }}</h3>
            <RouterLink class="btn-primary btn-small" to="/orders">{{ t('general.view') }}</RouterLink>
          </div>
          <p class="card-text">{{ t('general.no_data') }} <strong>{{ summary.orders }}</strong> {{ t('orders.title') }}.</p>
        </div>
      </template>

      <!-- Wishlist Tab -->
      <template v-if="activeTab === 'wishlist'">
        <div class="card">
          <div class="d-flex align-items-center justify-content-between mb-3">
            <h3 class="card-title mb-0">{{ t('wishlist.title') }}</h3>
            <RouterLink class="btn-primary btn-small" to="/wishlist">{{ t('general.view') }}</RouterLink>
          </div>
          <p class="card-text">{{ t('general.no_data') }} <strong>{{ summary.wishlist }}</strong> {{ t('wishlist.title') }}.</p>
        </div>
      </template>

      <!-- Edit Tab -->
      <template v-if="activeTab === 'edit'">
        <div class="content-layout content-layout--centered">
          <div class="card edit-card">
            <h3 class="card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              {{ t('profile.update') }}
            </h3>

            <form @submit.prevent="handleSubmit">
              <div class="edit-avatar-row">
                <div class="edit-avatar" @click="openImagePicker">
                  <img v-if="avatarPreview || avatarUrl" :src="avatarPreview || avatarUrl" :alt="t('profile.title')" class="edit-avatar-img">
                  <div v-else class="edit-avatar-placeholder">{{ initials }}</div>
                  <div class="edit-avatar-overlay">{{ t('profile.update') }}</div>
                </div>
                <div class="edit-avatar-btns">
                  <button class="avatar-icon-btn" type="button" @click="openImagePicker" :title="t('general.save')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </button>
                  <button v-if="avatarPreview || avatarUrl" class="avatar-icon-btn avatar-icon-btn--remove" type="button" @click="removeImage" :title="t('general.delete')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                </div>
              </div>

              <div class="form-fields">
                <div>
                  <label class="field-label">{{ t('profile.personal') }}</label>
                  <input v-model="form.name" class="field-input" type="text" required>
                </div>
                <div>
                  <label class="field-label">{{ t('auth.email') }}</label>
                  <input :value="email" class="field-input" type="email" disabled>
                </div>
                <div>
                  <label class="field-label">{{ t('auth.email') }}</label>
                  <input v-model="form.phone" class="field-input" type="text">
                </div>
                <div>
                  <label class="field-label">{{ t('checkout.shipping') }}</label>
                  <textarea v-model="form.address" class="field-input" rows="3"></textarea>
                </div>
              </div>

              <p v-if="message" class="form-success">{{ message }}</p>
              <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

              <div class="edit-actions">
                <button class="btn-primary" type="submit" :disabled="saving">
                  {{ saving ? t('general.loading') : t('general.save') }}
                </button>
                <button class="btn-ghost" type="button" @click="activeTab = 'profile'" :title="t('general.cancel')">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped>
.profile-page {
  --accent: #5b5bd6;
  --accent-soft: rgba(91, 91, 214, 0.08);
  --accent-light: #eeeef8;
  --bg: #f0f0f8;
  --radius: 16px;
  --shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  max-width: 1100px;
  margin: 0 auto;
}

/* ─── Cover ─── */
.cover-banner {
  position: relative;
  height: 200px;
  border-radius: var(--radius) var(--radius) 0 0;
  overflow: hidden;
}

.cover-wave {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d0d0f0 0%, #b8b8e8 50%, #a0a0e0 100%);
  position: relative;
}

.cover-wave::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
}

/* ─── Profile Bar ─── */
.profile-bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 32px 20px;
  border-radius: 0 0 var(--radius) var(--radius);
  box-shadow: var(--shadow);
}

.profile-bar__stats {
  display: flex;
  gap: 28px;
  min-width: 280px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-icon {
  color: var(--accent);
  opacity: 0.7;
}

.stat-value {
  font-weight: 700;
  font-size: 1.05rem;
  color: #111;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.profile-bar__avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -48px;
  flex: 1;
}

.avatar-frame {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid #fff;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), #7c7cdb);
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  opacity: 0;
  transition: opacity 0.2s;
  color: #fff;
}

.avatar-frame:hover .avatar-overlay {
  opacity: 1;
}

.profile-name {
  margin: 8px 0 2px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #111;
}

.profile-role {
  margin: 0;
  font-size: 0.85rem;
  color: #9ca3af;
}

.profile-bar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 280px;
  justify-content: flex-end;
}

.action-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}

/* ─── Tabs ─── */
.tabs-bar {
  background: var(--accent-light);
  border-radius: var(--radius);
  margin-top: 16px;
  padding: 0 32px;
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  border: 0;
  background: transparent;
  color: #6b7280;
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--accent);
  background: rgba(91, 91, 214, 0.04);
}

.tab.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  font-weight: 600;
}

/* ─── Content ─── */
.profile-content {
  margin-top: 20px;
}

.content-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start;
}

.content-layout--centered {
  grid-template-columns: 1fr;
  max-width: 600px;
  margin: 0 auto;
}

/* ─── Cards ─── */
.card {
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 24px;
  margin-bottom: 20px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 1rem;
  font-weight: 700;
  color: #111;
}

.card-title svg {
  color: var(--accent);
  flex: none;
}

.card-text {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ─── Info rows ─── */
.info-rows {
  display: grid;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.88rem;
  color: #6b7280;
}

.info-row svg {
  flex: none;
  color: var(--accent);
  opacity: 0.7;
}

/* ─── Stats mini ─── */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mini-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: var(--accent-light);
  border-radius: 12px;
}

.mini-stat__value {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--accent);
}

.mini-stat__label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* ─── Composer ─── */
.composer-input {
  display: block;
  padding: 14px 18px;
  border-radius: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #9ca3af;
  font-size: 0.9rem;
  text-decoration: none;
  transition: border-color 0.2s;
}

.composer-input:hover {
  border-color: var(--accent);
}

.composer-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
}

.composer-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  color: #6b7280;
  text-decoration: none;
  transition: background 0.2s;
}

.composer-btn:hover {
  background: var(--accent-light);
}

.badge-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}

.badge-icon--teal {
  background: rgba(45, 212, 191, 0.15);
  color: #0d9488;
}

.badge-icon--indigo {
  background: var(--accent-soft);
  color: var(--accent);
}

/* ─── Post Card ─── */
.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.post-avatar--initials {
  display: grid;
  place-items: center;
  background: var(--accent);
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
}

.post-name {
  font-weight: 600;
  font-size: 0.9rem;
  display: block;
}

.post-time {
  font-size: 0.78rem;
  color: #9ca3af;
}

.post-body {
  margin: 0 0 12px;
  font-size: 0.9rem;
  color: #374151;
  line-height: 1.6;
}

.post-items {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.post-item-chip {
  padding: 4px 10px;
  border-radius: 6px;
  background: #f3f4f6;
  font-size: 0.8rem;
  color: #6b7280;
}

.post-item-chip--more {
  background: var(--accent-light);
  color: var(--accent);
}

.badge--status {
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: #fef3c7;
  color: #92400e;
}

/* ─── Empty ─── */
.empty-card {
  text-align: center;
  padding: 40px 24px;
  color: #6b7280;
}

.empty-card p {
  margin-bottom: 16px;
}

/* ─── Edit Card ─── */
.edit-card {
  max-width: 560px;
}

.edit-avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.edit-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  border: 2px solid var(--accent-light);
}

.edit-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.edit-avatar-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--accent), #7c7cdb);
  color: #fff;
  font-weight: 700;
  font-size: 1.3rem;
}

.edit-avatar-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 0.7rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.edit-avatar:hover .edit-avatar-overlay {
  opacity: 1;
}

.form-fields {
  display: grid;
  gap: 14px;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.field-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.9rem;
  outline: none;
  background: #fff;
  transition: border-color 0.2s;
}

.field-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.field-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* ─── Buttons ─── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-primary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s;
}

.action-btn-primary:hover {
  opacity: 0.92;
}

.edit-avatar-btns {
  display: flex;
  gap: 8px;
}

.avatar-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: var(--accent);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.avatar-icon-btn:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.avatar-icon-btn--remove {
  color: #dc2626;
}

.avatar-icon-btn--remove:hover {
  background: rgba(220, 38, 38, 0.08);
  border-color: #dc2626;
}

.btn-small {
  padding: 7px 16px;
  font-size: 0.82rem;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--accent);
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-ghost:hover {
  background: var(--accent-soft);
}

.text-danger {
  color: #dc2626;
}

.text-danger:hover {
  background: rgba(220, 38, 38, 0.08);
}

/* ─── Utilities ─── */
.d-flex {
  display: flex;
}

.align-items-center {
  align-items: center;
}

.justify-content-between {
  justify-content: space-between;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

.hidden-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.form-success {
  margin: 12px 0 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(91, 91, 214, 0.08);
  color: var(--accent);
  font-size: 0.85rem;
}

.form-error {
  margin: 12px 0 0;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
  font-size: 0.85rem;
}

/* ─── Responsive ─── */
@media (max-width: 860px) {
  .profile-bar {
    flex-direction: column;
    padding: 0 20px 20px;
    gap: 12px;
  }

  .profile-bar__stats {
    order: 2;
    justify-content: center;
  }

  .profile-bar__avatar {
    order: 0;
    margin-top: -48px;
  }

  .profile-bar__actions {
    order: 1;
    min-width: unset;
    width: 100%;
    justify-content: center;
  }

  .content-layout {
    grid-template-columns: 1fr;
  }

  .content-layout--centered {
    max-width: 100%;
  }

  .tabs-bar {
    padding: 0 16px;
    overflow-x: auto;
  }

  .tabs {
    width: max-content;
  }
}

@media (max-width: 640px) {
  .cover-banner {
    height: 120px;
  }

  .profile-bar__stats {
    gap: 16px;
  }

  .profile-name {
    font-size: 1rem;
  }

  .avatar-frame {
    width: 72px;
    height: 72px;
  }

  .profile-bar {
    padding: 0 12px 16px;
  }

  .composer-actions {
    flex-wrap: wrap;
  }

  .edit-avatar-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
