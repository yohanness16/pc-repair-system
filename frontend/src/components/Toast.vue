<script setup>
defineProps({
  message: String,
  show: Boolean,
  type: {
    type: String,
    default: 'info' // info, success, error
  }
})
</script>

<template>
  <Transition name="toast-slide">
    <div v-if="show" :class="['toast-box', `toast-${type}`]">
      <span>{{ message }}</span>
    </div>
  </Transition>
</template>

<style scoped>
.toast-box {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
  padding: 12px 16px;
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  z-index: 2000;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
}

.toast-success { border-left: 4px solid var(--success); }
.toast-error { border-left: 4px solid var(--danger); }
.toast-info { border-left: 4px solid var(--navy); }

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 200ms ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
