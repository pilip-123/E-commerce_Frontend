<template>
  <footer class="site-footer">
    <div class="site-footer__inner flex-col sm:flex-row text-center sm:text-left gap-2 sm:gap-6">
      <p class="text-sm">© {{ new Date().getFullYear() }} E-Commerce System</p>
      <div class="flex items-center gap-4 text-xs text-slate-400">
        <a href="#" class="hover:text-slate-600 transition-colors">Terms</a>
        <span>·</span>
        <a href="#" class="hover:text-slate-600 transition-colors">Privacy</a>
        <span>·</span>
        <a href="#" class="hover:text-slate-600 transition-colors">Support</a>
      </div>
      <p class="text-xs text-slate-400">Built with Vue &amp; Tailwind</p>
    </div>
  </footer>
</template>
