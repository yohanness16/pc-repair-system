<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  to: { type: [String, Object], required: true },
  label: { type: String, required: true },
  icon: { type: String, default: '❖' },
  adminOnly: { type: Boolean, default: false }
})

const auth = useAuthStore()
const route = useRoute()

const isAllowed = computed(() => {
  if (props.adminOnly && !auth.isAdmin) return false
  return true
})

const isActive = computed(() => {
  return route.name === (typeof props.to === 'object' ? props.to.name : props.to)
})

const roleAccent = computed(() => auth.isAdmin ? 'accent-admin' : 'accent-staff')
</script>

<template>
  <RouterLink 
    v-if="isAllowed" 
    :to="to" 
    :class="['nav-item', { 'active': isActive }, roleAccent]"
  >
    <span class="nav-icon">{{ icon }}</span>
    <span class="nav-label">{{ label }}</span>
  </RouterLink>
</template>

<style scoped>
.nav-item {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  margin: 4px 0;
  color: var(--ink-muted);
  border-left: 3px solid transparent;
  transition: all 150ms ease;
  font-size: 15px;
  font-weight: 500;
}

.nav-item:hover {
  background-color: rgba(239, 238, 232, 0.5); /* --paper tint */
  color: var(--ink);
  text-decoration: none;
}

.nav-item.active {
  background-color: var(--paper);
  color: var(--ink);
}

.nav-item.active.accent-admin {
  border-left-color: var(--navy);
}

.nav-item.active.accent-staff {
  border-left-color: var(--amber);
}

.nav-icon {
  margin-right: 12px;
  font-size: 18px;
  opacity: 0.8;
}
</style>
