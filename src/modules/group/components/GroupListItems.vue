<template>
  <div class="container">
    <q-item clickable v-ripple>
      <q-item-section>
        <q-item-label>{{ group.groupName }}</q-item-label>
        <div class="row">
          <div class="">Subject: {{ group.subjectName }}</div>
          <div class="col text-right text-dark">
            <span class="">&nbsp;{{ group.semester }}</span>
            <span>&nbsp;||&nbsp;{{ group.year }} </span>
            <span v-if="group.labGroup" class="text-bold text-primary"
              >&nbsp;<span class="text-black">||</span>&nbsp;Lab Group</span
            >
          </div>
        </div>
      </q-item-section>
    </q-item>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  group: Object,
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
  background-color: #f5f5f5;
}
</style>
