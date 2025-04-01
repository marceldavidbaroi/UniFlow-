<template>
  <div class="container">
    <q-item clickable v-ripple>
      <q-item-section>
        <q-item-label>{{ session.sessionName }}</q-item-label>
        <div class="row justify-between">
          <div>{{ session.sessionLength }}</div>
          <div>
            <span>
              <q-icon name="question_answer" :color="session.isActive ? 'green' : 'red'" />
            </span>
            <span>
              <q-icon name="fiber_manual_record" :color="session.isActive ? 'green' : 'red'" />
            </span>
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  session: Object,
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.q-item {
  width: 800px;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.q-item:hover {
  background-color: var(--brand-bl);
}
</style>
