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
        <RouterLink class="button button--ghost w-full sm:w-auto" :to="{ name: 'product-detail', params: { id: product?.id } }">
          View
        </RouterLink>
        <button class="button w-full sm:w-auto" type="button" :disabled="outOfStock" @click="emit('add-to-cart', product)" :style="outOfStock ? 'background:#94a3b8;cursor:not-allowed;opacity:0.5;' : ''">Cart</button>
        <button class="button button--secondary w-full sm:w-auto" type="button" @click="emit('add-to-wishlist', product)">
          Save
        </button>
        <template v-if="admin">
          <button class="button button--ghost w-full sm:w-auto" type="button" @click="emit('edit', product)">Edit</button>
          <button class="button button--secondary w-full sm:w-auto" type="button" @click="emit('delete', product)">Delete</button>
        </template>
      </div>
    </div>
  </article>
</template>

<style scoped>
.product-card {
  position: relative;
}

.product-card--oos {
  opacity: 0.6;
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
}

.product-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #dc2626;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 6px;
  line-height: 1;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.35);
}

.product-card__badge--oos {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #64748b;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  line-height: 1;
  letter-spacing: 0.02em;
  z-index: 1;
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
  font-size: 1rem;
}

.price-regular {
  color: var(--accent);
  font-size: 1rem;
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
</style>
