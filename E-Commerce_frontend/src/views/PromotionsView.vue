<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api/axios';
import { addToCart } from '@/stores/cart';
import { addToWishlist } from '@/stores/wishlist';
import { useAuth } from '@/stores/auth';
import { formatCurrency } from '@/utils/format';

const router = useRouter();
const auth = useAuth();

const state = reactive({
  promotions: [],
  loading: false,
});

async function fetchActivePromotions() {
  state.loading = true;
  try {
    const { data } = await api.get('/promotions/active');
    state.promotions = data.data ?? [];
  } catch {
    state.promotions = [];
  } finally {
    state.loading = false;
  }
}

async function handleAddToCart(product) {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  await addToCart(product.id, 1);
  router.push({ name: 'cart' });
}

async function handleAddToWishlist(product) {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  await addToWishlist(product.id);
}

function goToProduct(product) {
  router.push({ name: 'product-detail', params: { slug: product.slug } });
}

function discountLabel(promotion) {
  if (promotion.discount_type === 'percentage') return `-${promotion.discount_value}%`;
  return `-${formatCurrency(promotion.discount_value)}`;
}

function daysRemaining(endDate) {
  const diff = new Date(endDate) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Expired';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

const totalPromotions = computed(() => state.promotions.length);
const totalProducts = computed(() => state.promotions.reduce((sum, p) => sum + (p.products?.length ?? 0), 0));

onMounted(fetchActivePromotions);
</script>

<template>
  <div class="page">
    <section class="promo-header">
      <div class="promo-header__content">
        <p class="eyebrow">Deals</p>
        <h1>Promotions</h1>
        <p class="promo-header__lead">Check out our latest deals and discounts. Grab them before they expire!</p>
      </div>
      <div class="promo-header__stats">
        <div class="promo-stat">
          <span class="promo-stat__value">{{ totalPromotions }}</span>
          <span class="promo-stat__label">Active Promotions</span>
        </div>
        <div class="promo-stat">
          <span class="promo-stat__value">{{ totalProducts }}</span>
          <span class="promo-stat__label">Discounted Products</span>
        </div>
      </div>
    </section>

    <section v-if="state.loading" class="section">
      <div class="promo-status">
        <div class="spinner" />
        <p>Loading promotions...</p>
      </div>
    </section>

    <template v-else-if="state.promotions.length">
      <section v-for="promotion in state.promotions" :key="promotion.id" class="promo-section">
        <div class="promo-section__head">
          <div class="promo-section__head-left">
            <span class="promo-tag" :class="promotion.discount_type === 'percentage' ? 'promo-tag--pct' : 'promo-tag--fixed'">
              {{ discountLabel(promotion) }}
            </span>
            <div>
              <h2 class="promo-section__title">{{ promotion.name }}</h2>
              <p class="promo-section__meta">
                <span class="promo-section__count">{{ promotion.products?.length ?? 0 }} product{{ (promotion.products?.length ?? 0) !== 1 ? 's' : '' }}</span>
                <span class="promo-section__divider">·</span>
                <span class="promo-section__expiry">{{ daysRemaining(promotion.end_date) }}</span>
              </p>
            </div>
          </div>
          <RouterLink class="promo-section__link" :to="{ name: 'products', query: { category_id: undefined } }">View all →</RouterLink>
        </div>
        <p v-if="promotion.description" class="promo-section__desc">{{ promotion.description }}</p>

        <div v-if="promotion.products?.length" class="promo-grid">
          <article v-for="product in promotion.products" :key="product.id" class="deal-card" :class="{ 'deal-card--oos': !product.stock || product.stock < 1 }" @click="goToProduct(product)">
            <div class="deal-card__image">
              <img v-if="product.image" :src="product.image" :alt="product.name">
              <div v-else class="deal-card__placeholder">No image</div>
              <span v-if="product.stock > 0" class="deal-card__badge">{{ discountLabel(promotion) }}</span>
              <span v-else class="deal-card__badge deal-card__badge--oos">Out of stock</span>
            </div>
            <div class="deal-card__body">
              <h3 class="deal-card__title">{{ product.name }}</h3>
              <div class="deal-card__pricing">
                <s class="deal-card__old">{{ formatCurrency(product.price) }}</s>
                <strong class="deal-card__new">{{ formatCurrency(product.discount_price) }}</strong>
              </div>
              <div class="deal-card__actions">
                <button class="deal-card__cart" type="button" :disabled="!product.stock || product.stock < 1" @click.stop="handleAddToCart(product)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Cart
                </button>
                <button class="deal-card__wish" type="button" @click.stop="handleAddToWishlist(product)" title="Save">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        </div>
        <div v-else class="promo-section__empty">
          <p>No products on this promotion yet.</p>
        </div>
      </section>
    </template>

    <section v-else class="section">
      <div class="promo-empty">
        <svg class="promo-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        <p class="promo-empty__title">No active promotions</p>
        <p class="promo-empty__sub">There are no promotions running right now. Check back later!</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Header ─── */
.promo-header {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
}

.promo-header__content {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.promo-header__content h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 1.02;
}

.promo-header__lead {
  margin: 18px 0 0;
  max-width: 56ch;
  color: var(--muted);
}

.promo-header__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-content: center;
}

.promo-stat {
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

.promo-stat__value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #dc2626;
}

.promo-stat__label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ─── Loading ─── */
.promo-status {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 64px 0;
  color: var(--muted);
}

/* ─── Promotion Section ─── */
.promo-section {
  margin-bottom: 36px;
}

.promo-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.promo-section__head-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.promo-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 800;
  line-height: 1;
  flex-shrink: 0;
}

.promo-tag--pct {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  box-shadow: 0 3px 12px rgba(220, 38, 38, 0.35);
}

.promo-tag--fixed {
  background: linear-gradient(135deg, #ea580c, #c2410c);
  color: #fff;
  box-shadow: 0 3px 12px rgba(234, 88, 12, 0.35);
}

.promo-section__title {
  margin: 0;
  font-size: 1.25rem;
}

.promo-section__meta {
  margin: 3px 0 0;
  font-size: 0.8rem;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
}

.promo-section__divider {
  color: var(--line-strong);
}

.promo-section__expiry {
  font-weight: 600;
  color: #dc2626;
}

.promo-section__link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}

.promo-section__link:hover {
  text-decoration: underline;
}

.promo-section__desc {
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 0.9rem;
}

.promo-section__empty {
  padding: 24px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
}

/* ─── Deal Grid ─── */
.promo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1100px) {
  .promo-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 820px) {
  .promo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .promo-grid {
    grid-template-columns: 1fr;
  }
}

/* ─── Deal Card ─── */
.deal-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-strong);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.deal-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  cursor: pointer;
}

.deal-card__image {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--accent-soft);
  overflow: hidden;
}

.deal-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.deal-card__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  color: var(--muted);
}

.deal-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 7px;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

.deal-card__body {
  padding: 14px;
  display: grid;
  gap: 8px;
}

.deal-card__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deal-card__pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.deal-card__old {
  color: #9ca3af;
  font-size: 0.82rem;
}

.deal-card__new {
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 800;
}

.deal-card__actions {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

.deal-card__cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 12px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}

.deal-card__cart:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.deal-card__cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.deal-card__wish {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}

.deal-card__wish:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}

.deal-card--oos {
  opacity: 0.5;
}

.deal-card--oos .deal-card__image img {
  filter: grayscale(1);
}

.deal-card--oos .deal-card__title {
  color: #94a3b8;
}

.deal-card--oos .deal-card__new {
  color: #94a3b8;
}

.deal-card--oos .deal-card__cart {
  opacity: 0.5;
  pointer-events: none;
}

.deal-card__badge--oos {
  background: linear-gradient(135deg, #64748b, #475569);
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.4);
}

/* ─── Empty ─── */
.promo-empty {
  display: grid;
  place-items: center;
  gap: 6px;
  padding: 80px 24px;
  text-align: center;
}

.promo-empty__icon {
  width: 44px;
  height: 44px;
  color: var(--line-strong);
  margin-bottom: 8px;
}

.promo-empty__title {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text);
}

.promo-empty__sub {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .promo-header {
    grid-template-columns: 1fr;
  }
}
</style>
