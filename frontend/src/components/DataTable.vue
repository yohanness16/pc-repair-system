<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
    // { key: 'id', label: 'ID', sortable: true, mono: true }
  },
  data: {
    type: Array,
    required: true
  }
})

const sortKey = ref('')
const sortAsc = ref(true)

function toggleSort(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const sortedData = computed(() => {
  if (!sortKey.value) return props.data
  
  return [...props.data].sort((a, b) => {
    let valA = a[sortKey.value]
    let valB = b[sortKey.value]
    
    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()
    
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
})
</script>

<template>
  <div class="table-container card">
    <table class="data-table">
      <thead>
        <tr>
          <th 
            v-for="col in columns" 
            :key="col.key"
            :class="{ sortable: col.sortable }"
            @click="col.sortable ? toggleSort(col.key) : null"
          >
            {{ col.label }}
            <span v-if="col.sortable" class="sort-icon">
              {{ sortKey === col.key ? (sortAsc ? '↑' : '↓') : '↕' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, idx) in sortedData" :key="row.id || idx">
          <td 
            v-for="col in columns" 
            :key="col.key"
            :class="{ 'font-mono': col.mono }"
          >
            <slot :name="`cell-${col.key}`" :row="row">
              {{ row[col.key] }}
            </slot>
          </td>
        </tr>
        <tr v-if="sortedData.length === 0">
          <td :colspan="columns.length" class="empty-state">No data available.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
  padding: 0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background-color: #F9F9F9;
  border-bottom: 2px solid var(--line);
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
}

th.sortable {
  cursor: pointer;
  user-select: none;
}

th.sortable:hover {
  background-color: #F0F0F0;
  color: var(--ink);
}

.sort-icon {
  font-family: var(--font-mono);
  font-size: 10px;
  margin-left: 4px;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: rgba(239, 238, 232, 0.4); /* slight --paper hover */
}

.font-mono {
  font-family: var(--font-mono);
}

.empty-state {
  text-align: center;
  color: var(--ink-muted);
  padding: 32px;
  font-style: italic;
}
</style>
