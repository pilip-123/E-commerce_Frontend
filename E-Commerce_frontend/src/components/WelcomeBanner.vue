<script setup>
import { computed } from 'vue';
import { useAuth } from '@/stores/auth';

const auth = useAuth();

const greeting = computed(() => {
  if (auth.user) {
    return `Welcome back, ${auth.user.name || auth.user.email}`;
  }
  return null;
});
</script>

<template>
  <section class="hero-banner">
    <div class="hero-banner__bg">
      <div class="hero-banner__shape hero-banner__shape--1" />
      <div class="hero-banner__shape hero-banner__shape--2" />
      <div class="hero-banner__shape hero-banner__shape--3" />
      <div class="hero-banner__shape hero-banner__shape--4" />
    </div>

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

      <div class="hero-banner__right">
        <div class="hero-banner__devices">
          <div class="hero-banner__device hero-banner__device--laptop">
            <div class="hero-banner__screen">
              <div class="hero-banner__mockup">
                <div class="mockup-nav" />
                <div class="mockup-stats">
                  <div class="mockup-stat" />
                  <div class="mockup-stat" />
                  <div class="mockup-stat" />
                  <div class="mockup-stat" />
                </div>
                <div class="mockup-table">
                  <div class="mockup-row" />
                  <div class="mockup-row" />
                  <div class="mockup-row" />
                </div>
              </div>
            </div>
            <div class="hero-banner__device-base" />
          </div>

          <div class="hero-banner__device hero-banner__device--tablet">
            <div class="hero-banner__screen">
              <div class="hero-banner__mockup">
                <div class="mockup-nav" />
                <div class="mockup-stats">
                  <div class="mockup-stat" />
                  <div class="mockup-stat" />
                  <div class="mockup-stat" />
                </div>
              </div>
            </div>
          </div>

          <div class="hero-banner__device hero-banner__device--phone">
            <div class="hero-banner__screen">
              <div class="hero-banner__mockup">
                <div class="mockup-nav" />
                <div class="mockup-stats">
                  <div class="mockup-stat" />
                  <div class="mockup-stat" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <svg class="hero-banner__lines" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="40" x2="160" y2="80" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="160" y1="80" x2="200" y2="200" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="200" y1="200" x2="320" y2="240" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="200" y1="200" x2="360" y2="160" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="200" y1="200" x2="80" y2="300" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="320" y1="240" x2="360" y2="360" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
          <line x1="80" y1="300" x2="40" y2="360" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />
        </svg>

        <div class="hero-banner__floating-icons">
          <span class="floating-icon floating-icon--cart" style="top:8%;left:6%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </span>
          <span class="floating-icon floating-icon--payment" style="top:15%;right:10%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </span>
          <span class="floating-icon floating-icon--inventory" style="top:50%;left:2%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </span>
          <span class="floating-icon floating-icon--analytics" style="top:45%;right:4%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </span>
          <span class="floating-icon floating-icon--mobile" style="top:75%;left:8%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
          </span>
          <span class="floating-icon floating-icon--cloud" style="top:78%;right:12%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
          </span>
          <span class="floating-icon floating-icon--api" style="bottom:10%;left:45%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          </span>
          <span class="floating-icon floating-icon--security" style="bottom:18%;right:45%">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-banner {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: -32px;
  border-radius: 0;
  background: linear-gradient(135deg, #064e3b 0%, #16a34a 40%, #22c55e 70%, #4ade80 100%);
  box-shadow: 0 25px 80px rgba(22, 163, 74, 0.25);
  overflow: hidden;
  height: 70vh;
  min-height: 480px;
  max-height: 700px;
}

.hero-banner__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-banner__shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
}

.hero-banner__shape--1 {
  width: 500px;
  height: 500px;
  top: -200px;
  left: -150px;
}

.hero-banner__shape--2 {
  width: 300px;
  height: 300px;
  bottom: -100px;
  left: -80px;
  background: rgba(255, 255, 255, 0.04);
}

.hero-banner__shape--3 {
  width: 200px;
  height: 200px;
  top: 60px;
  right: 30%;
  background: rgba(255, 255, 255, 0.04);
}

.hero-banner__shape--4 {
  width: 150px;
  height: 150px;
  bottom: 40px;
  right: 15%;
  background: rgba(255, 255, 255, 0.05);
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
  z-index: 1;
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

/* ─── Devices ─── */
.hero-banner__devices {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.hero-banner__device {
  position: absolute;
  border-radius: 8px;
  background: #1e293b;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.hero-banner__device--laptop {
  position: relative;
  width: 280px;
  border-radius: 8px 8px 0 0;
}

.hero-banner__device--tablet {
  right: 0;
  top: 5%;
  width: 110px;
  border-radius: 6px;
}

.hero-banner__device--phone {
  right: 8%;
  bottom: 5%;
  width: 65px;
  border-radius: 6px;
}

.hero-banner__screen {
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #0f172a;
  padding: 10px;
}

.hero-banner__device--tablet .hero-banner__screen {
  aspect-ratio: 3 / 4;
  padding: 8px;
}

.hero-banner__device--phone .hero-banner__screen {
  aspect-ratio: 9 / 16;
  padding: 6px;
}

.hero-banner__device-base {
  height: 10px;
  background: #334155;
  border-radius: 0 0 8px 8px;
}

.hero-banner__mockup {
  width: 100%;
  height: 100%;
  display: grid;
  gap: 6px;
}

.hero-banner__device--laptop .hero-banner__mockup {
  gap: 8px;
}

.hero-banner__device--tablet .hero-banner__mockup {
  gap: 5px;
}

.hero-banner__device--phone .hero-banner__mockup {
  gap: 4px;
}

.mockup-nav {
  height: 12px;
  border-radius: 3px;
  background: rgba(59, 130, 246, 0.2);
}

.hero-banner__device--laptop .mockup-nav {
  height: 14px;
}

.hero-banner__device--tablet .mockup-nav {
  height: 10px;
}

.hero-banner__device--phone .mockup-nav {
  height: 8px;
}

.mockup-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.hero-banner__device--tablet .mockup-stats {
  grid-template-columns: repeat(3, 1fr);
}

.hero-banner__device--phone .mockup-stats {
  grid-template-columns: repeat(2, 1fr);
}

.mockup-stat {
  height: 20px;
  border-radius: 4px;
  background: rgba(59, 130, 246, 0.15);
}

.hero-banner__device--laptop .mockup-stat {
  height: 28px;
}

.hero-banner__device--tablet .mockup-stat {
  height: 18px;
}

.hero-banner__device--phone .mockup-stat {
  height: 14px;
}

.mockup-table {
  display: grid;
  gap: 6px;
}

.mockup-row {
  height: 12px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.06);
}

.hero-banner__device--laptop .mockup-row {
  height: 16px;
}

/* ─── Connecting lines ─── */
.hero-banner__lines {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  opacity: 0.5;
}

/* ─── Floating icons ─── */
.hero-banner__floating-icons {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
}

.floating-icon {
  position: absolute;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  animation: floatIcon 3s ease-in-out infinite;
}

.floating-icon:nth-child(2) { animation-delay: 0.4s; }
.floating-icon:nth-child(3) { animation-delay: 0.8s; }
.floating-icon:nth-child(4) { animation-delay: 1.2s; }
.floating-icon:nth-child(5) { animation-delay: 1.6s; }
.floating-icon:nth-child(6) { animation-delay: 2s; }
.floating-icon:nth-child(7) { animation-delay: 2.4s; }
.floating-icon:nth-child(8) { animation-delay: 2.8s; }

@keyframes floatIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
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

  .hero-banner__device--laptop {
    width: 220px;
  }

  .hero-banner__device--tablet {
    width: 90px;
  }

  .hero-banner__device--phone {
    width: 55px;
  }
}

@media (max-width: 640px) {
  .hero-banner {
    margin-top: -20px;
  }

  .hero-banner__inner {
    padding: 24px 20px;
  }

  .hero-banner__right {
    min-height: 0;
  }

  .hero-banner__device--laptop {
    width: 180px;
  }

  .hero-banner__device--tablet {
    width: 75px;
  }

  .hero-banner__device--phone {
    width: 48px;
  }

  .floating-icon {
    width: 28px;
    height: 28px;
  }

  .floating-icon svg {
    width: 14px;
    height: 14px;
  }
}
</style>
