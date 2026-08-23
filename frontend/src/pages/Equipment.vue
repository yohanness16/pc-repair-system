<script setup>
import { ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import BaseButton from '../components/BaseButton.vue'

const equipmentData = ref([
  { id: 1, tag: 'TAG-8812', type: 'Computer', model: 'Dell OptiPlex', branch: 'Bole', status: 'In Service', last_repair: '2 days ago' },
  { id: 2, tag: 'TAG-8833', type: 'Printer', model: 'HP LaserJet', branch: 'Bole', status: 'Under Repair', last_repair: 'Just now' },
])

const columns = [
  { key: 'tag', label: 'Tag', sortable: true, mono: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'model', label: 'Model' },
  { key: 'branch', label: 'Branch', sortable: true },
  { key: 'status', label: 'Status' },
  { key: 'last_repair', label: 'Last Repaired' },
  { key: 'actions', label: '' }
]
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Equipment Directory</h1>
      <BaseButton variant="primary"> + Add Equipment </BaseButton>
    </div>
    
    <div class="controls-bar card" style="margin-bottom: 24px; display:flex; gap:16px;">
      <input type="text" placeholder="Search Tag or Serial..." class="font-mono search-input" />
      <select class="filter-select"><option>All Branches</option></select>
      <select class="filter-select"><option>All Types</option></select>
    </div>

    <DataTable :columns="columns" :data="equipmentData">
      <template #cell-status="{ row }">
        <span :class="['status-badge', row.status === 'Under Repair' ? 'warn' : 'ok']">{{ row.status }}</span>
      </template>
      <template #cell-actions="{ row }">
        <BaseButton variant="ghost" size="sm">History</BaseButton>
        <BaseButton variant="ghost" size="sm">Repair</BaseButton>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}
.status-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 12px;
  background: var(--paper);
}
.status-badge.warn { color: var(--amber); background: #fdf5e6; }
.status-badge.ok { color: var(--success); background: #e8f5ec; }
</style>
