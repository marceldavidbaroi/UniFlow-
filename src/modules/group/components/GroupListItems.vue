<template>
  <q-item clickable v-ripple>
    <q-item-section>
      <q-item-label>{{ group.groupName }}</q-item-label>
      <q-item-label caption>Admin: {{ group.semester }}</q-item-label>
      <q-item-label caption>Admin: {{ group.subjectName }}</q-item-label>
      <q-item-label caption>Admin: {{ group.year }}</q-item-label>
      <q-item-label caption>Admin: {{ group.labGroup }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <!-- <q-btn flat round icon="delete" color="negative" @click.stop="$emit('delete', group.id)" /> -->
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  group: Object,
})
</script>

<style scoped>
.q-item {
  transition: background-color 0.3s;
}
.q-item:hover {
  background-color: #f5f5f5;
}
</style>
