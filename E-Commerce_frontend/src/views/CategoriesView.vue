<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { fetchCategories, useProduct } from '@/stores/product';
import { useLocale } from '@/composables/useLocale';

const productState = useProduct();
const { t } = useLocale();
const currentPage = ref(1);
const cm = () => productState.categoryMeta;

const totalProducts = computed(() =>
  productState.categories.reduce((sum, c) => sum + (c.products_count ?? 0), 0)
);

async function loadCategories(page = 1) {
  currentPage.value = page;
  await fetchCategories({ page, per_page: 10 });
}

function goToPage(page) {
  if (page < 1 || page > cm().last_page) return;
  loadCategories(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => loadCategories(1));
</script>

<template>
  <div class="page">
    <section class="cat-header">
      <div class="cat-header__content">
        <p class="eyebrow">{{ t('categories.all') }}</p>
        <h1>{{ t('categories.title') }}</h1>
        <p class="cat-header__lead">{{ t('categories.subtitle') }}</p>
      </div>
      <div class="cat-header__stats">
        <div class="cat-stat">
          <span class="cat-stat__value">{{ productState.categories.length }}</span>
          <span class="cat-stat__label">{{ t('categories.count') }}</span>
        </div>
        <div class="cat-stat">
          <span class="cat-stat__value">{{ totalProducts }}</span>
          <span class="cat-stat__label">{{ t('products.count') }}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">{{ t('categories.overview') }}</p>
          <h2>{{ t('categories.all') }}</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/products">{{ t('categories.all_products') }}</RouterLink>
      </div>

      <div v-if="productState.categories.length" class="cat-grid">
        <RouterLink
          v-for="category in productState.categories"
          :key="category.id"
          class="cat-card"
          :to="{ name: 'products', query: { category_id: category.id } }"
        >
          <div class="cat-card__head">
            <div class="cat-card__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </div>
            <div>
              <strong class="cat-card__name">{{ category.name }}</strong>
              <span class="cat-card__slug">{{ category.slug }}</span>
            </div>
          </div>
          <p class="cat-card__desc">{{ category.description || t('general.no_data') }}</p>
          <div class="cat-card__foot">
            <span class="cat-card__count">{{ category.products_count ?? 0 }} {{ t('products.title') }}</span>
            <span class="cat-card__action">{{ t('categories.action') }}</span>
          </div>
        </RouterLink>
      </div>

      <nav v-if="cm().last_page > 1" class="pagination">
        <button class="pagination__btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
          {{ t('categories.prev') }}
        </button>
        <button
          v-for="p in cm().last_page"
          :key="p"
          class="pagination__page"
          :class="{ 'pagination__page--active': p === currentPage }"
          @click="goToPage(p)"
        >{{ p }}</button>
        <button class="pagination__btn" :disabled="currentPage >= cm().last_page" @click="goToPage(currentPage + 1)">
          {{ t('categories.next') }}
        </button>
      </nav>

      <div v-else class="cat-empty">
        <svg class="cat-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16v16H4z" />
          <line x1="4" y1="8" x2="20" y2="8" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="16" x2="20" y2="16" />
        </svg>
        <p class="cat-empty__title">{{ t('categories.empty') }}</p>
        <p class="cat-empty__sub">{{ t('categories.empty_hint') }}</p>
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

/* ─── Category Cards ─── */
.cat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.cat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: var(--shadow);
  text-decoration: none;
  transition: all 0.2s;
}

.cat-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.cat-card__head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.cat-card__icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--accent-soft);
  color: var(--accent);
  flex-shrink: 0;
}

.cat-card__name {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text);
}

.cat-card__slug {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted);
  margin-top: 1px;
}

.cat-card__desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cat-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--line);
}

.cat-card__count {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-soft);
  padding: 3px 12px;
  border-radius: 999px;
}

.cat-card__action {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--muted);
  transition: color 0.15s;
}

.cat-card:hover .cat-card__action {
  color: var(--accent);
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

/* ─── Pagination ─── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 20px;
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
  .cat-header {
    grid-template-columns: 1fr;
  }
  .cat-header__stats {
    grid-template-columns: 1fr 1fr;
  }
  .cat-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}

@media (max-width: 640px) {
  .cat-grid {
    grid-template-columns: 1fr;
  }
}
</style>
