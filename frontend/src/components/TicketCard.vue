<script setup>
import { computed, ref, watch } from 'vue'
import StatusStamp from './StatusStamp.vue'
import LiveDot from './LiveDot.vue'

const props = defineProps({
  repair: {
    type: Object,
    required: true
  }
})

const isUpdated = ref(false)
let highlightTimeout = null

watch(() => props.repair, (newVal, oldVal) => {
  if (oldVal && newVal.updatedAt !== oldVal.updatedAt) {
    isUpdated.value = true
    if (highlightTimeout) clearTimeout(highlightTimeout)
    highlightTimeout = setTimeout(() => { isUpdated.value = false }, 1500)
  }
}, { deep: true })
</script>

<template>
  <div :class="['ticket-card', { 'just-updated': isUpdated }]">
    <!-- The physical tag look -->
    <div class="ticket-notch"></div>
    <div class="ticket-perforation"></div>

    <div class="ticket-content">
      <div class="ticket-header">
        <span class="ticket-id">#{{ repair.id }}</span>
        <div class="ticket-stamp-wrapper">
          <StatusStamp :status="repair.status" />
        </div>
      </div>
      
      <div class="ticket-body">
        <div class="equipment-meta">
          <span class="equip-tag">{{ repair.equipment_tag || repair.equipment?.tag_number || 'N/A' }}</span>
          <span class="equip-model">{{ repair.equipment_model || repair.equipment?.item_category || 'Unknown Equipment' }}</span>
        </div>
        <div class="branch-meta">{{ repair.branch || repair.equipment_branch || repair.equipment?.branch?.name || 'Unknown Branch' }}</div>
        
        <div class="remarks-preview">{{ repair.remark || 'No remarks provided.' }}</div>
      </div>

      <div class="ticket-footer">
        <span class="timestamp">{{ repair.created_at || 'Just now' }}</span>
        <div class="staff-assignment">
          <span class="staff-name" v-if="repair.repair_staff_name">{{ repair.repair_staff_name }}</span>
          <span class="unassigned" v-else>Unassigned</span>
        </div>
        <LiveDot v-if="isUpdated" color="amber" pulse />
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket-card {
  position: relative;
  background-color: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  display: flex;
  min-height: 140px;
  overflow: hidden;
  transition: background-color 1.5s ease;
  cursor: pointer;
}

.ticket-card:hover {
  border-color: #c0bcb3;
}

.ticket-card.just-updated {
  background-color: #E8EDF2; /* pale navy tint */
  transition: none; /* snap to color, then fade back */
}

/* The notch */
.ticket-notch {
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: var(--paper); /* Match page background */
  border-radius: 50%;
  border-right: 1px solid var(--line);
  z-index: 10;
}

/* Perforation */
.ticket-perforation {
  width: 24px;
  border-right: 1px dashed var(--line);
  background-color: transparent;
  flex-shrink: 0;
}

/* Content */
.ticket-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.ticket-id {
  font-family: var(--font-mono);
  font-weight: 600;
  font-size: 15px;
  color: var(--navy);
}

.ticket-stamp-wrapper {
  margin-top: -4px;
  margin-right: -4px;
}

.ticket-body {
  flex: 1;
}

.equip-tag {
  font-family: var(--font-mono);
  font-weight: 600;
  margin-right: 8px;
}

.equip-model {
  color: var(--ink-muted);
}

.branch-meta {
  font-size: 12px;
  color: var(--ink-muted);
  margin-top: 4px;
}

.remarks-preview {
  margin-top: 12px;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.ticket-footer {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-muted);
}

.unassigned {
  font-style: italic;
  opacity: 0.7;
}

.staff-name {
  background: rgba(30, 58, 95, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--navy);
}
</style>
