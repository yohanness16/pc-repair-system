<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const isNew = ref(false)

watch(() => props.status, () => {
  isNew.value = true
  setTimeout(() => { isNew.value = false }, 300)
})

const mappedStatus = computed(() => {
  const s = props.status.toLowerCase()
  if (s === 'pending') return { label: 'PENDING', class: 'status-pending' }
  if (s === 'approved') return { label: 'APPROVED', class: 'status-approved' }
  if (s === 'under_repair' || s === 'in_progress') return { label: 'IN PROGRESS', class: 'status-progress' }
  if (s === 'completed') return { label: 'COMPLETED', class: 'status-completed' }
  if (s === 'rejected') return { label: 'REJECTED', class: 'status-rejected' }
  return { label: props.status.toUpperCase(), class: 'status-default' }
})
</script>

<template>
  <div :class="['status-stamp', mappedStatus.class, { 'animate-stamp': isNew }]">
    {{ mappedStatus.label }}
  </div>
</template>

<style scoped>
.status-stamp {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border: 1.5px solid;
  border-radius: 2px;
  transform: rotate(-4deg);
  display: inline-block;
  text-align: center;
  white-space: nowrap;
}

.animate-stamp {
  animation: stamp-down 250ms ease-out forwards;
}

@keyframes stamp-down {
  0% { transform: rotate(-4deg) scale(0.9); opacity: 0; }
  50% { transform: rotate(-4deg) scale(1.05); opacity: 1; }
  100% { transform: rotate(-4deg) scale(1.0); }
}

.status-pending {
  color: var(--amber);
  border-color: var(--amber);
}

.status-approved {
  color: var(--navy);
  border-color: var(--navy);
}

.status-progress {
  color: var(--amber);
  border-color: var(--amber);
}

.status-completed {
  color: var(--success);
  border-color: var(--success);
}

.status-rejected {
  color: var(--danger);
  border-color: var(--danger);
}

.status-default {
  color: var(--ink-muted);
  border-color: var(--line);
}
</style>
