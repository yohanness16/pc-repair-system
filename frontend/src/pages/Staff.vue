<script setup>
import { ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import BaseButton from '../components/BaseButton.vue'

const staffData = ref([
  { id: 1, name: 'Yohannes', email: 'admin@cbe.com', role: 'admin', open: 0 },
  { id: 2, name: 'Sara', email: 'sara@cbe.com', role: 'staff', open: 3 },
])

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'open', label: 'Open Repairs', sortable: true },
  { key: 'actions', label: '' }
]
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Staff Management</h1>
      <BaseButton variant="primary"> + Register Staff </BaseButton>
    </div>

    <DataTable :columns="columns" :data="staffData">
      <template #cell-role="{ row }">
        <span class="role-badge" :class="row.role">{{ row.role }}</span>
      </template>
      <template #cell-actions="{ row }">
        <BaseButton variant="outline" size="sm">Reset Password</BaseButton>
      </template>
    </DataTable>
  </div>
</template>

<style scoped>
.role-badge {
  font-size: 11px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}
.role-badge.admin { color: var(--navy); background: rgba(30,58,95,0.1); }
.role-badge.staff { color: var(--amber); background: rgba(201,130,10,0.1); }
</style>
