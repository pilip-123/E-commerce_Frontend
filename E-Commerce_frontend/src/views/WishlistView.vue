<script setup>
import { onMounted } from 'vue';
import WishlistItem from '@/components/WishlistItem.vue';
import { addToCart } from '@/stores/cart';
import { fetchWishlist, removeWishlistItem, useWishlist } from '@/stores/wishlist';
import { useLocale } from '@/composables/useLocale';

const wishlistState = useWishlist();

const { t } = useLocale();

onMounted(async () => {
  await fetchWishlist();
});

async function handleAddToCart(item) {
  await addToCart(item.product.id);
}

async function handleRemove(item) {
  await removeWishlistItem(item.id);
}
</script>

<template>
  <div class="page">
    <section class="section">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">{{ t('wishlist.title') }}</p>
          <h2>{{ t('wishlist.title') }}</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/products">{{ t('products.title') }}</RouterLink>
      </div>

      <div class="stack">
        <WishlistItem
          v-for="item in wishlistState.items"
          :key="item.id"
          :item="item"
          @add-to-cart="handleAddToCart"
          @remove="handleRemove"
        />
      </div>

      <div v-if="!wishlistState.items.length" class="empty-state">
        {{ t('wishlist.empty') }}
      </div>
    </section>
  </div>
</template>
