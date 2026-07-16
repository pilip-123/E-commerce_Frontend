import { reactive } from 'vue';
import api from '@/api/axios';

const state = reactive({
  products: [],
  product: null,
  categories: [],
  meta: {
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
  },
  categoryMeta: {
    current_page: 1,
    last_page: 1,
    per_page: 10,
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

export async function fetchCategories(params = {}) {
  const { data } = await api.get('/categories', { params });
  state.categories = data.data;
  state.categoryMeta = data.meta;
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

export async function fetchProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  state.product = data.data;
  return state.product;
}
