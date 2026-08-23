<script setup>
import { computed, watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import RoleGuardedNavItem from '../components/RoleGuardedNavItem.vue'
import LiveDot from '../components/LiveDot.vue'
import { useRepairSocket } from '../composables/useRepairSocket'

const auth = useAuthStore()
const router = useRouter()

const { connectionState, lastEvent } = useRepairSocket()

// simple user initials
const userInitials = computed(() => {
  if (!auth.user?.first_name) return '?'
  return auth.user.first_name.charAt(0) + (auth.user.last_name ? auth.user.last_name.charAt(0) : '')
})

// Unread notifications handling
const unreadCount = ref(0)
watch(lastEvent, (newVal) => {
  if (newVal) {
    unreadCount.value++
  }
})

const dotColor = computed(() => {
  if (connectionState.value === 'connected') return 'green'
  if (connectionState.value === 'connecting') return 'amber'
  return 'red'
})

const isUserMenuOpen = ref(false)
function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <!-- TOP BAR -->
    <header class="top-bar" :class="auth.isAdmin ? 'stripe-admin' : 'stripe-staff'">
      <div class="top-bar-left">
        <div class="wordmark">PC REPAIR SYS</div>
        <div class="connection-status" title="WebSocket Status">
          <LiveDot :color="dotColor" :loopPulse="connectionState === 'connected'" />
        </div>
      </div>

      <div class="top-bar-right">
        <!-- Notification Bell -->
        <button class="bell-btn" @click="unreadCount = 0">
          <span class="bell-icon">🔔</span>
          <span class="bell-badge" v-if="unreadCount > 0">{{ unreadCount }}</span>
        </button>

        <!-- User Menu -->
        <div class="user-menu-wrapper">
          <button class="user-trigger" @click="toggleUserMenu">
            <span class="avatar">{{ userInitials }}</span>
            <span class="user-name">{{ auth.user?.first_name || 'Staff' }}</span>
            <span class="role-badge">{{ auth.user?.role }}</span>
            <span class="chevron">▾</span>
          </button>
          
          <div v-if="isUserMenuOpen" class="user-dropdown">
            <RouterLink to="/settings" class="dropdown-item" @click="isUserMenuOpen = false">Profile & Settings</RouterLink>
            <button class="dropdown-item text-danger" @click="handleLogout">Log out</button>
          </div>
        </div>
      </div>
    </header>

    <div class="app-body">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <nav class="nav-menu">
          <RoleGuardedNavItem to="/" label="Dashboard" icon="▣" />
          <RoleGuardedNavItem to="/equipment" label="Equipment" icon="🖥" />
          <RoleGuardedNavItem to="/parts" label="Parts" icon="🧩" />
          <RoleGuardedNavItem to="/stats" label="Stats" icon="📊" adminOnly />
          <RoleGuardedNavItem to="/staff" label="Staff" icon="👤" adminOnly />
          <div class="nav-spacer"></div>
          <RoleGuardedNavItem to="/settings" label="Settings" icon="⚙" />
        </nav>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* TOP BAR */
.top-bar {
  height: 52px;
  background-color: var(--ink);
  color: var(--paper);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
  position: relative;
}

/* Role stripes */
.stripe-admin::after, .stripe-staff::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
}
.stripe-admin::after { background-color: var(--navy); }
.stripe-staff::after { background-color: var(--amber); }

.top-bar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.wordmark {
  font-family: var(--font-mono);
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 14px;
}

.connection-status {
  display: flex;
  align-items: center;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.bell-btn {
  background: transparent;
  border: none;
  color: var(--paper);
  position: relative;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
}
.bell-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--amber);
  color: #fff;
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  padding: 1px 4px;
  border-radius: 8px;
  transform: translate(25%, -25%);
}

.user-menu-wrapper {
  position: relative;
}
.user-trigger {
  background: transparent;
  border: none;
  color: var(--paper);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 0;
}
.avatar {
  background: var(--navy);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}
.user-name {
  font-weight: 500;
}
.role-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ink-muted);
  background: rgba(255,255,255,0.1);
  padding: 2px 6px;
  border-radius: 2px;
  text-transform: uppercase;
}
.chevron {
  font-size: 10px;
  opacity: 0.7;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  min-width: 160px;
  z-index: 100;
  padding: 4px 0;
}
.dropdown-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 8px 16px;
  color: var(--ink);
  background: transparent;
  border: none;
  font-size: 13px;
  cursor: pointer;
}
.dropdown-item:hover {
  background: var(--paper);
  text-decoration: none;
}
.text-danger {
  color: var(--danger);
}

/* APP BODY */
.app-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* SIDEBAR */
.sidebar {
  width: 232px;
  background-color: var(--surface);
  border-right: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.nav-menu {
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.nav-spacer {
  flex: 1;
}

/* MAIN */
.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--paper);
}

/* Transitions */
.v-enter-active,
.v-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.v-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.v-leave-to {
  opacity: 0;
}
</style>
