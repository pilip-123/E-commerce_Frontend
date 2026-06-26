<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CartItem from '@/components/CartItem.vue';
import { formatCurrency } from '@/utils/format';
import {
  fetchCart,
  removeCartItem,
  updateCartItem,
  useCart,
} from '@/stores/cart';

const router = useRouter();
const cartState = useCart();

const total = computed(() => formatCurrency(cartState.total));

onMounted(async () => {
  await fetchCart();
});

async function increase(item) {
  await updateCartItem(item.id, item.quantity + 1);
}

async function decrease(item) {
  if (item.quantity <= 1) {
    await removeCartItem(item.id);
    return;
  }

  await updateCartItem(item.id, item.quantity - 1);
}

async function handleRemove(item) {
  await removeCartItem(item.id);
}
</script>

<template>
  <div class="page">
    <section class="section">
      <div class="section__header">
        <div>
          <p class="eyebrow">Cart</p>
          <h2>Your cart</h2>
        </div>
        <RouterLink class="button button--ghost" to="/products">Shop more</RouterLink>
      </div>

      <div class="stack">
        <CartItem
          v-for="item in cartState.items"
          :key="item.id"
          :item="item"
          @increase="increase"
          @decrease="decrease"
          @remove="handleRemove"
        />
      </div>

      <div v-if="!cartState.items.length" class="empty-state">
        Cart is empty.
      </div>
    </section>

    <section class="panel checkout-summary">
      <h3>Summary</h3>
      <p>Total: <strong>{{ total }}</strong></p>
      <button class="button" type="button" :disabled="!cartState.items.length" @click="router.push({ name: 'checkout' })">
        Checkout
      </button>
    </section>
  </div>
</template>
