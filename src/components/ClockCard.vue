<template>
  <q-card
    flat
    class="q-py-none q-pr-sm q-ma-none flex flex-center text-heading-shadow cursor-none"
    style="background: rgba(255, 255, 255, 0)"
  >
    <q-card-section class="q-pa-none">
      <div class="text-h6 text-primary">{{ time }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const time = ref(getFormattedTime())

function getFormattedTime() {
  const now = new Date()
  let hours = now.getHours()
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12 // Convert to 12-hour format
  return hours.toString().padStart(2, '0') + ':' + minutes + ' ' + ampm
}

const updateTime = () => {
  time.value = getFormattedTime()
}

let interval = setInterval(updateTime, 1000)

onMounted(() => {
  updateTime()
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.q-card {
  width: fit-content;
  text-align: center;
  background-color: #1e1e1e;
  color: white;
  border-radius: 10px;
}

.text-heading-shadow {
  font-family: 'Londrina Solid', cursive;
  color: #c29d48;
}
.text-heading-shadow:hover {
  font-family: 'Londrina Shadow', cursive;
  color: #c29d48;
}
</style>
