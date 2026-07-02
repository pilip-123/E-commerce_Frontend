<script setup>
import { computed } from 'vue';
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  item: { type: Object, default: null },
});

const emit = defineEmits(['increase', 'decrease', 'remove']);

const effectivePrice = computed(() => {
  return props.item?.product?.discount_price ?? props.item?.product?.price ?? 0;
});

const subtotal = computed(() => effectivePrice.value * (props.item?.quantity ?? 1));

const discountLabel = computed(() => {
  if (!props.item?.product?.has_discount) return null;
  return `-${Math.round((1 - props.item.product.discount_price / props.item.product.price) * 100)}%`;
});
</script>

<template>
  <article class="line-item">
    <div class="line-item__image-wrap">
      <img v-if="item?.product?.image" :src="item.product.image" :alt="item.product.name" class="line-item__image" loading="lazy">
      <span v-if="discountLabel" class="line-item__badge">{{ discountLabel }}</span>
    </div>
    <div class="line-item__body">
      <div>
        <h3>{{ item?.product?.name ?? 'Cart Item' }}</h3>
        <p v-if="item?.product?.has_discount" class="line-item__price">
          <s class="text-muted">{{ formatCurrency(item?.product?.price) }}</s>
          <strong class="text-danger ms-1">{{ formatCurrency(effectivePrice) }}</strong>
        </p>
        <p v-else>{{ formatCurrency(effectivePrice) }}</p>
      </div>
      <div class="line-item__right">
        <div class="line-item__controls">
          <button class="qty-btn" type="button" @click="emit('decrease', item)" title="Decrease">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          <span>{{ item?.quantity ?? 1 }}</span>
          <button class="qty-btn" type="button" @click="emit('increase', item)" title="Increase">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </button>
          <button class="delete-btn" type="button" @click="emit('remove', item)" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
        <strong class="line-item__subtotal">{{ formatCurrency(subtotal) }}</strong>
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-item__image-wrap {
  position: relative;
  flex-shrink: 0;
}

.line-item__badge {
  position: absolute;
  top: 6px;
  left: 6px;
  background: #dc2626;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  line-height: 1;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.35);
}

.line-item__price {
  margin: 0;
}

.line-item__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.line-item__subtotal {
  font-size: 0.95rem;
  white-space: nowrap;
}

.qty-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.qty-btn:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.delete-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  transition: background 0.15s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.08);
}
</style>
