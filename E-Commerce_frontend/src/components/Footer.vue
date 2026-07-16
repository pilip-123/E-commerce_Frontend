<script setup>
import { useLocale } from '@/composables/useLocale';
const { t } = useLocale();
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer__inner flex-col sm:flex-row text-center sm:text-left gap-2 sm:gap-6">
      <p class="text-sm">© {{ new Date().getFullYear() }} E-Commerce System &mdash; {{ t('footer.rights') }}</p>
      <div class="flex items-center gap-4 text-xs text-slate-400">
        <a href="#" class="hover:text-slate-600 transition-colors">Terms</a>
        <span>·</span>
        <a href="#" class="hover:text-slate-600 transition-colors">Privacy</a>
        <span>·</span>
        <a href="#" class="hover:text-slate-600 transition-colors">Support</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  border-top: 1px solid var(--line);
  background: var(--surface-strong);
}

.site-footer__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 24px;
}
</style>
