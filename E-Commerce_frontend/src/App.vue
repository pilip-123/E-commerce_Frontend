<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const route = useRoute();
const isAuthPage = computed(() => route.meta?.layout === 'auth');
</script>

<template>
  <template v-if="isAuthPage">
    <RouterView />
  </template>
  <template v-else>
    <div class="app-shell bg-white text-slate-900 min-h-screen flex flex-col">
      <Navbar />
      <main class="app-shell__main flex-1">
        <RouterView />
      </main>
      <Footer />
    </div>
  </template>
</template>
