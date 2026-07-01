<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import api from '@/api/axios';
import { formatCurrency } from '@/utils/format';
import RateOrderModal from '@/components/RateOrderModal.vue';

const orders = ref([]);
const loading = ref(false);
const rateOrder = ref(null);
const showRateModal = ref(false);
const ratedOrderIds = ref(new Set());

const statusConfig = {
  pending:    { bg: '#fef3c7', color: '#92400e', dot: '#f59e0b', label: 'Pending' },
  processing: { bg: '#dbeafe', color: '#1e40af', dot: '#3b82f6', label: 'Processing' },
  shipped:    { bg: '#e0e7ff', color: '#3730a3', dot: '#6366f1', label: 'Shipped' },
  delivered:  { bg: '#d1fae5', color: '#065f46', dot: '#22c55e', label: 'Delivered' },
  cancelled:  { bg: '#fee2e2', color: '#991b1b', dot: '#ef4444', label: 'Cancelled' },
};

const defaultStatus = { bg: '#f3f4f6', color: '#4b5563', dot: '#9ca3af', label: 'Unknown' };

function statusFor(val) {
  return statusConfig[val?.toLowerCase()] ?? defaultStatus;
}

const totalOrders = computed(() => orders.value.length);

async function loadOrders() {
  loading.value = true;
  try {
    const { data } = await api.get('/orders');
    orders.value = data.data;
    checkPendingRatings();
  } finally {
    loading.value = false;
  }
}

function checkPendingRatings() {
  for (const order of orders.value) {
    if (order.status !== 'delivered') continue;
    if (ratedOrderIds.value.has(order.id)) continue;

    const hasUnrated = order.items?.some(item => !item.hasReviewed);
    if (hasUnrated) {
      rateOrder.value = order;
      showRateModal.value = true;
      return;
    }
  }
}

function onRateSubmitted() {
  ratedOrderIds.value.add(rateOrder.value?.id);
  showRateModal.value = false;
  rateOrder.value = null;
  checkPendingRatings();
}

function onRateClosed() {
  ratedOrderIds.value.add(rateOrder.value?.id);
  showRateModal.value = false;
  rateOrder.value = null;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

onMounted(loadOrders);
</script>

<template>
  <div class="page">
    <section class="orders-header">
      <div class="orders-header__content">
        <p class="eyebrow">Orders</p>
        <h1>Order history</h1>
        <p class="orders-header__lead">Track and review all your orders in one place.</p>
      </div>
      <div class="orders-header__stats">
        <div class="orders-stat">
          <span class="orders-stat__value">{{ totalOrders }}</span>
          <span class="orders-stat__label">Total orders</span>
        </div>
        <div class="orders-stat">
          <span class="orders-stat__value">
            {{ orders.filter(o => o.status === 'delivered').length }}
          </span>
          <span class="orders-stat__label">Delivered</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div v-if="loading" class="orders-status">
        <div class="spinner" />
        <p>Loading orders...</p>
      </div>

      <template v-else>
        <div v-if="!orders.length" class="orders-empty">
          <svg class="orders-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <p class="orders-empty__title">No orders yet</p>
          <p class="orders-empty__sub">Your orders will appear here once you make a purchase.</p>
          <RouterLink class="button w-full sm:w-auto" to="/products">Start Shopping</RouterLink>
        </div>

        <div class="orders-list">
          <article v-for="order in orders" :key="order.id" class="order-card">
            <div class="order-card__head">
              <div class="order-card__head-left">
                <div class="order-card__id-row">
                  <span class="order-card__id">#{{ order.id }}</span>
                  <span class="order-card__date">{{ formatDate(order.created_at) }}</span>
                </div>
                <span v-if="order.items?.length" class="order-card__item-count">
                  {{ order.items.length }} item{{ order.items.length !== 1 ? 's' : '' }}
                </span>
              </div>
              <div class="order-card__status-wrap">
                <span class="order-card__dot" :style="{ background: statusFor(order.status).dot }" />
                <span
                  class="order-card__status"
                  :style="{ background: statusFor(order.status).bg, color: statusFor(order.status).color }"
                >{{ statusFor(order.status).label }}</span>
              </div>
            </div>

            <div class="order-card__items">
              <div v-for="item in order.items" :key="item.id" class="order-item">
                <div class="order-item__media">
                  <img
                    v-if="item.product?.image"
                    :src="item.product.image"
                    :alt="item.product.name"
                    class="order-item__img"
                    loading="lazy"
                  >
                  <div v-else class="order-item__img order-item__img--placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>
                <div class="order-item__info">
                  <span class="order-item__name">{{ item.product?.name ?? 'Product' }}</span>
                  <span class="order-item__qty">Qty: {{ item.quantity }}</span>
                </div>
                <span class="order-item__price">{{ formatCurrency(item.price * item.quantity) }}</span>
              </div>
            </div>

            <div class="order-card__foot">
              <div class="order-card__ship" v-if="order.shipping_address">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {{ order.shipping_address }}
              </div>
              <div class="order-card__total">
                <span>Total</span>
                <strong>{{ formatCurrency(order.total_amount) }}</strong>
              </div>
            </div>
          </article>
        </div>
      </template>
    </section>
    <RateOrderModal
      :show="showRateModal"
      :order="rateOrder"
      @submitted="onRateSubmitted"
      @close="onRateClosed"
    />
  </div>
</template>

<style scoped>
/* ─── Header ─── */
.orders-header {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
}

.orders-header__content {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.orders-header__content h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 1.02;
}

.orders-header__lead {
  margin: 18px 0 0;
  max-width: 56ch;
  color: var(--muted);
}

.orders-header__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-content: center;
}

.orders-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 24px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--accent-soft);
  text-align: center;
}

.orders-stat__value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text);
}

.orders-stat__label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ─── Loading ─── */
.orders-status {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 64px 0;
  color: var(--muted);
}

/* ─── Empty ─── */
.orders-empty {
  display: grid;
  place-items: center;
  gap: 8px;
  padding: 64px 24px;
  text-align: center;
}

.orders-empty__icon {
  width: 48px;
  height: 48px;
  color: var(--line-strong);
  margin-bottom: 4px;
}

.orders-empty__title {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text);
}

.orders-empty__sub {
  margin: 0 0 8px;
  font-size: 0.88rem;
  color: var(--muted);
}

/* ─── List ─── */
.orders-list {
  display: grid;
  gap: 20px;
}

/* ─── Card ─── */
.order-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.order-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
}

.order-card__head-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-card__id-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.order-card__id {
  font-weight: 800;
  font-size: 1rem;
  color: var(--text);
}

.order-card__date {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 500;
}

.order-card__item-count {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  background: var(--accent-soft);
  padding: 3px 10px;
  border-radius: 999px;
}

.order-card__status-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.order-card__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.order-card__status {
  display: inline-flex;
  align-items: center;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: capitalize;
  letter-spacing: 0.03em;
}

/* ─── Items ─── */
.order-card__items {
  padding: 4px 0;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 24px;
}

.order-item__media {
  flex-shrink: 0;
}

.order-item__img {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--accent-soft);
}

.order-item__img--placeholder {
  display: grid;
  place-items: center;
  color: var(--line-strong);
}

.order-item__img--placeholder svg {
  width: 20px;
  height: 20px;
}

.order-item__info {
  flex: 1;
  min-width: 0;
  display: grid;
  gap: 2px;
}

.order-item__name {
  font-weight: 600;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-item__qty {
  font-size: 0.78rem;
  color: var(--muted);
}

.order-item__price {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--text);
  white-space: nowrap;
  flex-shrink: 0;
}

/* ─── Footer ─── */
.order-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 24px;
  border-top: 1px solid var(--line);
  background: var(--accent-soft);
}

.order-card__ship {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--muted);
  min-width: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-card__ship svg {
  flex-shrink: 0;
  color: var(--accent);
}

.order-card__total {
  display: flex;
  align-items: baseline;
  gap: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}

.order-card__total span {
  font-size: 0.82rem;
  color: var(--muted);
  font-weight: 600;
}

.order-card__total strong {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
}

@media (max-width: 1024px) {
  .orders-header {
    grid-template-columns: 1fr;
  }
  .orders-header__stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .order-card__head {
    padding: 14px 16px;
    flex-wrap: wrap;
  }
  .order-item {
    padding: 8px 16px;
  }
  .order-card__foot {
    padding: 12px 16px;
    flex-wrap: wrap;
  }
  .order-card__ship {
    width: 100%;
  }
}
</style>
