<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="app-shell bg-white text-slate-900 min-h-screen flex flex-col">
    <Navbar />
    <main class="app-shell__main flex-1">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>
