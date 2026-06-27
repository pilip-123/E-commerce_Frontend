<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm' },
  message: { type: String, default: 'Are you sure?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  loading: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="emit('cancel')">
        <div class="modal" role="dialog" aria-modal="true">
          <div class="modal__icon" :class="{ 'modal__icon--danger': danger }">
            <svg v-if="danger" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <h3 class="modal__title">{{ title }}</h3>
          <p class="modal__message">{{ message }}</p>
          <div class="modal__actions">
            <button class="button button--ghost" type="button" :disabled="loading" @click="emit('cancel')">
              {{ cancelText }}
            </button>
            <button
              class="button"
              :class="{ 'button--danger': danger }"
              type="button"
              :disabled="loading"
              @click="emit('confirm')"
            >
              {{ loading ? 'Processing...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal {
  width: min(400px, calc(100% - 32px));
  padding: 32px;
  border-radius: var(--radius-xl);
  background: #fff;
  box-shadow: 0 32px 60px rgba(0, 0, 0, 0.18);
  text-align: center;
}

.modal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 16px;
}

.modal__icon--danger {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.modal__title {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.modal__message {
  margin: 0 0 24px;
  color: var(--muted);
  line-height: 1.5;
}

.modal__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

@media (max-width: 640px) {
  .modal__actions {
    flex-direction: column;
  }

  .modal__actions .button {
    width: 100%;
  }

  .modal {
    padding: 24px 20px;
  }

  .modal__title {
    font-size: 1.05rem;
  }
}

.button--danger {
  background: #dc2626;
}

.button--danger:hover {
  background: #b91c1c;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: scale(0.95) translateY(8px);
}

.modal-leave-to .modal {
  transform: scale(0.95) translateY(8px);
}
</style>
