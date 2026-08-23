<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'success', 'danger', 'ghost', 'outline'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <button 
    :type="type"
    :disabled="disabled"
    :class="['base-button', `variant-${variant}`, `size-${size}`]"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 100ms ease, opacity 100ms ease;
  border: 1px solid transparent;
  outline: none;
}

.base-button:focus-visible {
  box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.4); /* --navy at 40% */
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.size-sm {
  padding: 4px 12px;
  font-size: 13px;
  height: 28px;
}
.size-md {
  padding: 8px 16px;
  font-size: 14px;
  height: 36px;
}

/* Variants */
.variant-primary {
  background-color: var(--navy);
  color: #FFF;
}
.variant-primary:hover:not(:disabled) {
  background-color: #172D4A;
}

.variant-success {
  background-color: var(--success);
  color: #FFF;
}
.variant-success:hover:not(:disabled) {
  background-color: #24633E;
}

.variant-danger {
  background-color: var(--danger);
  color: #FFF;
}
.variant-danger:hover:not(:disabled) {
  background-color: #9C3727;
}

.variant-outline {
  background-color: transparent;
  border-color: var(--line);
  color: var(--ink);
}
.variant-outline:hover:not(:disabled) {
  background-color: rgba(20, 23, 26, 0.05);
}
.variant-outline.danger {
  border-color: var(--danger);
  color: var(--danger);
}
.variant-outline.danger:hover:not(:disabled) {
  background-color: rgba(184, 65, 46, 0.05);
}

.variant-ghost {
  background-color: transparent;
  color: var(--ink-muted);
}
.variant-ghost:hover:not(:disabled) {
  background-color: rgba(20, 23, 26, 0.05);
  color: var(--ink);
}
</style>
