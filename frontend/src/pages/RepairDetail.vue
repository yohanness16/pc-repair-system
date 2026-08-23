<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../components/BaseButton.vue'
import StatusStamp from '../components/StatusStamp.vue'
import api from '../utils/api'

const route = useRoute()
const auth = useAuthStore()

// Mock data as fallback
const repair = ref({
  id: route.params.id,
  status: 'in_progress',
  equipment: { tag_number: 'TAG-8812', item_category: 'Computer', serial_number: 'SN-098765' },
  branch: { name: 'Bole' },
  remark: 'Won\'t turn on after power surge',
  report: '',
  repair_staff: { first_name: 'Yohannes', last_name: '' },
  created_at: '2023-10-24 09:00',
  repair_parts: []
})

const parts = ref([])
const selectedPart = ref('')
const selectedQty = ref(1)

async function loadData() {
  try {
    const res = await api.get('/repairs/parts/')
    parts.value = res.data.map(p => ({ ...p, stock: 'N/A' }))
  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  loadData()
})

function addPart() {
  if(!selectedPart.value) return
  const p = parts.value.find(x => x.id === selectedPart.value)
  repair.value.repair_parts.push({ part: p, quantity: selectedQty.value })
  selectedPart.value = ''
  selectedQty.value = 1
}

async function markCompleted() {
  try {
    const partsPayload = repair.value.repair_parts.map(rp => ({
      part_id: rp.part.id,
      quantity: rp.quantity
    }))
    
    await api.put(`/repairs/complete/${repair.value.id}/`, {
      status: 'completed',
      report: repair.value.report,
      parts: partsPayload
    })
    
    repair.value.status = 'completed'
  } catch (err) {
    console.error('Failed to complete', err)
  }
}

function downloadPdf() {
  window.open(`http://127.0.0.1:8000/repairs/repair/${repair.value.id}/receipt/pdf/`, '_blank')
}
</script>

<template>
  <div class="page-container repair-detail-page">
    <div class="detail-header card">
      <div class="header-left">
        <h1 class="ticket-id font-mono">#{{ repair.id }}</h1>
        <StatusStamp :status="repair.status" />
      </div>
      <div class="header-right">
        <div class="meta-item">
          <span class="label">Requested:</span>
          <span class="val font-mono">{{ repair.created_at }}</span>
        </div>
      </div>
    </div>

    <div class="detail-grid">
      <!-- LEFT COLUMN -->
      <div class="info-col">
        <div class="info-card card">
          <h3>Equipment & Issue</h3>
          <div class="info-grid">
            <div class="info-row"><span class="label">Category:</span><span class="val">{{ repair.equipment.item_category }}</span></div>
            <div class="info-row"><span class="label">Tag:</span><span class="val font-mono">{{ repair.equipment.tag_number }}</span></div>
            <div class="info-row"><span class="label">Serial:</span><span class="val font-mono">{{ repair.equipment.serial_number }}</span></div>
            <div class="info-row"><span class="label">Branch:</span><span class="val">{{ repair.branch.name }}</span></div>
          </div>
          <div class="remark-box">
            <span class="label">Initial Remark</span>
            <p>{{ repair.remark }}</p>
          </div>
        </div>

        <div v-if="repair.status === 'in_progress' || repair.status === 'pending'" class="complete-form card">
          <h3>Complete Repair</h3>
          <div class="form-group">
            <label>Final Report</label>
            <textarea v-model="repair.report" rows="4" placeholder="Describe what was fixed..."></textarea>
          </div>
          
          <div class="parts-section">
            <label>Parts Consumed</label>
            <div class="parts-list" v-if="repair.repair_parts.length > 0">
              <div class="part-row" v-for="(rp, idx) in repair.repair_parts" :key="idx">
                <span>{{ rp.part.name }}</span>
                <span class="font-mono">x{{ rp.quantity }}</span>
              </div>
            </div>
            <div class="add-part-row">
              <select v-model="selectedPart">
                <option disabled value="">Select part...</option>
                <option v-for="p in parts" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
              <input type="number" v-model="selectedQty" min="1" class="qty-input" />
              <BaseButton variant="outline" size="sm" @click="addPart">Add</BaseButton>
            </div>
          </div>

          <div class="action-footer">
            <BaseButton variant="success" @click="markCompleted">Mark as Completed</BaseButton>
          </div>
        </div>

        <div v-if="repair.status === 'completed'" class="receipt-panel card">
          <h3>Receipt Document</h3>
          <div class="pdf-preview">
            [ PDF Receipt Ready ]
          </div>
          <BaseButton variant="primary" @click="downloadPdf">Download PDF Receipt</BaseButton>
        </div>
      </div>

      <!-- RIGHT COLUMN (TIMELINE & ADMIN ACTIONS) -->
      <div class="timeline-col">
        <div v-if="auth.isAdmin && repair.status === 'pending'" class="admin-actions card">
          <h3>Admin Actions</h3>
          <div class="action-btns">
            <BaseButton variant="success">Approve</BaseButton>
            <BaseButton variant="outline" class="danger">Reject</BaseButton>
          </div>
          <hr />
          <BaseButton variant="primary" style="width:100%">Assign to Staff...</BaseButton>
        </div>

        <div class="timeline card">
          <h3>Lifecycle</h3>
          <div class="stepper">
            <div class="step active"><div class="dot"></div><div class="text">Requested</div></div>
            <div class="step active"><div class="dot"></div><div class="text">Approved</div></div>
            <div class="step active"><div class="dot"></div><div class="text">Assigned to {{ repair.repair_staff?.first_name }}</div></div>
            <div class="step current"><div class="dot pulse"></div><div class="text">In Progress</div></div>
            <div class="step pending"><div class="dot"></div><div class="text">Completed</div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.repair-detail-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ticket-id {
  font-size: 28px;
  color: var(--navy);
}
.meta-item .label {
  color: var(--ink-muted);
  margin-right: 8px;
  font-size: 13px;
}
.meta-item .val {
  font-size: 14px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.info-col, .timeline-col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h3 {
  font-size: 15px;
  color: var(--ink-muted);
  margin-bottom: 16px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  row-gap: 8px;
  column-gap: 16px;
  margin-bottom: 16px;
}
.info-row { display: contents; }
.info-row .label { color: var(--ink-muted); font-size: 13px; }

.remark-box {
  background: var(--paper);
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid var(--amber);
}
.remark-box .label {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-bottom: 4px;
}
.remark-box p { margin: 0; font-size: 14px; }

.form-group label, .parts-section label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 13px;
}
textarea, select, input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
}

.parts-section { margin-top: 16px; }
.add-part-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.qty-input { width: 60px; }
.part-row {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background: var(--paper);
  border: 1px solid var(--line);
  margin-bottom: 4px;
  border-radius: 4px;
  font-size: 13px;
}

.action-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.action-btns {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.action-btns > * { flex: 1; }
hr {
  border: none;
  border-top: 1px solid var(--line);
  margin: 16px 0;
}

/* Stepper */
.stepper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 8px;
}
.step {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}
.step:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 16px;
  bottom: -16px;
  width: 2px;
  background: var(--line);
}
.step.active::after { background: var(--navy); }

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--line);
  z-index: 1;
}
.step.active .dot { background: var(--navy); }
.step.current .dot { background: var(--amber); }

.text {
  font-size: 13px;
  color: var(--ink-muted);
}
.step.active .text, .step.current .text {
  color: var(--ink);
  font-weight: 500;
}

.receipt-panel .pdf-preview {
  height: 150px;
  background: #E8EDF2;
  border: 1px dashed var(--navy);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--navy);
  font-family: var(--font-mono);
  margin-bottom: 16px;
  border-radius: var(--radius);
}
</style>
