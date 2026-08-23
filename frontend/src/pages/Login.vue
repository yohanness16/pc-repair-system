<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../utils/api'
import BaseButton from '../components/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorField = ref(null)
const errorMsg = ref('')

async function handleLogin() {
  errorField.value = null
  errorMsg.value = ''
  
  if (!email.value) {
    errorField.value = 'email'
    errorMsg.value = 'Email is required'
    return
  }
  if (!password.value) {
    errorField.value = 'password'
    errorMsg.value = 'Password is required'
    return
  }

  try {
    isLoading.value = true
    const res = await api.post('/staff/login/', {
      email: email.value,
      password: password.value
    })
    
    // We need user profile data. If login doesn't return full user, we might need a /me endpoint.
    // For now, assume we decode JWT or it returns user info.
    // Usually SimpleJWT returns { access, refresh }. We'll parse role from JWT or fetch profile.
    const token = res.data.access
    
    // Quick hack to parse JWT payload without library for role/name if backend doesn't return it
    const payload = JSON.parse(atob(token.split('.')[1]))
    // Note: your backend payload needs 'role', 'first_name'. Assuming it's there or we mock.
    const user = {
      id: payload.user_id,
      email: email.value,
      role: payload.role || (email.value.includes('admin') ? 'admin' : 'staff'), // fallback
      first_name: payload.first_name || email.value.split('@')[0]
    }

    authStore.setAuth(token, user)
    router.push('/')
  } catch (err) {
    errorField.value = 'general'
    errorMsg.value = err.response?.data?.detail || 'Invalid email or password.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="login-layout">
    <div class="login-card card">
      <div class="login-header">
        <h1>PC REPAIR SYS</h1>
        <p>Sign in to PC Repair System</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        
        <div class="form-group" :class="{ 'has-error': errorField === 'email' || errorField === 'general' }">
          <label>Email Address</label>
          <input type="email" v-model="email" placeholder="name@domain.com" autocomplete="email" />
          <span v-if="errorField === 'email'" class="error-text">{{ errorMsg }}</span>
        </div>

        <div class="form-group" :class="{ 'has-error': errorField === 'password' || errorField === 'general' }">
          <label>Password</label>
          <div class="pwd-input-wrapper">
            <input :type="showPassword ? 'text' : 'password'" v-model="password" autocomplete="current-password" />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword">
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
          </div>
          <span v-if="errorField === 'password'" class="error-text">{{ errorMsg }}</span>
          <span v-if="errorField === 'general'" class="error-text">{{ errorMsg }}</span>
        </div>

        <BaseButton type="submit" variant="primary" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Signing in...' : 'Sign in' }}
        </BaseButton>

        <div class="forgot-link">
          <a href="#">Forgot password?</a>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--paper);
}

.login-card {
  width: 100%;
  max-width: 400px;
  padding: 32px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}
.login-header h1 {
  font-family: var(--font-mono);
  color: var(--navy);
  font-size: 20px;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.login-header p {
  color: var(--ink-muted);
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--ink);
}
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--surface);
  transition: border-color 150ms ease;
}
.form-group input:focus {
  outline: none;
  border-color: var(--navy);
}

.pwd-input-wrapper {
  position: relative;
}
.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  font-size: 12px;
  color: var(--ink-muted);
  cursor: pointer;
}
.eye-btn:hover {
  color: var(--ink);
}

.has-error input {
  border-left: 3px solid var(--danger);
  border-color: var(--danger);
}
.error-text {
  display: block;
  color: var(--danger);
  font-size: 12px;
  margin-top: 4px;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

.forgot-link {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
}
</style>
