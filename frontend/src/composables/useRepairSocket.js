import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useRepairSocket() {
  const authStore = useAuthStore()
  const socket = ref(null)
  
  // connectionState: 'connecting', 'connected', 'disconnected'
  const connectionState = ref('disconnected')
  const lastEvent = ref(null)
  
  let reconnectTimer = null
  let retryCount = 0

  function connect() {
    if (!authStore.token) return
    
    connectionState.value = 'connecting'
    
    // Determine WS protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    // Get host/port (adjust if backend is on a different port during dev)
    const host = import.meta.env.VITE_API_URL 
      ? new URL(import.meta.env.VITE_API_URL).host 
      : window.location.host
      
    // Django Channels endpoint, passing token in query string
    const wsUrl = `${protocol}//${host}/ws/repairs/?token=${authStore.token}`

    try {
      socket.value = new WebSocket(wsUrl)
      
      socket.value.onopen = () => {
        connectionState.value = 'connected'
        retryCount = 0
      }
      
      socket.value.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          // Broadcast to whoever is listening
          lastEvent.value = { ...data, timestamp: new Date() }
        } catch (e) {
          console.error("Failed to parse WS message", e)
        }
      }
      
      socket.value.onclose = () => {
        connectionState.value = 'disconnected'
        scheduleReconnect()
      }
      
      socket.value.onerror = (err) => {
        console.error('WebSocket Error:', err)
        socket.value.close()
      }
      
    } catch (err) {
      console.error("WebSocket setup failed", err)
      connectionState.value = 'disconnected'
      scheduleReconnect()
    }
  }

  function scheduleReconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    // Exponential backoff up to 30s
    const delay = Math.min(1000 * (2 ** retryCount), 30000)
    retryCount++
    reconnectTimer = setTimeout(() => {
      connect()
    }, delay)
  }

  function disconnect() {
    if (reconnectTimer) clearTimeout(reconnectTimer)
    if (socket.value) {
      socket.value.close()
    }
    connectionState.value = 'disconnected'
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    connectionState,
    lastEvent,
    connect,
    disconnect
  }
}
