<script setup>
defineProps({
  color: {
    type: String,
    default: 'amber', // amber, green, red
    validator: v => ['amber', 'green', 'red'].includes(v)
  },
  pulse: {
    type: Boolean,
    default: false
  },
  loopPulse: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div 
    :class="[
      'live-dot', 
      `dot-${color}`, 
      { 'pulse-once': pulse && !loopPulse, 'pulse-loop': loopPulse }
    ]"
  ></div>
</template>

<style scoped>
.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.dot-amber { background-color: var(--amber); }
.dot-green { background-color: var(--success); }
.dot-red { background-color: var(--danger); }

.pulse-once {
  animation: pulse-single 600ms ease-out;
}

.pulse-loop {
  animation: pulse-continuous 2s infinite ease-out;
}

@keyframes pulse-single {
  0% { box-shadow: 0 0 0 0 rgba(201, 130, 10, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(201, 130, 10, 0); }
  100% { box-shadow: 0 0 0 0 rgba(201, 130, 10, 0); }
}

@keyframes pulse-continuous {
  0% { box-shadow: 0 0 0 0 rgba(46, 125, 79, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(46, 125, 79, 0); }
  100% { box-shadow: 0 0 0 0 rgba(46, 125, 79, 0); }
}
</style>
