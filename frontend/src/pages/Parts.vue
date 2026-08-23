<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '../components/DataTable.vue'
import BaseButton from '../components/BaseButton.vue'
import api from '../utils/api'

const partsData = ref([])

const columns = [
  { key: 'name', label: 'Part Name', sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: '' }
]

onMounted(async () => {
  try {
    const res = await api.get('/repairs/parts/')
    partsData.value = res.data
  } catch (err) {
    console.error(err)
  }
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Parts Inventory</h1>
      <BaseButton variant="primary"> + Add Part </BaseButton>
    </div>

    <DataTable :columns="columns" :data="partsData">
      <template #cell-actions="{ row }">
        <BaseButton variant="ghost" size="sm">Edit</BaseButton>
      </template>
    </DataTable>
  </div>
</template>
