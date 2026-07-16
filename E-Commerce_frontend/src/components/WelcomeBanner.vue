<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuth } from '@/stores/auth';

const auth = useAuth();

const images = [
  { src: new URL('@/components/images/Orange.jpg', import.meta.url).href, alt: 'Orange' },
  { src: new URL('@/components/images/Pheech.jpg', import.meta.url).href, alt: 'Pheech' },
  { src: new URL('@/components/images/Kulean.jpg', import.meta.url).href, alt: 'Kulean' },
  { src: new URL('@/components/images/Mengo.jpg', import.meta.url).href, alt: 'Mengo' },
  { src: new URL('@/components/images/TraBak.jpg', import.meta.url).href, alt: 'TraBak' },
  { src: new URL('@/components/images/Melone.jpg', import.meta.url).href, alt: 'Melone' },
];

const currentIndex = ref(0);
let intervalId = null;

const currentImage = computed(() => images[currentIndex.value]);

function startSlideshow() {
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % images.length;
  }, 4000);
}

function goToSlide(index) {
  currentIndex.value = index;
  clearInterval(intervalId);
  startSlideshow();
}

onMounted(() => {
  startSlideshow();
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const greeting = computed(() => {
  if (auth.user) {
    return `Welcome back, ${auth.user.name || auth.user.email}`;
  }
  return null;
});
</script>

<template>
  <section class="hero-banner">
    <div class="hero-banner__slides">
      <div
        v-for="(image, index) in images"
        :key="index"
        class="hero-banner__slide"
        :class="{ 'hero-banner__slide--active': index === currentIndex }"
      >
        <img :src="image.src" :alt="image.alt" class="hero-banner__img" />
      </div>
    </div>

    <div class="hero-banner__overlay" />

    <div class="hero-banner__inner">
      <div class="hero-banner__left">
        <span class="hero-banner__cart-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </span>

        <p v-if="greeting" class="hero-banner__greeting">{{ greeting }}</p>

        <h1 class="hero-banner__title">Custom E-Commerce Platform</h1>
        <p class="hero-banner__subtitle">Built for Your Business Growth</p>

        <div class="hero-banner__actions">
          <RouterLink class="hero-banner__btn hero-banner__btn--primary" to="/products">Get Started</RouterLink>
          <RouterLink class="hero-banner__btn hero-banner__btn--ghost" to="/about">Learn More</RouterLink>
        </div>
      </div>

      <div class="hero-banner__right" />
    </div>

    <div class="hero-banner__dots">
      <button
        v-for="(image, index) in images"
        :key="index"
        class="hero-banner__dot"
        :class="{ 'hero-banner__dot--active': index === currentIndex }"
        @click="goToSlide(index)"
      />
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: 0;
  border-radius: 0;
  overflow: hidden;
  height: 70vh;
  min-height: 480px;
  max-height: 700px;
}

.hero-banner__slides {
  position: absolute;
  inset: 0;
}

.hero-banner__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
}

.hero-banner__slide--active {
  opacity: 1;
}

.hero-banner__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-banner__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(6, 78, 59, 0.75) 0%, rgba(22, 163, 74, 0.55) 100%);
  z-index: 1;
}

.hero-banner__inner {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 40px;
  align-items: center;
  padding: 56px 0;
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
  height: 100%;
  z-index: 2;
}

.hero-banner__left {
  display: grid;
  gap: 12px;
}

.hero-banner__cart-icon {
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(4px);
  color: #fff;
  margin-bottom: 4px;
}

.hero-banner__greeting {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
}

.hero-banner__title {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900;
  line-height: 1.05;
  color: #fff;
  letter-spacing: -0.02em;
}

.hero-banner__subtitle {
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: rgba(255, 255, 255, 0.75);
  max-width: 38ch;
  line-height: 1.5;
}

.hero-banner__actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero-banner__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 13px 26px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.92rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.hero-banner__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.hero-banner__btn--primary {
  background: #fff;
  color: #166534;
  border: 0;
}

.hero-banner__btn--ghost {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.hero-banner__right {
  position: relative;
  display: grid;
  place-items: center;
  height: 100%;
  min-height: 280px;
}

.hero-banner__dots {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  z-index: 3;
}

.hero-banner__dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.hero-banner__dot--active {
  background: #fff;
  border-color: #fff;
  transform: scale(1.2);
}

@media (max-width: 1024px) {
  .hero-banner {
    margin-top: -24px;
  }

  .hero-banner__inner {
    grid-template-columns: 1fr;
    padding: 36px 28px;
    gap: 32px;
  }

  .hero-banner__right {
    min-height: 260px;
  }
}

@media (max-width: 640px) {
  .hero-banner {
    margin-top: -20px;
    min-height: 400px;
  }

  .hero-banner__inner {
    padding: 24px 20px;
  }

  .hero-banner__right {
    min-height: 0;
  }
}
</style>
