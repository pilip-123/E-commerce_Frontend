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
        <button class="button" type="button" @click="emit('add-to-cart', item)">Cart</button>
        <button class="button button--secondary" type="button" @click="emit('remove', item)">Delete</button>
      </div>
    </div>
  </article>
</template>
