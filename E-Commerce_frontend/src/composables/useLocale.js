import { reactive, computed } from 'vue';
import en from '@/locales/en.json';
import km from '@/locales/km.json';

const locales = { en, km };

const state = reactive({
  locale: localStorage.getItem('app_locale') || 'en',
});

function tr(key, params = {}) {
  let val = locales[state.locale]?.[key];
  if (val === undefined) {
    val = locales['en']?.[key];
  }
  if (typeof val !== 'string') return key;
  return val.replace(/:(\w+)/g, (_, p) => params[p] ?? `:${p}`);
}

export function useLocale() {
  const t = (key, params) => tr(key, params);
  const locale = computed(() => state.locale);

  function setLocale(loc) {
    if (locales[loc]) {
      state.locale = loc;
      localStorage.setItem('app_locale', loc);
      document.documentElement.lang = loc;
      window.location.reload();
    }
  }

  return { t, locale, setLocale };
}
