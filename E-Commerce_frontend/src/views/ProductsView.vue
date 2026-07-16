<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import bannerImg from '@/components/images/Orange.jpg';
import ProductCard from '@/components/ProductCard.vue';
import { addToCart } from '@/stores/cart';
import { addToWishlist } from '@/stores/wishlist';
import { fetchCategories, fetchProducts, useProduct } from '@/stores/product';
import { useAuth } from '@/stores/auth';
import { useLocale } from '@/composables/useLocale';

const router = useRouter();
const productState = useProduct();
const auth = useAuth();
const { t } = useLocale();

const filters = reactive({
  search: '',
  category_id: '',
  min_price: '',
  max_price: '',
});

const currentPage = ref(1);
const hasFilters = computed(() => filters.search || filters.category_id || filters.min_price || filters.max_price);

async function loadProducts(page = 1) {
  currentPage.value = page;
  const params = { ...filters, page, per_page: 9, status: 1 };
  await fetchProducts(params);
}

function goToPage(page) {
  if (page < 1 || page > productState.meta.last_page) return;
  loadProducts(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadCatalog() {
  await fetchCategories();
  await loadProducts();
}

async function handleSubmit() {
  await loadProducts();
}

async function handleReset() {
  filters.search = '';
  filters.category_id = '';
  filters.min_price = '';
  filters.max_price = '';
  await loadProducts(1);
}

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

let refreshTimer;

onMounted(async () => {
  await loadCatalog();
  refreshTimer = setInterval(loadProducts, 30000);
});

onUnmounted(() => {
  clearInterval(refreshTimer);
});
</script>

<template>
  <div class="page">
    <!-- Page Banner -->
    <section class="page-banner">
      <img class="page-banner__img" :src="bannerImg" alt="">
      <div class="page-banner__overlay" />
      <div class="page-banner__inner">
        <p class="page-banner__eyebrow">{{ t('products.catalog') }}</p>
        <h1 class="page-banner__title">{{ t('products.title') }}</h1>
        <p class="page-banner__lead">{{ t('products.subtitle') }}</p>
      </div>
    </section>

    <!-- Header -->
    <section class="catalog-header">
      <div class="catalog-header__content">
        <p class="eyebrow">{{ t('products.catalog') }}</p>
        <h1>{{ t('products.title') }}</h1>
        <p class="catalog-header__lead">{{ t('products.subtitle') }}</p>
      </div>
      <div class="catalog-header__stats">
        <div class="catalog-stat">
          <span class="catalog-stat__value">{{ productState.meta.total }}</span>
          <span class="catalog-stat__label">{{ t('products.count') }}</span>
        </div>
        <div class="catalog-stat">
          <span class="catalog-stat__value">{{ productState.categories.length }}</span>
          <span class="catalog-stat__label">Categories</span>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filter-bar">
      <form class="filter-bar__form" @submit.prevent="handleSubmit">
        <div class="filter-bar__fields">
          <div class="filter-field filter-field--search">
            <svg class="filter-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input v-model="filters.search" class="filter-field__input" type="search" :placeholder="t('products.search_placeholder')">
          </div>
          <div class="filter-field">
            <select v-model="filters.category_id" class="filter-field__input">
              <option value="">{{ t('products.all_categories') }}</option>
              <option v-for="category in productState.categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="filter-field filter-field--price">
            <span class="filter-field__prefix">$</span>
            <input v-model="filters.min_price" class="filter-field__input" type="number" step="0.01" :placeholder="t('products.min_price')">
          </div>
          <div class="filter-field filter-field--price">
            <span class="filter-field__prefix">$</span>
            <input v-model="filters.max_price" class="filter-field__input" type="number" step="0.01" :placeholder="t('products.max_price')">
          </div>
          <button class="filter-bar__btn filter-bar__btn--apply" type="submit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            {{ t('products.search_btn') }}
          </button>
          <button v-if="hasFilters" class="filter-bar__btn filter-bar__btn--clear" type="button" @click="handleReset">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {{ t('products.clear_btn') }}
          </button>
        </div>
      </form>
      <div v-if="hasFilters" class="filter-bar__tags">
        <span class="filter-tag" v-if="filters.search">"{{ filters.search }}" <button class="filter-tag__remove" @click="filters.search = ''; handleSubmit()">×</button></span>
        <span class="filter-tag" v-if="filters.category_id">{{ productState.categories.find(c => c.id == filters.category_id)?.name }} <button class="filter-tag__remove" @click="filters.category_id = ''; handleSubmit()">×</button></span>
        <span class="filter-tag" v-if="filters.min_price">${{ filters.min_price }}+ <button class="filter-tag__remove" @click="filters.min_price = ''; handleSubmit()">×</button></span>
        <span class="filter-tag" v-if="filters.max_price">≤ ${{ filters.max_price }} <button class="filter-tag__remove" @click="filters.max_price = ''; handleSubmit()">×</button></span>
        <button class="filter-bar__clear-all" @click="handleReset">{{ t('products.clear_all') }}</button>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="section">
      <div v-if="productState.loading" class="products-status">
        <div class="spinner" />
        <p>{{ t('products.loading') }}</p>
      </div>

      <template v-else>
        <div v-if="productState.products.length" class="grid-products">
          <ProductCard
            v-for="product in productState.products"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
            @add-to-wishlist="handleAddToWishlist"
          />
        </div>

        <div v-else class="products-empty">
          <svg class="products-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <p class="products-empty__title">{{ t('products.empty') }}</p>
          <p class="products-empty__sub">{{ t('products.empty_hint') }}</p>
        </div>

        <nav v-if="productState.meta.last_page > 1" class="pagination">
          <button class="pagination__btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
            {{ t('products.prev') }}
          </button>
          <button
            v-for="p in productState.meta.last_page"
            :key="p"
            class="pagination__page"
            :class="{ 'pagination__page--active': p === currentPage }"
            @click="goToPage(p)"
          >{{ p }}</button>
          <button class="pagination__btn" :disabled="currentPage >= productState.meta.last_page" @click="goToPage(currentPage + 1)">
            {{ t('products.next') }}
          </button>
        </nav>
      </template>
    </section>
  </div>
</template>

<style scoped>
/* ─── Page Banner ─── */
.page-banner {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: -32px;
  overflow: hidden;
  height: 60vh;
  min-height: 400px;
  max-height: 700px;
}

.page-banner__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.page-banner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(6, 78, 59, 0.65) 0%, rgba(22, 163, 74, 0.45) 100%);
  z-index: 1;
}

.page-banner__inner {
  position: relative;
  display: grid;
  place-items: center;
  align-content: center;
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
  text-align: center;
  z-index: 2;
  height: 100%;
}

.page-banner__eyebrow {
  display: inline-block;
  margin: 0;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.page-banner__title {
  margin: 16px 0 0;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.08;
  color: #fff;
  letter-spacing: -0.02em;
}

.page-banner__lead {
  margin: 14px auto 0;
  max-width: 58ch;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.08rem;
  line-height: 1.65;
}

@media (max-width: 720px) {
  .page-banner {
    min-height: 300px;
    margin-top: -24px;
  }
}

/* ─── Header ─── */
.catalog-header {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
}

.catalog-header__content {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.catalog-header__content h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 1.02;
}

.catalog-header__lead {
  margin: 18px 0 0;
  max-width: 56ch;
  color: var(--muted);
}

.catalog-header__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-content: center;
}

.catalog-stat {
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

.catalog-stat__value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text);
}

.catalog-stat__label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ─── Filter Bar ─── */
.filter-bar {
  display: grid;
  gap: 10px;
}

.filter-bar__form {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-strong);
  padding: 16px 18px;
}

.filter-bar__fields {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.filter-field {
  position: relative;
  flex: 1 1 160px;
  min-width: 0;
}

.filter-field--search {
  flex: 2 1 220px;
}

.filter-field--price {
  flex: 0 1 100px;
}

.filter-field__icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
}

.filter-field__prefix {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 600;
  pointer-events: none;
}

.filter-field__input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.filter-field--search .filter-field__input {
  padding-left: 34px;
}

.filter-field--price .filter-field__input {
  padding-left: 22px;
}

.filter-field__input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent);
}

.filter-field__input::placeholder {
  color: var(--muted);
}

select.filter-field__input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  cursor: pointer;
}

.filter-bar__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 0;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.filter-bar__btn--apply {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.filter-bar__btn--apply:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.filter-bar__btn--clear {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--muted);
}

.filter-bar__btn--clear:hover {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
}

/* ─── Filter Tags ─── */
.filter-bar__tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 0 2px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 600;
}

.filter-tag__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--accent);
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  transition: background 0.15s;
}

.filter-tag__remove:hover {
  background: rgba(0,0,0,0.1);
}

.filter-bar__clear-all {
  background: none;
  border: 0;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  padding: 2px 4px;
  transition: color 0.15s;
}

.filter-bar__clear-all:hover {
  color: var(--accent);
}

/* ─── Status ─── */
.products-status {
  display: grid;
  place-items: center;
  gap: 12px;
  padding: 64px 0;
  color: var(--muted);
}

.products-empty {
  display: grid;
  place-items: center;
  gap: 6px;
  padding: 64px 24px;
  text-align: center;
}

.products-empty__icon {
  width: 40px;
  height: 40px;
  color: var(--line-strong);
  margin-bottom: 6px;
}

.products-empty__title {
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
}

.products-empty__sub {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

/* ─── Pagination ─── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 0 0;
  flex-wrap: wrap;
}

.pagination__btn {
  padding: 8px 16px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.pagination__btn:hover:not(:disabled) {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__page {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.pagination__page:hover {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: var(--accent);
}

.pagination__page--active {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  border-color: transparent;
}

@media (max-width: 1024px) {
  .catalog-header {
    grid-template-columns: 1fr;
  }
  .catalog-header__stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .filter-bar__fields {
    flex-direction: column;
  }
  .filter-field {
    flex: 1 1 auto !important;
    width: 100%;
  }
  .filter-bar__btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
