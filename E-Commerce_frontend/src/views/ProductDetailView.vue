<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatCurrency } from '@/utils/format';
import { addToCart } from '@/stores/cart';
import { addToWishlist } from '@/stores/wishlist';
import { fetchProduct, useProduct } from '@/stores/product';
import { useAuth } from '@/stores/auth';
import api from '@/api/axios';

const route = useRoute();
const router = useRouter();
const productState = useProduct();
const auth = useAuth();

const userRating = ref(0);
const hoverRating = ref(0);
const reviewComment = ref('');
const submitting = ref(false);
const reviewMessage = ref('');

const avgRating = computed(() => productState.product?.rating ?? null);
const reviewsCount = computed(() => productState.product?.reviews_count ?? 0);
const reviews = computed(() => productState.product?.reviews ?? []);

const fullStars = computed(() => (avgRating.value ? Math.floor(avgRating.value) : 0));
const hasHalfStar = computed(() => avgRating.value ? avgRating.value - fullStars.value >= 0.25 : false);

const discountLabel = computed(() => {
  if (!productState.product?.has_discount || !productState.product?.promotion) return null;
  const p = productState.product.promotion;
  if (p.discount_type === 'percentage') return `-${p.discount_value}%`;
  return `-${formatCurrency(p.discount_value)}`;
});

const savingsPercent = computed(() => {
  if (!productState.product?.has_discount || !productState.product?.price) return null;
  const saved = productState.product.price - productState.product.discount_price;
  return Math.round((saved / productState.product.price) * 100);
});

const outOfStock = computed(() => !productState.product?.stock || productState.product.stock < 1);

function setRating(val) {
  userRating.value = val;
}

async function submitReview() {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  if (!userRating.value) return;

  submitting.value = true;
  reviewMessage.value = '';

  try {
    await api.post('/reviews', {
      product_id: productState.product.id,
      rating: userRating.value,
      comment: reviewComment.value,
    });
    reviewMessage.value = 'Review submitted!';
    userRating.value = 0;
    reviewComment.value = '';
    await fetchProduct(route.params.id);
  } catch (error) {
    reviewMessage.value = error.response?.data?.message ?? 'Unable to submit review.';
  } finally {
    submitting.value = false;
  }
}

onMounted(async () => {
  await fetchProduct(route.params.id);
});

async function handleAddToCart() {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  await addToCart(productState.product.id);
  await router.push({ name: 'cart' });
}

async function handleAddToWishlist() {
  if (!auth.token) {
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }
  await addToWishlist(productState.product.id);
  router.push({ name: 'wishlist' });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<template>
  <div class="page">
    <section v-if="productState.product" class="detail" :class="{ 'detail--oos': outOfStock }">
      <div class="detail__media">
        <img v-if="productState.product.image" :src="productState.product.image" :alt="productState.product.name" class="detail__image" loading="lazy">
        <span v-if="discountLabel" class="detail__badge">{{ discountLabel }}</span>
        <span v-if="outOfStock" class="detail__badge detail__badge--oos">Out of stock</span>
      </div>

      <div class="detail__content">
        <p class="eyebrow">{{ productState.product.category?.name ?? 'Product' }}</p>
        <h1>{{ productState.product.name }}</h1>

        <div class="detail__rating" v-if="avgRating">
          <span class="stars-display">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= fullStars, half: i === fullStars + 1 && hasHalfStar }">&#9733;</span>
          </span>
          <span class="rating-value">{{ avgRating }}</span>
          <span class="rating-count">({{ reviewsCount }} review{{ reviewsCount !== 1 ? 's' : '' }})</span>
        </div>

        <div class="detail__price" v-if="productState.product?.has_discount">
          <s class="price-old">{{ formatCurrency(productState.product.price) }}</s>
          <strong class="price-new">{{ formatCurrency(productState.product.discount_price) }}</strong>
          <span class="price-save" v-if="savingsPercent">Save {{ savingsPercent }}%</span>
        </div>
        <p class="detail__price" v-else>{{ formatCurrency(productState.product.price) }}</p>
        <p class="detail__text">{{ productState.product.description }}</p>

        <div class="detail__meta">
          <span v-if="outOfStock" class="detail__meta--oos">Out of stock</span>
          <span v-else>Stock {{ productState.product.stock }}</span>
          <span>{{ productState.product.status ? 'Live' : 'Hidden' }}</span>
        </div>

        <div class="detail__actions">
          <button class="button w-full sm:w-auto" type="button" :disabled="outOfStock" @click="handleAddToCart">Cart</button>
          <button class="button button--secondary w-full sm:w-auto" type="button" @click="handleAddToWishlist">Save</button>
          <button class="button button--ghost w-full sm:w-auto" type="button" @click="router.back()">Back</button>
        </div>
      </div>
    </section>

    <!-- Review Form -->
    <section class="review-form-section" v-if="productState.product">
      <div class="review-form-section__header">
        <p class="eyebrow">Reviews</p>
        <h2>Customer reviews</h2>
      </div>

      <div class="review-form-card">
        <div class="star-rating">
          <span
            v-for="i in 5" :key="i"
            class="star-btn"
            :class="{ active: i <= (hoverRating || userRating) }"
            @click="setRating(i)"
            @mouseenter="hoverRating = i"
            @mouseleave="hoverRating = 0"
          >&#9733;</span>
          <span class="rating-label" v-if="userRating">{{ userRating }}/5</span>
          <span class="rating-label muted" v-else>Click to rate</span>
        </div>
        <textarea v-model="reviewComment" class="input textarea" rows="3" placeholder="Share your thoughts about this product..."></textarea>
        <p v-if="reviewMessage" class="form-success" v-show="reviewMessage">{{ reviewMessage }}</p>
        <button class="button w-full sm:w-auto" type="button" :disabled="!userRating || submitting" @click="submitReview">
          {{ submitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </section>

    <!-- Reviews Table -->
    <section class="reviews-table-section" v-if="productState.product">
      <div class="reviews-table-wrap overflow-x-auto" v-if="reviews.length">
        <table class="reviews-table min-w-[640px]">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th class="col-user">Customer</th>
              <th class="col-rating">Rating</th>
              <th class="col-comment">Comment</th>
              <th class="col-date">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(review, idx) in reviews" :key="review.id">
              <td class="col-num">{{ idx + 1 }}</td>
              <td class="col-user">
                <div class="reviewer">
                  <img v-if="review.user?.image_url" :src="review.user.image_url" :alt="review.user.name" class="reviewer-avatar">
                  <div v-else class="reviewer-avatar reviewer-avatar--initials">{{ review.user?.name?.[0]?.toUpperCase() ?? '?' }}</div>
                  <span class="reviewer-name">{{ review.user?.name ?? 'Anonymous' }}</span>
                </div>
              </td>
              <td class="col-rating">
                <div class="reviewer-stars">
                  <span v-for="i in 5" :key="i" class="rstar" :class="{ filled: i <= review.rating }">&#9733;</span>
                  <span class="reviewer-rating-text">{{ review.rating }}/5</span>
                </div>
              </td>
              <td class="col-comment">
                <span v-if="review.comment" class="reviewer-comment">{{ review.comment }}</span>
                <span v-else class="reviewer-comment muted">&mdash;</span>
              </td>
              <td class="col-date">{{ formatDate(review.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="reviews-empty">
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.detail__rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}

.stars-display {
  display: inline-flex;
  gap: 1px;
  color: #d1d5db;
}

.star {
  color: #d1d5db;
}

.star.filled {
  color: #f59e0b;
}

.star.half {
  position: relative;
  color: #f59e0b;
}

.rating-value {
  font-weight: 700;
  font-size: 0.95rem;
  color: #111;
}

.rating-count {
  font-size: 0.85rem;
  color: #9ca3af;
}

/* ─── Review Form ─── */
.review-form-section {
  margin-top: 32px;
}

.review-form-section__header {
  margin-bottom: 16px;
}

.review-form-section__header h2 {
  margin: 0;
}

.review-form-card {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: grid;
  gap: 12px;
}

.star-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-btn {
  font-size: 1.6rem;
  cursor: pointer;
  color: #d1d5db;
  transition: color 0.15s, transform 0.15s;
  line-height: 1;
}

.star-btn:hover {
  transform: scale(1.15);
}

.star-btn.active {
  color: #f59e0b;
}

.rating-label {
  margin-left: 8px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* ─── Reviews Table ─── */
.reviews-table-section {
  margin-top: 28px;
}

.reviews-table-wrap {
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--surface-strong);
}

.reviews-table {
  width: 100%;
  border-collapse: collapse;
}

.reviews-table thead {
  background: var(--accent-soft);
}

.reviews-table th {
  padding: 14px 18px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent);
  text-align: left;
  border-bottom: 1px solid var(--line);
}

.reviews-table td {
  padding: 16px 18px;
  font-size: 0.88rem;
  color: var(--text);
  border-bottom: 1px solid var(--line);
  vertical-align: middle;
}

.reviews-table tbody tr:last-child td {
  border-bottom: none;
}

.reviews-table tbody tr:hover {
  background: var(--bg);
}

.col-num {
  width: 48px;
  color: var(--muted);
  font-weight: 600;
}

.col-user {
  width: 200px;
}

.col-rating {
  width: 140px;
}

.col-date {
  width: 120px;
  white-space: nowrap;
  color: var(--muted);
  font-size: 0.82rem;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reviewer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  flex: none;
}

.reviewer-avatar--initials {
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
}

.reviewer-name {
  font-weight: 600;
  font-size: 0.85rem;
}

.reviewer-stars {
  display: flex;
  align-items: center;
  gap: 1px;
}

.rstar {
  font-size: 0.9rem;
  color: #d1d5db;
}

.rstar.filled {
  color: #f59e0b;
}

.reviewer-rating-text {
  margin-left: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
}

.reviewer-comment {
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reviews-empty {
  padding: 40px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-lg);
}

.form-success {
  margin: 0;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  background: rgba(34, 197, 94, 0.1);
  color: #166534;
  font-size: 0.85rem;
}

.detail__media {
  position: relative;
}

.detail__badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #dc2626;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  padding: 6px 14px;
  border-radius: 8px;
  line-height: 1;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.4);
}

.detail__price {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.price-old {
  color: #9ca3af;
  font-size: 1rem;
}

.price-new {
  color: #dc2626;
  font-size: 1.8rem;
  font-weight: 800;
}

.detail--oos {
  opacity: 0.5;
}

.detail--oos .detail__image {
  filter: grayscale(1);
}

.detail--oos .detail__content h1 {
  color: #94a3b8;
}

.detail--oos .price-new {
  color: #94a3b8;
}

.detail--oos .button {
  opacity: 0.5;
  pointer-events: none;
}

.detail__badge--oos {
  background: linear-gradient(135deg, #64748b, #475569);
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.4);
}

.detail__meta--oos {
  font-weight: 700;
  color: #94a3b8;
}

.detail__price .price-save {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #16a34a;
  background: rgba(22, 163, 74, 0.1);
  padding: 3px 10px;
  border-radius: 5px;
}

@media (max-width: 768px) {
  .col-comment {
    display: none;
  }
  .col-user {
    width: auto;
    min-width: 140px;
  }
  .col-rating {
    width: auto;
  }
  .col-date {
    width: auto;
  }
  .reviews-table th,
  .reviews-table td {
    padding: 10px 12px;
  }
  .detail__image {
    height: 280px;
  }
  .detail__media {
    padding: 12px;
  }
  .detail__content {
    padding: 20px;
  }
}
</style>
