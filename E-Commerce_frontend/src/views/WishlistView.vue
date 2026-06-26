<script setup>
import { onMounted } from 'vue';
import WishlistItem from '@/components/WishlistItem.vue';
import { addToCart } from '@/stores/cart';
import { fetchWishlist, removeWishlistItem, useWishlist } from '@/stores/wishlist';

const wishlistState = useWishlist();

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
      <div class="section__header">
        <div>
          <p class="eyebrow">Wishlist</p>
          <h2>Saved items</h2>
        </div>
        <RouterLink class="button button--ghost" to="/products">Products</RouterLink>
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
        Nothing saved yet.
      </div>
    </section>
  </div>
</template>
