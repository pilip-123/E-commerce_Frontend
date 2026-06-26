import { reactive } from 'vue';
import api from '@/api/axios';

const state = reactive({
  items: [],
  loading: false,
});

export function useWishlist() {
  return state;
}

export async function fetchWishlist() {
  state.loading = true;

  try {
    const { data } = await api.get('/wishlist');
    state.items = data.data;
    return data;
  } finally {
    state.loading = false;
  }
}

export async function addToWishlist(productId) {
  const { data } = await api.post('/wishlist', { product_id: productId });
  await fetchWishlist();
  return data;
}

export async function removeWishlistItem(itemId) {
  await api.delete(`/wishlist/${itemId}`);
  await fetchWishlist();
}
