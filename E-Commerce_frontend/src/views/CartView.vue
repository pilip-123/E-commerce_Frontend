<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import CartItem from '@/components/CartItem.vue';
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
        products.push({ ...product, promotion: promo });
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

function discountLabel(promotion) {
  if (promotion.discount_type === 'percentage') return `-${promotion.discount_value}%`;
  return `-${formatCurrency(promotion.discount_value)}`;
}

function goToProduct(product) {
  router.push({ name: 'product-detail', params: { id: product.id } });
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
          <p class="eyebrow">Cart</p>
          <h2>Your cart</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/products">Shop more</RouterLink>
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

      <div class="mb-4">
        <p class="text-xs font-semibold uppercase tracking-wide mb-2" style="color: #16a34a;">Discount Code</p>
        <div v-if="!discountApplied" class="flex gap-2">
          <input
            v-model="discountCode"
            type="text"
            placeholder="Enter VIP code..."
            class="input flex-1"
            @keyup.enter="applyDiscount"
          >
          <button class="discount-apply-btn" type="button" :disabled="applyingDiscount || !discountCode.trim()" @click="applyDiscount" title="Apply discount">
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
          <button class="discount-remove-btn" type="button" @click="removeDiscount" title="Remove discount">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <p v-if="discountError" class="text-xs mt-1" style="color: #dc2626;">{{ discountError }}</p>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between text-sm">
          <span class="text-muted">Subtotal</span>
          <span>{{ total }}</span>
        </div>
        <div v-if="discountApplied" class="flex justify-between text-sm">
          <span class="text-muted">Discount</span>
          <span style="color: #16a34a;">-{{ formatCurrency(discountAmount) }}</span>
        </div>
        <div class="flex justify-between font-bold pt-2 border-t" style="border-color: var(--line);">
          <span>Total</span>
          <span>{{ discountApplied ? finalTotal : total }}</span>
        </div>
      </div>

      <button class="button mt-4" type="button" :disabled="!cartState.items.length" @click="router.push({ name: 'checkout' })">
        Checkout
      </button>
    </section>

    <section v-if="promoProducts.length" class="section cart-promo">
      <div class="section__header flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4">
        <div>
          <p class="eyebrow">Deals</p>
          <h2>You might also like</h2>
        </div>
        <RouterLink class="button button--ghost w-full sm:w-auto" to="/promotions">View all</RouterLink>
      </div>

      <div class="cart-promotion-products">
        <article
          v-for="product in promoProducts"
          :key="product.id"
          class="cart-promo-card"
          :class="{ 'cart-promo-card--oos': !product.stock || product.stock < 1 }"
          @click="goToProduct(product)"
        >
          <div class="cart-promo-card__image">
            <img v-if="product.image" :src="product.image" :alt="product.name" loading="lazy">
            <div v-else class="cart-promo-card__placeholder">No image</div>
            <span v-if="product.stock > 0" class="cart-promo-card__badge">{{ discountLabel(product.promotion) }}</span>
            <span v-else class="cart-promo-card__badge cart-promo-card__badge--oos">Out of stock</span>
          </div>
          <div class="cart-promo-card__body">
            <h3 class="cart-promo-card__title">{{ product.name }}</h3>
            <div class="cart-promo-card__pricing">
              <s class="cart-promo-card__old">{{ formatCurrency(product.price) }}</s>
              <strong class="cart-promo-card__new">{{ formatCurrency(product.discount_price) }}</strong>
            </div>
            <div class="cart-promo-card__actions">
              <button class="cart-promo-card__cart" type="button" :disabled="!product.stock || product.stock < 1" @click.stop="handleAddToCart(product)" title="Add to cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cart-promotion-products {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.cart-promo-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface-strong);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.cart-promo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.cart-promo-card__image {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--accent-soft);
  overflow: hidden;
}

.cart-promo-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cart-promo-card__placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 0.8rem;
  color: var(--muted);
}

.cart-promo-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 7px;
  line-height: 1;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);
}

.cart-promo-card__badge--oos {
  background: linear-gradient(135deg, #64748b, #475569);
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.4);
}

.cart-promo-card__body {
  padding: 14px;
  display: grid;
  gap: 8px;
}

.cart-promo-card__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cart-promo-card__pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.cart-promo-card__old {
  color: #9ca3af;
  font-size: 0.82rem;
}

.cart-promo-card__new {
  color: #dc2626;
  font-size: 1.1rem;
  font-weight: 800;
}

.cart-promo-card__actions {
  display: flex;
  gap: 6px;
  margin-top: 2px;
}

.cart-promo-card__cart {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 3px 8px;
  border: 0;
  border-radius: 6px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  min-height: 24px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.15s;
}

.cart-promo-card__cart:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.cart-promo-card__cart:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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

.cart-promo-card--oos {
  opacity: 0.5;
}

.cart-promo-card--oos .cart-promo-card__image img {
  filter: grayscale(1);
}

.cart-promo-card--oos .cart-promo-card__title {
  color: #94a3b8;
}

.cart-promo-card--oos .cart-promo-card__new {
  color: #94a3b8;
}

.cart-promo-card--oos .cart-promo-card__cart {
  opacity: 0.5;
  pointer-events: none;
}

.cart-promo {
  margin-top: 12px;
}

@media (max-width: 1199px) {
  .cart-promotion-products {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 767px) {
  .cart-promotion-products {
    grid-template-columns: 1fr;
  }
}
</style>
