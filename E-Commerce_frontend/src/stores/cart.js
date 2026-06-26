import { reactive } from 'vue';
import api from '@/api/axios';

const state = reactive({
  items: [],
  total: 0,
  loading: false,
});

export function useCart() {
  return state;
}

export async function fetchCart() {
  state.loading = true;

  try {
    const { data } = await api.get('/cart');
    state.items = data.data;
    state.total = data.total ?? 0;
    return data;
  } finally {
    state.loading = false;
  }
}

export async function addToCart(productId, quantity = 1) {
  const { data } = await api.post('/cart', {
    product_id: productId,
    quantity,
  });

  await fetchCart();
  return data;
}

export async function updateCartItem(itemId, quantity) {
  const { data } = await api.patch(`/cart/${itemId}`, { quantity });
  await fetchCart();
  return data;
}

export async function removeCartItem(itemId) {
  await api.delete(`/cart/${itemId}`);
  await fetchCart();
}

export async function clearCart() {
  await api.delete('/cart');
  state.items = [];
  state.total = 0;
}
