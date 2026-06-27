<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/api/axios'

const search = ref('')
const categoryFilter = ref('')
const currentPage = ref(1)
const perPage = 6

const state = ref({
  promotions: [],
  categories: [],
  loading: false,
})

const filtered = computed(() => {
  let items = state.value.promotions
  if (search.value) {
    const q = search.value.toLowerCase()
    items = items.filter(p => p.title.toLowerCase().includes(q))
  }
  if (categoryFilter.value) {
    items = items.filter(p => p.category === categoryFilter.value)
  }
  return items
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage)))

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filtered.value.slice(start, start + perPage)
})

const uniqueCategories = computed(() => {
  const set = new Set(state.value.promotions.map(p => p.category).filter(Boolean))
  return [...set]
})

async function fetchPromotions() {
  state.value.loading = true
  try {
    const { data } = await api.get('/admin/promotions')
    state.value.promotions = Array.isArray(data.data) ? data.data.map(p => ({
      id: p.id,
      title: p.name,
      image: p.image || `https://placehold.co/600x338/e2e8f0/64748b?text=${encodeURIComponent(p.name?.slice(0, 20) || 'Promotion')}`,
      category: p.discount_type === 'percentage' ? 'Percentage' : 'Fixed',
      createdAt: p.created_at,
    })) : mockPromotions
  } catch {
    state.value.promotions = mockPromotions
  } finally {
    state.value.loading = false
  }
}

function preview(item) {
  alert(`Preview: ${item.title}`)
}

function selectPromotion(item) {
  alert(`Selected: ${item.title}`)
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const mockPromotions = [
  { id: 1, title: 'Gem Blender - Creative Landing Page', image: 'https://placehold.co/600x338/2563eb/ffffff?text=Gem+Blender', category: 'Creative', createdAt: '2026-06-20' },
  { id: 2, title: 'Gem Vitamin - Creative Landing Page', image: 'https://placehold.co/600x338/7c3aed/ffffff?text=Gem+Vitamin', category: 'Creative', createdAt: '2026-06-19' },
  { id: 3, title: 'Advertorial - Weight Loss Landing Page', image: 'https://placehold.co/600x338/059669/ffffff?text=Weight+Loss', category: 'Health', createdAt: '2026-06-18' },
  { id: 4, title: 'Fashion Week - Style Landing Page', image: 'https://placehold.co/600x338/dc2626/ffffff?text=Fashion+Week', category: 'Fashion', createdAt: '2026-06-17' },
  { id: 5, title: 'Tech Launch - Product Showcase', image: 'https://placehold.co/600x338/0891b2/ffffff?text=Tech+Launch', category: 'Technology', createdAt: '2026-06-16' },
  { id: 6, title: 'Fitness Pro - Workout Landing', image: 'https://placehold.co/600x338/d97706/ffffff?text=Fitness+Pro', category: 'Health', createdAt: '2026-06-15' },
  { id: 7, title: 'Travel Explorer - Adventure Landing', image: 'https://placehold.co/600x338/4f46e5/ffffff?text=Travel+Explorer', category: 'Travel', createdAt: '2026-06-14' },
  { id: 8, title: 'Food Master - Recipe Landing Page', image: 'https://placehold.co/600x338/16a34a/ffffff?text=Food+Master', category: 'Food', createdAt: '2026-06-13' },
]

let refreshTimer

onMounted(() => {
  fetchPromotions()
  refreshTimer = setInterval(fetchPromotions, 30000)
})

onUnmounted(() => {
  clearInterval(refreshTimer)
})
</script>

<template>
  <div class="min-h-screen" style="background-color: #F8FAFC">
    <div class="mx-auto max-w-7xl px-6 py-10">
      <!-- Header -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-[32px] font-bold" style="color: #111827">Promotion Page</h1>
          <p class="mt-1" style="color: #6B7280">Choose a landing page template for your promotion.</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="relative">
            <svg class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Search promotion..."
              class="w-56 rounded-xl border py-2 pl-9 pr-3 text-sm outline-none transition-colors"
              style="border-color: #E5E7EB; background: #fff; color: #111827"
              @input="currentPage = 1"
            />
          </div>
          <select
            v-model="categoryFilter"
            class="rounded-xl border px-3 py-2 text-sm outline-none transition-colors"
            style="border-color: #E5E7EB; background: #fff; color: #111827"
            @change="currentPage = 1"
          >
            <option value="">All Categories</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <button
            class="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors"
            style="background: #2563EB"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14" /></svg>
            Create Promotion
          </button>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div v-if="state.loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl border" style="background: #fff; border-color: #E5E7EB">
          <div class="aspect-video rounded-t-2xl" style="background: #E5E7EB" />
          <div class="space-y-3 p-4">
            <div class="h-4 w-3/4 rounded" style="background: #E5E7EB" />
            <div class="h-3 w-1/2 rounded" style="background: #E5E7EB" />
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!paginated.length" class="flex flex-col items-center justify-center py-24">
        <svg class="mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
        </svg>
        <p class="text-lg font-semibold" style="color: #111827">No promotions found</p>
        <p class="mt-1 text-sm" style="color: #6B7280">Try adjusting your search or filter.</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="item in paginated"
          :key="item.id"
          class="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1"
          style="background: #fff; border-color: #E5E7EB"
        >
          <!-- Image -->
          <div class="relative aspect-video overflow-hidden">
            <img
              :src="item.image"
              :alt="item.title"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <!-- Body -->
          <div class="flex flex-1 flex-col justify-between p-4">
            <div>
              <h3 class="truncate text-base font-semibold" style="color: #111827">{{ item.title }}</h3>
              <p class="mt-1 text-xs" style="color: #6B7280">{{ item.category }} &middot; {{ item.createdAt }}</p>
            </div>

            <!-- Actions -->
            <div class="mt-4 flex items-center justify-end gap-2">
              <button
                class="inline-flex items-center justify-center rounded-lg border p-2 transition-colors"
                style="border-color: #E5E7EB; color: #6B7280"
                title="Preview"
                @click="preview(item)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </button>
              <button
                class="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
                style="background: #2563EB"
                @click="selectPromotion(item)"
              >
                Select
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-2">
        <button
          class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40"
          style="border-color: #E5E7EB; color: #6B7280"
          :disabled="currentPage <= 1"
          @click="prevPage"
        >
          Previous
        </button>
        <span
          v-for="p in totalPages"
          :key="p"
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors"
          :style="p === currentPage ? { background: '#2563EB', color: '#fff' } : { color: '#6B7280' }"
          @click="currentPage = p"
        >
          {{ p }}
        </span>
        <button
          class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-40"
          style="border-color: #E5E7EB; color: #6B7280"
          :disabled="currentPage >= totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
