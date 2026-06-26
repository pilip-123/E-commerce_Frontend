import { createRouter, createWebHashHistory } from 'vue-router';

import HomeView from '../views/HomeView.vue';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import WishlistView from '../views/WishlistView.vue';
import CartView from '../views/CartView.vue';
import CheckoutView from '../views/CheckoutView.vue';
import OrdersView from '../views/OrdersView.vue';
import ProfileView from '../views/ProfileView.vue';
import CategoriesView from '../views/CategoriesView.vue';
import PromotionsView from '../views/PromotionsView.vue';
import { fetchCurrentUser, useAuth } from '../stores/auth';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/products', name: 'products', component: ProductsView },
  { path: '/products/:slug', name: 'product-detail', component: ProductDetailView, props: true },
  { path: '/categories', name: 'categories', component: CategoriesView },
  { path: '/promotions', name: 'promotions', component: PromotionsView },
  { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
  { path: '/register', name: 'register', component: RegisterView, meta: { guestOnly: true } },
  { path: '/wishlist', name: 'wishlist', component: WishlistView, meta: { requiresAuth: true } },
  { path: '/cart', name: 'cart', component: CartView, meta: { requiresAuth: true } },
  { path: '/checkout', name: 'checkout', component: CheckoutView, meta: { requiresAuth: true } },
  { path: '/orders', name: 'orders', component: OrdersView, meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuth();

  if (auth.token && !auth.user && !auth.ready) {
    try {
      await fetchCurrentUser();
    } catch (error) {
      // If the token is invalid, the fetch helper clears local auth state.
    }
  }

  if (to.meta.requiresAuth && !auth.token) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.guestOnly && auth.token) {
    return { name: 'home' };
  }

  return true;
});

export default router;
