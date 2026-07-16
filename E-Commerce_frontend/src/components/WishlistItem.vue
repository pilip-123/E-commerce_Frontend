<script setup>
import { formatCurrency } from '@/utils/format';

defineProps({
  item: { type: Object, default: null },
});

const emit = defineEmits(['add-to-cart', 'remove']);
</script>

<template>
  <article class="line-item">
    <img v-if="item?.product?.image" :src="item.product.image" :alt="item.product.name" class="line-item__image" loading="lazy">
    <div class="line-item__body">
      <div>
        <h3>{{ item?.product?.name ?? 'Wishlist Item' }}</h3>
        <p>{{ formatCurrency(item?.product?.price) }}</p>
      </div>
      <div class="line-item__controls">
        <button class="wish-cart-btn" type="button" @click="emit('add-to-cart', item)" title="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
        <button class="wish-del-btn" type="button" @click="emit('remove', item)" title="Remove">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.wish-cart-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
  box-shadow: 0 4px 12px -4px rgba(34, 197, 94, 0.4);
}

.wish-cart-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.wish-cart-btn:active {
  transform: translateY(0) scale(0.95);
}

.wish-del-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 24px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.wish-del-btn:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
}

.wish-del-btn:active {
  transform: scale(0.95);
}
</style>
