<script setup>
import { useAuthStore } from '../stores/auth'
import { useRepairSocket } from '../composables/useRepairSocket'
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../utils/api'
import TicketCard from '../components/TicketCard.vue'
import BaseButton from '../components/BaseButton.vue'
import SegmentedControl from '../components/SegmentedControl.vue'

import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const auth = useAuthStore()
const router = useRouter()
const { lastEvent } = useRepairSocket()

// Staff Dashboard State
const staffFilter = ref('all')
const allRepairs = ref([])

// Admin Dashboard State
const stats = ref(null)
const adminLiveFeed = ref([
  { id: 'initial', message: 'System connected.', timestamp: new Date() }
])

watch(lastEvent, (newVal) => {
  if (newVal) {
    adminLiveFeed.value.unshift(newVal)
    if (adminLiveFeed.value.length > 15) adminLiveFeed.value.pop()
    if (!auth.isAdmin) {
       loadRepairs()
    }
  }
})

async function loadRepairs() {
  try {
    const res = await api.get('/repairs/parts/')
    // We will still mock the actual repairs list because the backend has no GET /repairs/ endpoint implemented yet.
  } catch (err) {
    console.error(err)
  }
}

async function loadStats() {
  if (!auth.isAdmin) return
  try {
    const res = await api.get('/repairs/admin/stats/')
    stats.value = res.data
  } catch (err) {
    console.error('Failed to load stats', err)
    
    // Fallback to empty state structure if backend fails to return stats (e.g., redis is offline and view errors)
    stats.value = {
      monthly_repairs: { labels: [], values: [] },
      top_repair_staff: { labels: [], values: [] },
      repairs_by_branch: { labels: [], values: [] },
      top_used_parts: { labels: [], values: [] }
    }
  }
}

const chartData = computed(() => {
  if (!stats.value || !stats.value.monthly_repairs) return null
  return {
    labels: stats.value.monthly_repairs.labels,
    datasets: [
      {
        label: 'Repairs',
        backgroundColor: '#1E1E1E',
        data: stats.value.monthly_repairs.values
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}

onMounted(() => {
  if (auth.isAdmin) {
    loadStats()
  } else {
    // Mock data since no GET /repairs endpoint exists for staff
    allRepairs.value = [
      { id: 1042, status: 'pending', equipment_tag: 'TAG-8812', equipment_model: 'Computer', branch: 'Bole', remark: 'Won\'t turn on', created_at: '2023-10-24 09:00' },
      { id: 1043, status: 'in_progress', equipment_tag: 'TAG-8833', equipment_model: 'Printer', branch: 'Bole', remark: 'Paper jam sensor broken', created_at: '2023-10-24 09:30' }
    ]
  }
})

</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Overview</h1>
      <BaseButton v-if="!auth.isAdmin" variant="primary"> + Request Repair </BaseButton>
    </div>

    <!-- ADMIN DASHBOARD -->
    <div v-if="auth.isAdmin" class="admin-grid">
      <div class="main-column">
        <!-- Stat Strip -->
        <div class="stat-strip" v-if="stats">
          <div class="stat-card card">
            <span class="stat-val">{{ stats.monthly_repairs?.values?.reduce((a, b) => a + b, 0) || 0 }}</span>
            <span class="stat-label">Total Repairs</span>
          </div>
          <div class="stat-card card">
            <span class="stat-val">{{ stats.top_repair_staff?.values?.[0] || 0 }}</span>
            <span class="stat-label">Top Staff Completed</span>
          </div>
          <div class="stat-card card">
            <span class="stat-val">{{ stats.repairs_by_branch?.values?.[0] || 0 }}</span>
            <span class="stat-label">Top Branch Repairs</span>
          </div>
          <div class="stat-card card">
            <span class="stat-val text-danger">{{ stats.top_used_parts?.values?.[0] || 0 }}</span>
            <span class="stat-label">Most Used Part Qty</span>
          </div>
        </div>
        <div class="stat-strip" v-else>
           Loading stats...
        </div>

        <div class="charts-row">
          <div class="chart-box card">
            <h3>Monthly Repair Trend</h3>
            <div class="placeholder-chart">
               <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <div class="tables-row">
          <div class="leaderboard-box card">
            <h3>Top Staff</h3>
            <ul class="leaderboard" v-if="stats">
              <li v-for="(lbl, idx) in stats.top_repair_staff?.labels" :key="lbl">
                 <span class="rank font-mono">{{ idx + 1 }}</span> {{ lbl }} — {{ stats.top_repair_staff.values[idx] }} completed
              </li>
            </ul>
          </div>
          <div class="parts-box card">
            <h3>Most-used Parts</h3>
            <ul class="leaderboard" v-if="stats">
              <li v-for="(lbl, idx) in stats.top_used_parts?.labels" :key="lbl">
                {{ lbl }} — {{ stats.top_used_parts.values[idx] }} used
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Live Feed Rail -->
      <div class="right-rail">
        <div class="live-feed-panel card">
          <div class="feed-header">
            <h3>Live Activity</h3>
            <span class="pulse-dot"></span>
          </div>
          <TransitionGroup name="feed-list" tag="div" class="feed-content">
            <div v-for="evt in adminLiveFeed" :key="evt.id || evt.timestamp" class="feed-item">
              <span class="feed-time">{{ evt.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}</span>
              <p class="feed-msg">{{ evt.message }}</p>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>

    <!-- STAFF DASHBOARD -->
    <div v-else class="staff-layout">
      <div class="filters">
        <SegmentedControl 
          v-model="staffFilter" 
          :options="[
            {label: 'All', value: 'all'},
            {label: 'Pending', value: 'pending'},
            {label: 'In Progress', value: 'in_progress'},
            {label: 'Completed', value: 'completed'}
          ]" 
        />
      </div>

      <div class="ticket-grid">
        <TicketCard v-for="r in allRepairs" :key="r.id" :repair="r" @click="$router.push(`/repairs/${r.id}`)" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-grid {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.main-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  padding: 16px;
}
.stat-val {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
}
.stat-label {
  color: var(--ink-muted);
  font-size: 13px;
}
.text-danger { color: var(--danger); }
.text-muted { color: var(--ink-muted); }

.charts-row, .tables-row {
  display: flex;
  gap: 24px;
}
.chart-box, .leaderboard-box, .parts-box {
  flex: 1;
}
h3 {
  font-size: 15px;
  margin-bottom: 16px;
  color: var(--ink-muted);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
}
.placeholder-chart {
  min-height: 150px;
  background: var(--paper);
  display: flex;
  padding: 16px;
  color: var(--ink);
  border-radius: var(--radius);
}
.placeholder-chart ul { padding-left: 20px; margin: 0; }

.leaderboard {
  list-style: none;
  padding: 0;
  margin: 0;
}
.leaderboard li {
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
}
.leaderboard li:last-child {
  border-bottom: none;
}
.rank {
  display: inline-block;
  width: 20px;
  color: var(--ink-muted);
}

/* Right Rail Feed */
.right-rail {
  width: 320px;
  position: sticky;
  top: 24px;
}
.live-feed-panel {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  padding: 0;
}
.feed-header {
  padding: 16px;
  border-bottom: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.feed-header h3 { margin: 0; border: none; padding: 0;}
.pulse-dot {
  width: 8px;
  height: 8px;
  background: var(--amber);
  border-radius: 50%;
  animation: pulse-continuous 2s infinite ease-out;
}
.feed-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}
.feed-item {
  margin-bottom: 16px;
  font-size: 13px;
}
.feed-time {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-muted);
  display: block;
  margin-bottom: 2px;
}
.feed-msg { margin: 0; line-height: 1.4; }

/* Transitions */
.feed-list-enter-active {
  transition: all 300ms ease;
}
.feed-list-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

/* Staff Layout */
.staff-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.ticket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

@keyframes pulse-continuous {
  0% { box-shadow: 0 0 0 0 rgba(201, 130, 10, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(201, 130, 10, 0); }
  100% { box-shadow: 0 0 0 0 rgba(201, 130, 10, 0); }
}
</style>
