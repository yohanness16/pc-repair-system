<script setup>
defineProps({
  show: Boolean,
  title: String,
  width: {
    type: String,
    default: '400px'
  }
})
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="drawer-fade">
      <div v-if="show" class="drawer-backdrop" @click.self="$emit('close')">
        <div class="drawer-panel" :style="{ width }">
          <div class="drawer-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="$emit('close')">✕</button>
          </div>
          <div class="drawer-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(20, 23, 26, 0.4);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.drawer-panel {
  background: var(--surface);
  height: 100%;
  box-shadow: -4px 0 12px rgba(20,23,26,0.1);
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--line);
}

.drawer-header h3 {
  font-size: 18px;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 16px;
  color: var(--ink-muted);
  cursor: pointer;
}
.close-btn:hover {
  color: var(--ink);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* Transition */
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 250ms ease;
}
.drawer-fade-enter-active .drawer-panel,
.drawer-fade-leave-active .drawer-panel {
  transition: transform 250ms ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}
.drawer-fade-enter-from .drawer-panel {
  transform: translateX(100%);
}
.drawer-fade-leave-to .drawer-panel {
  transform: translateX(100%);
}
</style>
