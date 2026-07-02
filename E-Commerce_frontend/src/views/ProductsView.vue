<script setup>
import { computed, onMounted, onUnmounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { addToCart } from '@/stores/cart';
import { addToWishlist } from '@/stores/wishlist';
import { fetchCategories, fetchProducts, useProduct } from '@/stores/product';
import { useAuth } from '@/stores/auth';

const router = useRouter();
const productState = useProduct();
const auth = useAuth();

const filters = reactive({
  search: '',
  category_id: '',
  min_price: '',
  max_price: '',
});

const hasFilters = computed(() => filters.search || filters.category_id || filters.min_price || filters.max_price);

async function loadProducts() {
  const params = { ...filters, per_page: 12, status: 1 };
  await fetchProducts(params);
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
  await loadProducts();
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
    <!-- Header -->
    <section class="catalog-header">
      <div class="catalog-header__content">
        <p class="eyebrow">Catalog</p>
        <h1>Products</h1>
        <p class="catalog-header__lead">Browse our full collection. Filter by category or price to find exactly what you need.</p>
      </div>
      <div class="catalog-header__stats">
        <div class="catalog-stat">
          <span class="catalog-stat__value">{{ productState.meta.total }}</span>
          <span class="catalog-stat__label">Products</span>
        </div>
        <div class="catalog-stat">
          <span class="catalog-stat__value">{{ productState.categories.length }}</span>
          <span class="catalog-stat__label">Categories</span>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <section class="filters-section">
      <form class="filters-form" @submit.prevent="handleSubmit">
        <div class="filters-form__row">
          <input v-model="filters.search" class="input" type="search" placeholder="Search products...">
          <select v-model="filters.category_id" class="input">
            <option value="">All categories</option>
            <option v-for="category in productState.categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
          <input v-model="filters.min_price" class="input" type="number" step="0.01" placeholder="Min price">
          <input v-model="filters.max_price" class="input" type="number" step="0.01" placeholder="Max price">
        </div>
        <div class="filters-form__actions flex-col sm:flex-row">
          <button class="btn-icon-filter btn-icon-filter--search" type="submit" title="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button v-if="hasFilters" class="btn-icon-filter btn-icon-filter--clear" type="button" @click="handleReset" title="Clear filters">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </form>
    </section>

    <!-- Products Grid -->
    <section class="section">
      <div v-if="productState.loading" class="products-status">
        <div class="spinner" />
        <p>Loading products...</p>
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
          <p class="products-empty__title">No products found</p>
          <p class="products-empty__sub">Try adjusting your filters or search term.</p>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
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

/* ─── Filters ─── */
.filters-section {
  display: grid;
  gap: 16px;
}

.filters-form {
  display: grid;
  gap: 12px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-strong);
}

.filters-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr 120px 120px;
  gap: 10px;
}

.filters-form__actions {
  display: flex;
  gap: 8px;
}

.btn-icon-filter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn-icon-filter--search {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
}

.btn-icon-filter--search:hover {
  opacity: 0.9;
}

.btn-icon-filter--clear {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--muted);
}

.btn-icon-filter--clear:hover {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
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

@media (max-width: 1024px) {
  .catalog-header {
    grid-template-columns: 1fr;
  }
  .catalog-header__stats {
    grid-template-columns: 1fr 1fr;
  }
  .filters-form__row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .filters-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
