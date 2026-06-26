<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/stores/auth';
import { clearCart, fetchCart, useCart } from '@/stores/cart';
import api from '@/api/axios';
import { formatCurrency } from '@/utils/format';
import ConfirmModal from '@/components/ConfirmModal.vue';

const router = useRouter();
const auth = useAuth();
const cartState = useCart();
const submitting = ref(false);
const errorMessage = ref('');
const showConfirmModal = ref(false);

const form = reactive({
  phone: auth.user?.phone ?? '',
  shipping_address: auth.user?.address ?? '',
});

const total = computed(() => formatCurrency(cartState.total));

const originalTotal = computed(() => {
  return cartState.items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);
});

const totalSavings = computed(() => {
  const saved = originalTotal.value - cartState.total;
  return saved > 0 ? formatCurrency(saved) : null;
});

onMounted(async () => {
  await fetchCart();
});

function confirmOrder() {
  showConfirmModal.value = true;
}

async function handleSubmit() {
  submitting.value = true;
  errorMessage.value = '';

  try {
    await api.post('/checkout', form);
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
        <p class="eyebrow">Checkout</p>
        <h2>Shipping</h2>

        <form class="auth-form" @submit.prevent="confirmOrder">
          <input v-model="form.phone" class="input" type="text" placeholder="Phone" required>
          <textarea v-model="form.shipping_address" class="textarea" rows="4" placeholder="Shipping address" required></textarea>
          <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
          <button class="button" type="submit" :disabled="submitting">
            {{ submitting ? 'Processing...' : 'Place order' }}
          </button>
        </form>
      </div>

      <aside class="panel">
        <p class="eyebrow">Order summary</p>
        <h2>{{ cartState.items.length }} items</h2>
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
        <div class="summary-total">
          <span>Total</span>
          <strong>{{ total }}</strong>
        </div>
        <div v-if="totalSavings" class="summary-savings">
          You save <strong>{{ totalSavings }}</strong>
        </div>
      </aside>
    </section>

    <ConfirmModal
      :show="showConfirmModal"
      title="Place order"
      message="Ready to complete your order? You'll be charged the total amount shown."
      confirm-text="Place order"
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
</style>
