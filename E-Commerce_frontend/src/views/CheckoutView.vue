<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { clearCart, fetchCart, useCart } from '@/stores/cart';
import api from '@/api/axios';
import { formatCurrency } from '@/utils/format';
import ConfirmModal from '@/components/ConfirmModal.vue';
import { useLocale } from '@/composables/useLocale';

const router = useRouter();
const auth = useAuth();
const cartState = useCart();
const submitting = ref(false);
const errorMessage = ref('');
const showConfirmModal = ref(false);

function loadDiscount() {
  try {
    return JSON.parse(localStorage.getItem('cart_discount') || 'null');
  } catch {
    return null;
  }
}

const discount = ref(loadDiscount());
const hasProfile = ref(false);

const form = reactive({
  name: '',
  phone: '',
  shipping_address: '',
});

async function loadProfile() {
  try {
    const { data } = await api.get('/profile');
    const user = data.user;
    form.name = user.name ?? auth.user?.name ?? '';
    form.phone = user.phone ?? auth.user?.phone ?? '';
    form.shipping_address = user.address ?? auth.user?.address ?? '';
    auth.user = user;
    hasProfile.value = !!(form.phone && form.shipping_address);
  } catch {
    form.name = auth.user?.name ?? '';
    form.phone = auth.user?.phone ?? '';
    form.shipping_address = auth.user?.address ?? '';
    hasProfile.value = false;
  }
}

const total = computed(() => formatCurrency(cartState.total));

const originalTotal = computed(() => {
  return cartState.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
});

const discountAmount = computed(() => {
  if (!discount.value) return 0;
  const t = cartState.total;
  if (discount.value.type === 'percentage') {
    return t * (discount.value.value / 100);
  }
  return Math.min(discount.value.value, t);
});

const finalTotal = computed(() => formatCurrency(cartState.total - discountAmount.value));

const totalSavings = computed(() => {
  const saved = originalTotal.value - cartState.total;
  return saved > 0 ? formatCurrency(saved) : null;
});

const { t } = useLocale();

onMounted(async () => {
  await loadProfile();
  await fetchCart();
});

function confirmOrder() {
  showConfirmModal.value = true;
}

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = '';

  try {
    const payload = { ...form };
    if (discount.value?.code) {
      payload.discount_code = discount.value.code;
    }
    await api.post('/checkout', payload);
    localStorage.removeItem('cart_discount');
    await clearCart();
    showConfirmModal.value = false;
    await router.push({ name: 'orders' });
  } catch (error) {
    errorMessage.value = error.response?.data?.message ?? 'Unable to place order.';
    showConfirmModal.value = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="page">
    <section class="checkout-grid">
      <div class="panel">
        <p class="eyebrow">{{ t('checkout.title') }}</p>
        <h2>{{ t('checkout.shipping') }}</h2>

        <form class="auth-form" @submit.prevent="confirmOrder">
          <template v-if="hasProfile">
            <div class="info-display">
              <div class="info-row">
                <span class="info-label">Phone</span>
                <span class="info-value">{{ form.phone }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('checkout.shipping') }}</span>
                <span class="info-value">{{ form.shipping_address }}</span>
              </div>
            </div>
            <input v-model="form.phone" type="hidden">
            <input v-model="form.shipping_address" type="hidden">
          </template>
          <template v-else>
            <p class="text-muted small mb-2" style="color: #dc2626;">Please fill in your details</p>
            <input v-model="form.phone" class="input" type="text" placeholder="Phone number" required>
            <textarea v-model="form.shipping_address" class="textarea" rows="3" :placeholder="t('checkout.shipping')" required></textarea>
          </template>
          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <button class="button" type="submit" :disabled="submitting || !form.phone || !form.shipping_address">
            {{ submitting ? t('general.loading') : t('checkout.place_order') }}
          </button>
        </form>
      </div>

      <aside class="panel">
        <p class="eyebrow">{{ t('checkout.order_summary') }}</p>
        <h2>{{ cartState.items.length }} {{ t('products.title') }}</h2>
        <div class="stack stack--tight">
          <div v-for="item in cartState.items" :key="item.id" class="summary-line">
            <span class="summary-line__name">{{ item.product.name }} x {{ item.quantity }}</span>
            <span class="summary-line__amount">
              <template v-if="item.product.has_discount">
                <s class="text-muted small">{{ formatCurrency(item.product.price * item.quantity) }}</s>
                <strong class="text-danger ms-1">{{ formatCurrency(item.product.discount_price * item.quantity) }}</strong>
              </template>
              <strong v-else>{{ formatCurrency(item.product.price * item.quantity) }}</strong>
            </span>
          </div>
        </div>
        <div v-if="discount" class="summary-line" style="border-color: #d1fae5;">
          <span class="summary-line__name" style="color: #065f46;">Discount ({{ discount.code }})</span>
          <span class="summary-line__amount" style="color: #16a34a;">-{{ formatCurrency(discountAmount) }}</span>
        </div>
        <div class="summary-total">
          <span>{{ t('cart.total') }}</span>
          <strong>{{ discount ? finalTotal : total }}</strong>
        </div>
        <div v-if="totalSavings" class="summary-savings">
          You saved <strong>{{ totalSavings }}</strong>
        </div>
      </aside>
    </section>

    <ConfirmModal
      :show="showConfirmModal"
      :title="t('checkout.place_order')"
      :message="t('checkout.order_summary')"
      :confirm-text="t('checkout.place_order')"
      :loading="submitting"
      @confirm="handleSubmit"
      @cancel="showConfirmModal = false"
    />
  </div>
</template>

<style scoped>
.summary-savings {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed var(--line);
  font-size: 0.82rem;
  color: #16a34a;
  font-weight: 600;
  text-align: right;
}

.summary-line__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-line__amount {
  white-space: nowrap;
}

.info-display {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.info-display .info-row {
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
}

.info-label {
  font-weight: 600;
  color: #374151;
  min-width: 70px;
}

.info-value {
  color: #6b7280;
}
</style>
