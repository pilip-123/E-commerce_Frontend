<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProductCard from '@/components/ProductCard.vue';
import { fetchCategories, fetchProducts, useProduct } from '@/stores/product';
import { addToCart } from '@/stores/cart';
import { addToWishlist } from '@/stores/wishlist';
import { useAuth } from '@/stores/auth';

const router = useRouter();
const productState = useProduct();
const auth = useAuth();

const topProducts = computed(() => productState.products.slice(0, 3));

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchProducts({ per_page: 3, status: 1 }),
  ]);
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
    <!-- Hero -->
    <section class="hero-section">
      <div class="hero-section__content">
        <p class="eyebrow">Welcome</p>
        <h1>Shop green. Shop fast.</h1>
        <p class="hero-section__lead">Discover our curated collection of products. Browse, save to your wishlist, and checkout in just a few clicks.</p>
        <div class="hero-section__actions">
          <RouterLink class="button w-full sm:w-auto" to="/products">Browse Products</RouterLink>
          <RouterLink class="button button--ghost w-full sm:w-auto" to="/categories">Categories</RouterLink>
        </div>
      </div>
      <div class="hero-section__visual">
        <div class="hero-section__stats">
          <div class="hero-stat">
            <span class="hero-stat__value">{{ productState.products.length }}</span>
            <span class="hero-stat__label">Products</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat__value">{{ productState.categories.length }}</span>
            <span class="hero-stat__label">Categories</span>
          </div>
          <div class="hero-stat">
            <span class="hero-stat__value">Live</span>
            <span class="hero-stat__label">Catalog</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="section">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">Categories</p>
          <h2>Browse categories</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/categories">View all</RouterLink>
      </div>

      <div v-if="productState.categories.length" class="chip-grid">
        <article v-for="category in productState.categories" :key="category.id" class="chip-card">
          <strong>{{ category.name }}</strong>
          <span>{{ category.products_count ?? 0 }} products</span>
        </article>
      </div>

      <div v-else class="empty-state">
        <p>Loading categories...</p>
      </div>
    </section>

    <!-- Featured Products (3 only) -->
    <section class="section">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">Featured</p>
          <h2>Featured picks</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/products">View all</RouterLink>
      </div>

      <div v-if="productState.loading" class="empty-state">
        <p>Loading products...</p>
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
        <p>No products available yet.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Hero ─── */
.hero-section {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
}

.hero-section__content {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.hero-section__content h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 1.02;
}

.hero-section__lead {
  margin: 18px 0 0;
  max-width: 58ch;
  color: var(--muted);
}

.hero-section__actions {
  margin-top: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-section__visual {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--accent-soft);
  box-shadow: var(--shadow);
  padding: 32px;
  display: grid;
  align-content: center;
}

.hero-section__stats {
  display: grid;
  gap: 16px;
}

.hero-stat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
}

.hero-stat__value {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text);
}

.hero-stat__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ─── 3-column grid ─── */
.grid-products--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 1024px) {
  .hero-section {
    grid-template-columns: 1fr;
  }
  .grid-products--3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid-products--3 {
    grid-template-columns: 1fr;
  }
}
</style>
