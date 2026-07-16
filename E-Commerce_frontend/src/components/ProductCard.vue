<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  product: { type: Object, default: null },
  admin: { type: Boolean, default: false },
});

const emit = defineEmits(['add-to-cart', 'add-to-wishlist', 'edit', 'delete']);

const discountLabel = computed(() => {
  if (!props.product?.has_discount || !props.product?.promotion) return null;
  const p = props.product.promotion;
  if (p.discount_type === 'percentage') {
    return `-${p.discount_value}%`;
  }
  return `-${formatCurrency(p.discount_value)}`;
});

const savingsPercent = computed(() => {
  if (!props.product?.has_discount || !props.product?.price) return null;
  const saved = props.product.price - props.product.discount_price;
  return Math.round((saved / props.product.price) * 100);
});

const outOfStock = computed(() => !props.product?.stock || props.product.stock < 1);
</script>

<template>
  <article class="product-card" :class="{ 'product-card--oos': outOfStock }">
    <div class="product-card__image">
        <img
          v-if="product?.image"
          :src="product.image"
          :alt="product.name"
          loading="lazy"
        >
      <div v-else class="product-card__placeholder">No image</div>
      <span v-if="discountLabel" class="product-card__badge">{{ discountLabel }}</span>
      <span v-if="outOfStock" class="product-card__badge--oos">Out of stock</span>
    </div>

    <div class="product-card__body">
      <p class="product-card__category">{{ product?.category?.name ?? 'Category' }}</p>
      <h3 class="product-card__title">{{ product?.name ?? 'Product' }}</h3>
      <p class="product-card__text">{{ product?.description ?? 'Ready to buy.' }}</p>

      <div class="product-card__meta">
        <template v-if="product?.has_discount">
          <div class="price-discount">
            <s class="price-old">{{ formatCurrency(product?.price) }}</s>
            <strong class="price-new">{{ formatCurrency(product?.discount_price) }}</strong>
          </div>
          <span class="price-save" v-if="savingsPercent">Save {{ savingsPercent }}%</span>
        </template>
        <strong v-else class="price-regular">{{ formatCurrency(product?.price) }}</strong>
        <span class="stock-info" :class="{ 'stock-info--oos': outOfStock }">{{ outOfStock ? 'Out of stock' : product?.stock + ' in stock' }}</span>
      </div>

      <div class="product-card__actions">
        <button class="btn-icon btn-icon--cart" type="button" :disabled="outOfStock" @click="emit('add-to-cart', product)" :title="outOfStock ? 'Out of stock' : 'Add to cart'">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
        <button class="btn-icon btn-icon--wish" type="button" @click="emit('add-to-wishlist', product)" title="Save to wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        <RouterLink class="btn-icon" :to="{ name: 'product-detail', params: { id: product?.id } }" title="View details">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
          </svg>
        </RouterLink>
        <template v-if="admin">
          <button class="btn-icon" type="button" @click="emit('edit', product)" title="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
          <button class="btn-icon btn-icon--danger" type="button" @click="emit('delete', product)" title="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </template>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 32px 60px rgba(22, 163, 74, 0.14);
}

.product-card--oos {
  opacity: 0.55;
}

.product-card--oos .product-card__image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: #94a3b8;
  opacity: 0.15;
  border-radius: inherit;
}

.product-card__image {
  position: relative;
  overflow: hidden;
}

.product-card__image img {
  transition: transform 0.4s ease;
}

.product-card:hover .product-card__image img {
  transform: scale(1.05);
}

.product-card__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 6px 12px;
  border-radius: 8px;
  line-height: 1;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  z-index: 2;
}

.product-card__badge--oos {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #64748b, #475569);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 5px 10px;
  border-radius: 8px;
  line-height: 1;
  letter-spacing: 0.02em;
  z-index: 2;
  box-shadow: 0 4px 12px rgba(100, 116, 139, 0.35);
}

.product-card__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 12px;
}

.price-old {
  color: #9ca3af;
  font-size: 0.85rem;
  margin-right: 4px;
}

.price-new {
  color: #dc2626;
  font-size: 1.1rem;
}

.price-regular {
  color: var(--accent);
  font-size: 1.1rem;
}

.price-save {
  background: rgba(220, 38, 38, 0.10);
  color: #dc2626;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 999px;
}

.stock-info {
  font-size: 0.72rem;
  font-weight: 600;
  color: #15803d;
}

.stock-info--oos {
  color: #dc2626;
  font-weight: 700;
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 36px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.18s ease;
  text-decoration: none;
  flex-shrink: 0;
}

.btn-icon:hover {
  background: var(--accent-soft);
  color: var(--accent);
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.btn-icon:active {
  transform: translateY(0) scale(0.93);
}

.btn-icon:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
  transform: none;
  box-shadow: none;
}

.btn-icon--cart {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 14px -4px rgba(34, 197, 94, 0.4);
}

.btn-icon--cart:hover {
  opacity: 0.92;
  color: #fff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -4px rgba(34, 197, 94, 0.5);
}

.btn-icon--wish:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  border-color: #dc2626;
}

.btn-icon--danger:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
  border-color: #dc2626;
}
</style>
