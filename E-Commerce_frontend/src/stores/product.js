import { reactive } from 'vue';
import api from '@/api/axios';

const state = reactive({
  products: [],
  product: null,
  categories: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
  },
  filters: {
    search: '',
    category_id: '',
    min_price: '',
    max_price: '',
    status: 1,
  },
  loading: false,
});

export function useProduct() {
  return state;
}

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  state.categories = data.data;
  return state.categories;
}

export async function fetchProducts(params = {}) {
  state.loading = true;

  try {
    const { data } = await api.get('/products', { params });
    state.products = data.data;
    state.meta = data.meta;
    return data;
  } finally {
    state.loading = false;
  }
}

export async function fetchProduct(slug) {
  const { data } = await api.get(`/products/${slug}`);
  state.product = data.data;
  return state.product;
}
