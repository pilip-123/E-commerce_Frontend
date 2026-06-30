<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="about-hero__bg">
        <div class="about-hero__shape about-hero__shape--1" />
        <div class="about-hero__shape about-hero__shape--2" />
        <div class="about-hero__shape about-hero__shape--3" />
      </div>
      <div class="about-hero__inner">
        <p class="about-hero__eyebrow">About Us</p>
        <h1 class="about-hero__title">Empowering Your Business<br />with Smart Commerce</h1>
        <p class="about-hero__lead">
          We provide a complete, scalable e-commerce platform designed to help businesses of all sizes
          sell online, manage operations, and grow with confidence.
        </p>
        <div class="about-hero__actions">
          <RouterLink class="about-hero__btn about-hero__btn--primary" to="/products">Explore Platform</RouterLink>
          <RouterLink class="about-hero__btn about-hero__btn--ghost" to="/register">Get Started Free</RouterLink>
        </div>
      </div>
    </section>

    <section class="about-stats">
      <div class="about-stats__inner">
        <div class="about-stat">
          <strong class="about-stat__value">10K+</strong>
          <span class="about-stat__label">Aive Merchantsct</span>
        </div>
        <div class="about-stat">
          <strong class="about-stat__value">50K+</strong>
          <span class="about-stat__label">Products Listed</span>
        </div>
        <div class="about-stat">
          <strong class="about-stat__value">99.9%</strong>
          <span class="about-stat__label">Uptime</span>
        </div>
        <div class="about-stat">
          <strong class="about-stat__value">24/7</strong>
          <span class="about-stat__label">Support</span>
        </div>
      </div>
    </section>

    <section class="about-mission">
      <div class="about-mission__inner">
        <div class="about-mission__header">
          <p class="eyebrow">Our Mission</p>
          <h2>What Drives Us Every Day</h2>
          <p class="about-mission__desc">Three core pillars guide everything we build, every feature we ship, and every interaction we have with our users.</p>
        </div>

        <div class="about-mission__grid">
          <article class="mission-card">
            <div class="mission-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div class="mission-card__line" />
            <h3>Simplify E-Commerce</h3>
            <p>Remove complexity from online selling. From product listings to checkout, every step is designed for ease of use so you can focus on what matters — your business.</p>
          </article>

          <article class="mission-card">
            <div class="mission-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="mission-card__line" />
            <h3>Empower Entrepreneurs</h3>
            <p>Give business owners the tools they need to succeed — analytics, inventory management, and customer insights at their fingertips to make data-driven decisions.</p>
          </article>

          <article class="mission-card">
            <div class="mission-card__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
            </div>
            <div class="mission-card__line" />
            <h3>Delight Customers</h3>
            <p>Create seamless shopping experiences that keep customers coming back — fast checkout, personalized recommendations, and reliable support at every touchpoint.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="about-values">
      <div class="about-values__inner">
        <div class="about-values__header">
          <p class="eyebrow">Our Values</p>
          <h2>The Principles That Shape Us</h2>
          <p class="about-values__desc">Our values aren't just words on a page — they're the foundation of every decision we make and every product we build.</p>
        </div>

        <div class="about-values__grid">
          <article class="value-card">
            <div class="value-card__icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <h3>Innovation</h3>
              <p>We continuously evolve our platform with cutting-edge technology to stay ahead of market trends and exceed user expectations.</p>
            </div>
          </article>

          <article class="value-card">
            <div class="value-card__icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div>
              <h3>Trust & Security</h3>
              <p>Data protection and secure transactions are foundational. We maintain the highest standards to protect every business and customer in our ecosystem.</p>
            </div>
          </article>

          <article class="value-card">
            <div class="value-card__icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <h3>Customer Focus</h3>
              <p>Every feature we build starts with a single question: how does this help our users grow their business and serve their customers better?</p>
            </div>
          </article>

          <article class="value-card">
            <div class="value-card__icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div>
              <h3>Global Reach</h3>
              <p>We support multi-currency, multi-language, and global shipping integrations to help you sell anywhere in the world, seamlessly.</p>
            </div>
          </article>

          <article class="value-card">
            <div class="value-card__icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <h3>Transparency</h3>
              <p>We believe in open communication, clear pricing, and honest feedback. No hidden fees, no surprises — just a partnership built on trust.</p>
            </div>
          </article>

          <article class="value-card">
            <div class="value-card__icon-wrap">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
            </div>
            <div>
              <h3>Sustainable Growth</h3>
              <p>We build for the long term — creating sustainable solutions that grow with your business while minimizing environmental impact.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="about-cta">
      <div class="about-cta__bg">
        <div class="about-cta__shape about-cta__shape--1" />
        <div class="about-cta__shape about-cta__shape--2" />
      </div>
      <div class="about-cta__inner">
        <h2>Ready to grow your business?</h2>
        <p>Join thousands of merchants using our platform to sell smarter, manage easier, and scale faster.</p>
        <RouterLink class="about-cta__btn" to="/register">Start Selling Today</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Page ─── */
.about-page {
  display: grid;
  gap: 0;
}

/* ─── Hero ─── */
.about-hero {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-top: -32px;
  background: linear-gradient(135deg, #052e16 0%, #064e3b 40%, #16a34a 70%, #22c55e 100%);
  overflow: hidden;
  padding: 100px 0 80px;
}

.about-hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.about-hero__shape {
  position: absolute;
  border-radius: 50%;
}

.about-hero__shape--1 {
  width: 500px;
  height: 500px;
  top: -200px;
  right: -100px;
  background: rgba(255, 255, 255, 0.04);
}

.about-hero__shape--2 {
  width: 300px;
  height: 300px;
  bottom: -80px;
  left: -60px;
  background: rgba(255, 255, 255, 0.03);
}

.about-hero__shape--3 {
  width: 200px;
  height: 200px;
  top: 40%;
  left: 60%;
  background: rgba(255, 255, 255, 0.03);
}

.about-hero__inner {
  position: relative;
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

.about-hero__eyebrow {
  display: inline-block;
  margin: 0;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.about-hero__title {
  margin: 20px 0 0;
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.08;
  color: #fff;
  letter-spacing: -0.02em;
}

.about-hero__lead {
  margin: 18px auto 0;
  max-width: 58ch;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.08rem;
  line-height: 1.65;
}

.about-hero__actions {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.about-hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 28px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.92rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.about-hero__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.about-hero__btn--primary {
  background: #fff;
  color: #166534;
  border: 0;
}

.about-hero__btn--ghost {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* ─── Stats ─── */
.about-stats {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: #fff;
  border-bottom: 1px solid rgba(22, 163, 74, 0.08);
}

.about-stats__inner {
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  padding: 32px 0;
}

.about-stat {
  text-align: center;
  padding: 8px 16px;
  border-right: 1px solid rgba(22, 163, 74, 0.08);
}

.about-stat:last-child {
  border-right: 0;
}

.about-stat__value {
  display: block;
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #064e3b, #16a34a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.about-stat__label {
  display: block;
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

/* ─── Mission ─── */
.about-mission {
  padding: 64px 0;
}

.about-mission__inner {
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
}

.about-mission__header {
  text-align: center;
  max-width: 60ch;
  margin: 0 auto 40px;
}

.about-mission__header h2 {
  margin: 8px 0 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.about-mission__desc {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.6;
}

.about-mission__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.mission-card {
  position: relative;
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);
  background: var(--surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  padding: 36px 28px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.mission-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(22, 163, 74, 0.10);
  border-color: rgba(22, 163, 74, 0.15);
}

.mission-card__icon {
  display: inline-grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: linear-gradient(135deg, #064e3b, #16a34a);
  color: #fff;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.2);
}

.mission-card__line {
  width: 40px;
  height: 3px;
  margin: 20px auto;
  border-radius: 2px;
  background: linear-gradient(90deg, #064e3b, #22c55e);
}

.mission-card h3 {
  margin: 0;
  font-size: 1.2rem;
}

.mission-card p {
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.65;
  font-size: 0.95rem;
}

/* ─── Values ─── */
.about-values {
  padding: 64px 0;
  background: var(--bg-soft);
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.about-values__inner {
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
}

.about-values__header {
  text-align: center;
  max-width: 60ch;
  margin: 0 auto 40px;
}

.about-values__header h2 {
  margin: 8px 0 0;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.about-values__desc {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.6;
}

.about-values__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.value-card {
  display: flex;
  align-items: flex-start;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: var(--surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.value-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(22, 163, 74, 0.08);
}

.value-card__icon-wrap {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  flex: none;
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.18);
}

.value-card h3 {
  margin: 0;
  font-size: 1.05rem;
}

.value-card p {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ─── CTA ─── */
.about-cta {
  position: relative;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: linear-gradient(135deg, #052e16 0%, #064e3b 60%, #16a34a 100%);
  overflow: hidden;
  padding: 72px 0;
}

.about-cta__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.about-cta__shape {
  position: absolute;
  border-radius: 50%;
}

.about-cta__shape--1 {
  width: 400px;
  height: 400px;
  top: -150px;
  left: -100px;
  background: rgba(255, 255, 255, 0.04);
}

.about-cta__shape--2 {
  width: 250px;
  height: 250px;
  bottom: -80px;
  right: 10%;
  background: rgba(255, 255, 255, 0.03);
}

.about-cta__inner {
  position: relative;
  width: min(var(--content-width), calc(100% - 32px));
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

.about-cta__inner h2 {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  color: #fff;
}

.about-cta__inner p {
  margin: 14px auto 0;
  max-width: 50ch;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.02rem;
  line-height: 1.6;
}

.about-cta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 28px;
  padding: 14px 32px;
  border-radius: 999px;
  background: #fff;
  color: #166534;
  font-weight: 700;
  font-size: 0.95rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.about-cta__btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
}

/* ─── Responsive ─── */
@media (max-width: 1024px) {
  .about-hero {
    margin-top: -24px;
    padding: 80px 0 60px;
  }

  .about-mission__grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }

  .about-values__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .about-hero {
    margin-top: -20px;
    padding: 60px 0 48px;
  }

  .about-stats__inner {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px 0;
    padding: 24px 0;
  }

  .about-stat {
    border-right: 0;
  }

  .about-stat__value {
    font-size: 1.4rem;
  }

  .about-values__grid {
    grid-template-columns: 1fr;
  }

  .about-cta {
    padding: 48px 0;
  }

  .mission-card {
    padding: 28px 22px;
  }
}
</style>
