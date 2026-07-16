<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import WelcomeBanner from './components/WelcomeBanner.vue';

const route = useRoute();
const isAuthPage = computed(() => route.meta?.layout === 'auth');
const hideBanner = computed(() => ['cart', 'orders', 'wishlist', 'products', 'promotions', 'about'].includes(route.name));
</script>

<template>
  <template v-if="isAuthPage">
    <RouterView />
  </template>
  <template v-else>
    <div class="app-shell bg-white text-slate-900 min-h-screen flex flex-col">
      <Navbar />
      <WelcomeBanner v-if="!hideBanner" />
      <main class="app-shell__main flex-1">
        <RouterView />
      </main>
      <Footer />
    </div>
  </template>
</template>
