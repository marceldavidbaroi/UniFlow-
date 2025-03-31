<template>
  <q-toolbar
    class=""
    style="
      background: rgba(19, 79, 123, 0.3);
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
    <q-btn
      flat
      dense
      round
      icon="menu"
      size="md"
      aria-label="Menu"
      color="info"
      @click="toggleLeftDrawer"
    />

    <q-toolbar-title class="brand_sb text-h3 q-pa-sm"> UNIFLOW </q-toolbar-title>

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
  color: #e97b2f;

  display: inline-block; /* Ensures transform works properly */
  transition: color 0.3s ease-in-out;
}
.brand:hover {
  font-family: 'Londrina Shadow', cursive;

  color: #272727;
}
</style>
