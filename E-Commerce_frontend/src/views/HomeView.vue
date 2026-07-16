<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { fetchCategories, fetchProducts, useProduct } from '@/stores/product';
import { addToCart } from '@/stores/cart';
import { addToWishlist } from '@/stores/wishlist';
import { useAuth } from '@/stores/auth';
import { useLocale } from '@/composables/useLocale';
import WelcomeBanner from '@/components/WelcomeBanner.vue';

const router = useRouter();
const productState = useProduct();
const auth = useAuth();
const { t } = useLocale();

const topProducts = computed(() => productState.products.slice(0, 3));

onMounted(() => {
  if (!productState.categories.length) fetchCategories();
  if (!productState.products.length) fetchProducts({ per_page: 3, status: 1 });
});

async function handleAddToCart(product) {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  await addToCart(product.id, 1);
  await router.push({ name: 'cart' });
}

async function handleAddToWishlist(product) {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  await addToWishlist(product.id);
  router.push({ name: 'wishlist' });
}
</script>

<template>
  <div class="page">
    <WelcomeBanner />

    <!-- Hero -->
    <section class="hero">
      <div class="hero__text">
        <p class="hero__eyebrow">{{ t('home.title') }}</p>
        <h1 class="hero__title">{{ t('home.title') }}</h1>
        <p class="hero__sub">{{ t('home.subtitle') }}</p>
        <div class="hero__actions">
          <RouterLink class="hero__btn hero__btn--primary" to="/products">{{ t('home.shop_now') }}</RouterLink>
          <RouterLink class="hero__btn hero__btn--outline" to="/categories">{{ t('categories.title') }}</RouterLink>
        </div>
      </div>
      <div class="hero__stats">
        <div class="hero-stat">
          <span class="hero-stat__value">{{ productState.products.length }}</span>
          <span class="hero-stat__label">{{ t('products.title') }}</span>
        </div>
        <div class="hero-stat">
          <span class="hero-stat__value">{{ productState.categories.length }}</span>
          <span class="hero-stat__label">{{ t('categories.title') }}</span>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="section__header">
        <div>
          <p class="eyebrow">{{ t('categories.all') }}</p>
          <h2>{{ t('categories.title') }}</h2>
          <p class="section__desc">{{ t('categories.subtitle') }}</p>
        </div>
        <RouterLink class="button button--ghost" to="/categories">{{ t('home.browse_all') }}</RouterLink>
      </div>

      <div v-if="productState.categories.length" class="home-cat-grid">
        <RouterLink
          v-for="category in productState.categories"
          :key="category.id"
          class="home-cat-card"
          :to="{ name: 'products', query: { category_id: category.id } }"
        >
          <div class="home-cat-card__top">
            <div class="home-cat-card__icon">{{ category.name.charAt(0) }}</div>
            <strong class="home-cat-card__name">{{ category.name }}</strong>
          </div>
          <div class="home-cat-card__bottom">
            <span class="home-cat-card__count">{{ category.products_count ?? 0 }} {{ t('products.title') }}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </RouterLink>
      </div>

      <div v-else class="empty-state">
        <p>{{ t('general.loading') }}</p>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section">
      <div class="section__header">
        <div>
          <p class="eyebrow">{{ t('home.featured') }}</p>
          <h2>{{ t('home.featured') }}</h2>
        </div>
        <RouterLink class="button button--ghost" to="/products">{{ t('home.browse_all') }}</RouterLink>
      </div>

      <div v-if="productState.loading" class="empty-state">
        <div class="spinner" />
        <p>{{ t('general.loading') }}</p>
      </div>

      <div v-else-if="topProducts.length" class="grid-products grid-products--3">
        <ProductCard
          v-for="product in topProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
        />
      </div>

      <div v-else class="empty-state">
        <p>{{ t('general.no_data') }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Hero ─── */
.hero {
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 24px;
}

.hero__text {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 36px 32px;
}

.hero__eyebrow {
  margin: 0 0 4px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
}

.hero__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.6rem);
  font-weight: 900;
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--text);
}

.hero__sub {
  margin: 14px 0 0;
  max-width: 50ch;
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.18s;
}

.hero__btn--primary {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  border: 0;
}

.hero__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
}

.hero__btn--outline {
  background: transparent;
  color: var(--text);
  border: 1px solid var(--line);
}

.hero__btn--outline:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.hero__stats {
  display: grid;
  gap: 14px;
  align-content: center;
}

.hero-stat {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-strong);
  box-shadow: var(--shadow);
}

.hero-stat__value {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--accent);
  line-height: 1;
}

.hero-stat__label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ─── Section desc ─── */
.section__desc {
  margin: 6px 0 0;
  font-size: 0.9rem;
  color: var(--muted);
  max-width: 56ch;
  line-height: 1.5;
}

/* ─── Home Category Grid ─── */
.home-cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

.home-cat-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow);
  text-decoration: none;
  transition: all 0.2s;
  min-height: 120px;
}

.home-cat-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}

.home-cat-card__top {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-cat-card__icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 1rem;
  font-weight: 800;
  flex-shrink: 0;
  text-transform: uppercase;
}

.home-cat-card__name {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.home-cat-card__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  margin-top: auto;
}

.home-cat-card__count {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
}

.home-cat-card__bottom svg {
  color: var(--accent);
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s;
}

.home-cat-card:hover .home-cat-card__bottom svg {
  opacity: 1;
  transform: translateX(0);
}

/* ─── 3-column products ─── */
.grid-products--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .hero__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .grid-products--3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .home-cat-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}

@media (max-width: 640px) {
  .grid-products--3 {
    grid-template-columns: 1fr;
  }
  .home-cat-grid {
    grid-template-columns: 1fr 1fr;
  }
  .hero__stats {
    grid-template-columns: 1fr;
  }
}
</style>
