import { ref, computed } from 'vue';

export function usePasswordStrength() {
  const password = ref('');

  const strength = computed(() => {
    const p = password.value;
    if (!p) return { score: 0, label: '', color: 'bg-gray-200', textColor: 'text-gray-500' };

    let score = 0;
    if (p.length >= 8) score += 25;
    if (p.length >= 12) score += 10;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score += 25;
    if (/\d/.test(p)) score += 20;
    if (/[^a-zA-Z0-9]/.test(p)) score += 20;

    if (score < 30) return { score, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-500' };
    if (score < 60) return { score, label: 'Fair', color: 'bg-orange-500', textColor: 'text-orange-500' };
    if (score < 80) return { score, label: 'Good', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-500' };
  });

  return { password, strength };
}
