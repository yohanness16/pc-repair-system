<script setup>
import BaseButton from '../components/BaseButton.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Profile & Settings</h1>
    </div>

    <div class="settings-grid">
      <div class="card">
        <h3>Profile Information</h3>
        <div class="form-group">
          <label>First Name</label>
          <input type="text" :value="auth.user?.first_name" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" :value="auth.user?.email" disabled />
        </div>
        <BaseButton variant="primary">Save Profile</BaseButton>
      </div>

      <div class="card">
        <h3>Security</h3>
        <div class="form-group">
          <label>Current Password</label>
          <input type="password" />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input type="password" />
        </div>
        <BaseButton variant="primary">Update Password</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 16px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
}
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 6px;
}
input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
input:disabled {
  background: var(--paper);
  color: var(--ink-muted);
}
</style>
