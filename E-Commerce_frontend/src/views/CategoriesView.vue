<script setup>
import { computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { fetchCategories, useProduct } from '@/stores/product';

const productState = useProduct();

const totalProducts = computed(() =>
  productState.categories.reduce((sum, c) => sum + (c.products_count ?? 0), 0)
);

onMounted(fetchCategories);
</script>

<template>
  <div class="page">
    <section class="cat-header">
      <div class="cat-header__content">
        <p class="eyebrow">Categories</p>
        <h1>Browse by category</h1>
        <p class="cat-header__lead">All product categories organized in one view. Click any category to browse its products.</p>
      </div>
      <div class="cat-header__stats">
        <div class="cat-stat">
          <span class="cat-stat__value">{{ productState.categories.length }}</span>
          <span class="cat-stat__label">Categories</span>
        </div>
        <div class="cat-stat">
          <span class="cat-stat__value">{{ totalProducts }}</span>
          <span class="cat-stat__label">Products</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">Overview</p>
          <h2>All categories</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/products">All Products</RouterLink>
      </div>

      <div v-if="productState.categories.length" class="cat-table-wrap overflow-x-auto">
        <table class="cat-table min-w-[640px]">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th class="col-name">Name</th>
              <th class="col-desc">Description</th>
              <th class="col-count">Products</th>
              <th class="col-action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, idx) in productState.categories" :key="category.id">
              <td class="col-num">{{ idx + 1 }}</td>
              <td class="col-name">
                <strong>{{ category.name }}</strong>
                <span class="slug">{{ category.slug }}</span>
              </td>
              <td class="col-desc">{{ category.description ?? '—' }}</td>
              <td class="col-count">
                <span class="count-badge">{{ category.products_count ?? 0 }}</span>
              </td>
              <td class="col-action">
                <RouterLink
                  class="btn-link"
                  :to="{ name: 'products', query: { category_id: category.id } }"
                >
                  Browse →
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="cat-empty">
        <svg class="cat-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16v16H4z" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="16" x2="20" y2="16" />
        </svg>
        <p class="cat-empty__title">No categories yet</p>
        <p class="cat-empty__sub">Categories will appear here once they are created.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Header ─── */
.cat-header {
  display: grid;
  grid-template-columns: 1.3fr 0.9fr;
  gap: 24px;
}

.cat-header__content {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: var(--shadow);
  padding: 32px;
}

.cat-header__content h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.8rem);
  line-height: 1.02;
}

.cat-header__lead {
  margin: 18px 0 0;
  max-width: 56ch;
  color: var(--muted);
}

.cat-header__stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-content: center;
}

.cat-stat {
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

.cat-stat__value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text);
}

.cat-stat__label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* ─── Table ─── */
.cat-table-wrap {
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: var(--surface-strong);
  box-shadow: var(--shadow);
}

.cat-table {
  width: 100%;
  border-collapse: collapse;
}

.cat-table thead {
  background: var(--accent-soft);
}

.cat-table th {
  padding: 16px 20px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  text-align: left;
  border-bottom: 1px solid var(--line);
}

.cat-table td {
  padding: 16px 20px;
  font-size: 0.88rem;
  color: var(--text);
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.cat-table tbody tr:last-child td {
  border-bottom: none;
}

.cat-table tbody tr:hover {
  background: var(--bg);
}

/* ─── Columns ─── */
.col-num {
  width: 56px;
  color: var(--muted);
  font-weight: 600;
}

.col-name {
  min-width: 180px;
}

.col-name strong {
  display: block;
  font-size: 0.95rem;
}

.col-name .slug {
  display: block;
  font-size: 0.72rem;
  color: var(--muted);
  font-weight: 500;
  margin-top: 2px;
}

.col-desc {
  color: var(--muted);
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.col-count {
  width: 100px;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 3px 12px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 0.8rem;
  font-weight: 700;
}

.col-action {
  width: 120px;
}

.btn-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.15s;
}

.btn-link:hover {
  background: var(--accent-soft);
}

/* ─── Empty ─── */
.cat-empty {
  display: grid;
  place-items: center;
  gap: 6px;
  padding: 64px 24px;
  text-align: center;
}

.cat-empty__icon {
  width: 40px;
  height: 40px;
  color: var(--line-strong);
  margin-bottom: 6px;
}

.cat-empty__title {
  margin: 0;
  font-weight: 700;
  font-size: 1rem;
  color: var(--text);
}

.cat-empty__sub {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
}

@media (max-width: 1024px) {
  .cat-header {
    grid-template-columns: 1fr;
  }
  .cat-header__stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .col-desc {
    display: none;
  }
}
</style>
