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
          <button class="button button--ghost min-w-[44px] min-h-[44px]" type="button" @click="emit('decrease', item)">-</button>
          <span>{{ item?.quantity ?? 1 }}</span>
          <button class="button button--ghost min-w-[44px] min-h-[44px]" type="button" @click="emit('increase', item)">+</button>
          <button class="button button--secondary min-h-[44px]" type="button" @click="emit('remove', item)">Delete</button>
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
</style>
