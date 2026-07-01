<script setup>
import { reactive, ref, computed, watch } from 'vue';
import api from '@/api/axios';
import { formatCurrency } from '@/utils/format';

const props = defineProps({
  show: { type: Boolean, default: false },
  order: { type: Object, default: null },
});

const emit = defineEmits(['close', 'submitted']);

const reviews = reactive({});
const submitting = ref(false);
const error = ref('');

watch(() => props.show, (val) => {
  if (val && props.order?.items) {
    Object.keys(reviews).forEach(k => delete reviews[k]);
    props.order.items.forEach(item => {
      if (!item.hasReviewed) {
        reviews[item.product_id] = { rating: 0, comment: '' };
      }
    });
  }
});

const unratedItems = computed(() => {
  if (!props.order?.items) return [];
  return props.order.items.filter(i => !i.hasReviewed);
});

function setRating(productId, rating) {
  if (reviews[productId]) {
    reviews[productId].rating = rating;
  }
}

async function submitReviews() {
  submitting.value = true;
  error.value = '';

  try {
    const items = unratedItems.value;
    for (const item of items) {
      const review = reviews[item.product_id];
      if (!review || review.rating === 0) continue;

      await api.post('/reviews', {
        product_id: item.product_id,
        rating: review.rating,
        comment: review.comment || '',
      });
    }
    emit('submitted');
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to submit ratings. Please try again.';
  } finally {
    submitting.value = false;
  }
}

function close() {
  if (!submitting.value) {
    emit('close');
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="close">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal__header">
            <h3 class="modal__title">Rate your products</h3>
            <p class="modal__subtitle">
              How would you rate the products from order #{{ order?.id }}?
            </p>
          </div>

          <div class="modal__body">
            <div
              v-for="item in unratedItems"
              :key="item.product_id"
              class="rate-item"
            >
              <div class="rate-item__media">
                <img
                  v-if="item.product?.image"
                  :src="item.product.image"
                  :alt="item.product.name"
                  class="rate-item__img"
                  loading="lazy"
                >
                <div v-else class="rate-item__img rate-item__img--placeholder">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              </div>

              <div class="rate-item__content">
                <p class="rate-item__name">{{ item.product?.name ?? 'Product' }}</p>
                <p class="rate-item__price">{{ formatCurrency(item.price) }}</p>

                <div class="rate-item__stars">
                  <span
                    v-for="star in 5"
                    :key="star"
                    class="star-btn"
                    :class="{ active: star <= (reviews[item.product_id]?.rating ?? 0) }"
                    @click="setRating(item.product_id, star)"
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26"
                        fill="currentColor"
                      />
                    </svg>
                  </span>
                </div>

                <textarea
                  v-model="reviews[item.product_id].comment"
                  class="rate-item__comment"
                  placeholder="Share your thoughts (optional)"
                  rows="2"
                  maxlength="2000"
                />
              </div>
            </div>

            <div v-if="error" class="modal__error">{{ error }}</div>
          </div>

          <div class="modal__footer">
            <button class="button button--ghost" type="button" :disabled="submitting" @click="close">
              Skip
            </button>
            <button class="button" type="button" :disabled="submitting" @click="submitReviews">
              {{ submitting ? 'Submitting...' : 'Submit ratings' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  padding: 16px;
}

.modal {
  width: min(520px, calc(100% - 32px));
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  background: #fff;
  box-shadow: 0 32px 60px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.modal__header {
  padding: 28px 28px 0;
}

.modal__title {
  margin: 0 0 4px;
  font-size: 1.25rem;
}

.modal__subtitle {
  margin: 0 0 16px;
  color: var(--muted);
  font-size: 0.88rem;
}

.modal__body {
  padding: 0 28px 16px;
  overflow-y: auto;
  flex: 1;
}

.modal__footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 16px 28px;
  border-top: 1px solid var(--line);
}

.modal__error {
  color: #dc2626;
  font-size: 0.85rem;
  margin-top: 12px;
}

/* ─── Rate Item ─── */
.rate-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
}

.rate-item:last-child {
  border-bottom: none;
}

.rate-item__img {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  background: var(--accent-soft);
  flex-shrink: 0;
}

.rate-item__img--placeholder {
  display: grid;
  place-items: center;
  color: var(--line-strong);
}

.rate-item__img--placeholder svg {
  width: 22px;
  height: 22px;
}

.rate-item__content {
  flex: 1;
  min-width: 0;
}

.rate-item__name {
  margin: 0 0 2px;
  font-weight: 600;
  font-size: 0.92rem;
}

.rate-item__price {
  margin: 0 0 8px;
  font-size: 0.82rem;
  color: var(--muted);
}

.rate-item__stars {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.star-btn {
  cursor: pointer;
  color: var(--line-strong);
  transition: color 0.15s, transform 0.15s;
  display: inline-flex;
}

.star-btn:hover {
  transform: scale(1.15);
}

.star-btn.active {
  color: #f59e0b;
}

.rate-item__comment {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 0.85rem;
  resize: vertical;
  background: var(--accent-soft);
  box-sizing: border-box;
  min-height: 52px;
}

.rate-item__comment:focus {
  outline: none;
  border-color: var(--accent);
}

/* ─── Transitions ─── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: scale(0.95) translateY(8px);
}

.modal-leave-to .modal {
  transform: scale(0.95) translateY(8px);
}

@media (max-width: 640px) {
  .modal__header {
    padding: 20px 20px 0;
  }
  .modal__body {
    padding: 0 20px 12px;
  }
  .modal__footer {
    padding: 12px 20px;
  }
}
</style>
