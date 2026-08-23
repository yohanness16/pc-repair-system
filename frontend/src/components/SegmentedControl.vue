<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true // [{ value: 'all', label: 'All' }, ...]
  }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="segmented-control">
    <button
      v-for="opt in options"
      :key="opt.value"
      :class="['segment-btn', { active: modelValue === opt.value }]"
      @click="$emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.segmented-control {
  display: inline-flex;
  background-color: var(--paper);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 2px;
}

.segment-btn {
  background: transparent;
  border: none;
  border-radius: calc(var(--radius) - 2px);
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-muted);
  cursor: pointer;
  transition: all 150ms ease;
}

.segment-btn:hover:not(.active) {
  color: var(--ink);
}

.segment-btn.active {
  background-color: var(--surface);
  color: var(--navy);
  box-shadow: var(--shadow-sm);
}
</style>
