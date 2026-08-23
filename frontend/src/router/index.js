import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue')
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../pages/Dashboard.vue')
      },
      {
        path: 'equipment',
        name: 'Equipment',
        component: () => import('../pages/Equipment.vue')
      },
      {
        path: 'parts',
        name: 'Parts',
        component: () => import('../pages/Parts.vue')
      },
      {
        path: 'repairs/:id',
        name: 'RepairDetail',
        component: () => import('../pages/RepairDetail.vue')
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('../pages/Stats.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'staff',
        name: 'Staff',
        component: () => import('../pages/Staff.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../pages/Settings.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router
