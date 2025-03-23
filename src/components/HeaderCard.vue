<template>
  <q-toolbar
    class=""
    style="
      background: rgba(255, 255, 255, 0);
      backdrop-filter: blur(8px);
      width: 98%;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    "
  >
    <q-btn flat dense round icon="menu" aria-label="Menu" color="dark" @click="toggleLeftDrawer" />

    <q-toolbar-title class="brand text-h3 q-pa-sm">
      UNIFLOW
      <!-- <q-img src="/public/images/Logo-nav.svg" height="50px" width="170px" /> -->
    </q-toolbar-title>

    <div>
      <ClockCard />
    </div>
  </q-toolbar>
</template>

<script setup>
import { defineEmits } from 'vue'
import ClockCard from 'src/components/ClockCard.vue'

const emit = defineEmits(['toggle-drawer']) // Define the event

function toggleLeftDrawer() {
  emit('toggle-drawer') // Emit event when button is clicked
}
</script>

<style lang="scss" scoped>
.brand {
  font-family: 'Londrina solid', cursive;
  color: #c29d48;

  display: inline-block; /* Ensures transform works properly */
  transition: color 0.3s ease-in-out;
}
.brand:hover {
  font-family: 'Londrina Shadow', cursive;

  color: #272727;
}
</style>
