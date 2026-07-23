<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import CartItem from '@/components/CartItem.vue';
import ProductCard from '@/components/ProductCard.vue';
import { formatCurrency } from '@/utils/format';
import api from '@/api/axios';
import {
  fetchCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  useCart,
} from '@/stores/cart';
import { useAuth } from '@/stores/auth';
import { addToWishlist } from '@/stores/wishlist';
import { useLocale } from '@/composables/useLocale';

const router = useRouter();
const auth = useAuth();
const cartState = useCart();

const promoState = reactive({
  promotions: [],
  loading: false,
});

const discountCode = ref('');
const discountApplied = ref(loadDiscount());
const discountError = ref('');
const applyingDiscount = ref(false);

const { t } = useLocale();

function loadDiscount() {
  try {
    return JSON.parse(localStorage.getItem('cart_discount') || 'null');
  } catch {
    return null;
  }
}

function saveDiscount(d) {
  if (d) {
    localStorage.setItem('cart_discount', JSON.stringify(d));
  } else {
    localStorage.removeItem('cart_discount');
  }
}

const originalTotal = computed(() => cartState.total);

const discountAmount = computed(() => {
  if (!discountApplied.value) return 0;
  const total = cartState.total;
  if (discountApplied.value.type === 'percentage') {
    return total * (discountApplied.value.value / 100);
  }
  return Math.min(discountApplied.value.value, total);
});

const finalTotal = computed(() => formatCurrency(cartState.total - discountAmount.value));

const total = computed(() => formatCurrency(cartState.total));

const promoProducts = computed(() => {
  const seen = new Set();
  const products = [];
  for (const promo of promoState.promotions) {
    if (!promo.products) continue;
    for (const product of promo.products) {
      if (!seen.has(product.id)) {
        seen.add(product.id);
        products.push({ ...product, promotion: promo, has_discount: true });
      }
    }
  }
  return products;
});

let refreshTimer;

onMounted(async () => {
  await fetchCart();
  await fetchPromotions();
  refreshTimer = setInterval(() => {
    fetchCart();
    fetchPromotions();
  }, 30000);
});

onUnmounted(() => {
  clearInterval(refreshTimer);
});

async function fetchPromotions() {
  promoState.loading = true;
  try {
    const { data } = await api.get('/promotions/active');
    promoState.promotions = data.data ?? [];
  } catch {
    promoState.promotions = [];
  } finally {
    promoState.loading = false;
  }
}

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

async function handleAddToCart(product) {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  await addToCart(product.id, 1);
}

async function handleAddToWishlist(product) {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: router.currentRoute.value.fullPath } });
    return;
  }
  await addToWishlist(product.id);
}

async function applyDiscount() {
  const code = discountCode.value.trim().toUpperCase();
  if (!code) return;

  if (!code.startsWith('VIP-') || code.length < 8) {
    discountError.value = 'Invalid VIP code format.';
    return;
  }

  applyingDiscount.value = true;
  discountError.value = '';

  try {
    const { data } = await api.post('/check-discount', { code });
    const applied = { type: data.type, value: data.value, code };
    discountApplied.value = applied;
    saveDiscount(applied);
    discountError.value = '';
  } catch (e) {
    discountApplied.value = null;
    saveDiscount(null);
    discountError.value = e.response?.data?.message || 'Invalid or expired code.';
  } finally {
    applyingDiscount.value = false;
  }
}

function removeDiscount() {
  discountApplied.value = null;
  discountCode.value = '';
  discountError.value = '';
  saveDiscount(null);
}
</script>

<template>
  <div class="page">
    <section class="section">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">{{ t('cart.title') }}</p>
          <h2>{{ t('cart.title') }}</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/products">{{ t('cart.continue') }}</RouterLink>
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
        {{ t('cart.empty') }}
      </div>
    </section>

    <section class="panel checkout-summary">
      <h3>{{ t('checkout.order_summary') }}</h3>

      <div class="mb-4">
        <p class="text-xs font-semibold uppercase tracking-wide mb-2" style="color: #16a34a;">{{ t('promotions.discount') }}</p>
        <div v-if="!discountApplied" class="flex gap-2">
          <input
            v-model="discountCode"
            type="text"
            :placeholder="t('general.search')"
            class="input flex-1"
            @keyup.enter="applyDiscount"
          >
          <button class="discount-apply-btn" type="button" :disabled="applyingDiscount || !discountCode.trim()" @click="applyDiscount" :title="t('general.submit')">
            <svg v-if="applyingDiscount" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
        <div v-else class="flex items-center gap-2 rounded-lg px-3 py-2" style="background: #f0fdf4;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          <span class="text-sm font-semibold flex-1" style="color: #065f46;">{{ discountApplied.code }}</span>
          <button class="discount-remove-btn" type="button" @click="removeDiscount" :title="t('general.delete')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p v-if="discountError" class="text-xs mt-1" style="color: #dc2626;">{{ discountError }}</p>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted">{{ t('cart.total') }}</span>
          <span>{{ total }}</span>
        </div>
        <div v-if="discountApplied" class="flex justify-between text-sm">
          <span class="text-muted">{{ t('promotions.discount') }}</span>
          <span style="color: #16a34a;">-{{ formatCurrency(discountAmount) }}</span>
        </div>
        <div class="flex justify-between font-bold pt-2 border-t" style="border-color: var(--line);">
          <span>{{ t('cart.total') }}</span>
          <span>{{ discountApplied ? finalTotal : total }}</span>
        </div>
      </div>

      <button class="button mt-4" type="button" :disabled="!cartState.items.length" @click="router.push({ name: 'checkout' })">
        {{ t('cart.checkout') }}
      </button>
    </section>

    <section v-if="promoProducts.length" class="section cart-promo">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">{{ t('promotions.title') }}</p>
          <h2>{{ t('promotions.title') }}</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/promotions">{{ t('general.view') }}</RouterLink>
      </div>

      <div class="grid-products">
        <ProductCard
          v-for="product in promoProducts"
          :key="product.id"
          :product="product"
          @add-to-cart="handleAddToCart"
          @add-to-wishlist="handleAddToWishlist"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.cart-promo {
  margin-top: 12px;
}

.discount-apply-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  cursor: pointer;
  transition: opacity 0.15s;
}

.discount-apply-btn:hover {
  opacity: 0.9;
}

.discount-apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.discount-remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #dc2626;
  cursor: pointer;
  transition: background 0.15s;
}

.discount-remove-btn:hover {
  background: rgba(220, 38, 38, 0.08);
}

@media (max-width: 640px) {
  .page {
    gap: 16px;
  }

  .checkout-summary {
    padding: 20px;
  }

  .checkout-summary h3 {
    font-size: 1rem;
    margin-bottom: 12px;
  }

  .checkout-summary .button {
    width: 100%;
  }

  .discount-apply-btn {
    height: 40px;
    width: 48px;
    flex-shrink: 0;
  }

  .grid-products {
    gap: 14px;
  }
}
</style>
