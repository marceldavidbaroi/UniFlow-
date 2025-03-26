<template>
  <q-page class="q-pa-md">
    this is new new
    <GroupListItems v-for="group in groups" :key="group.id" :group="group" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import GroupListItems from '../components/GroupListItems.vue'

const groups = ref([
  { id: 1, name: 'Physics Batch 2025', admin: 'Alice' },
  { id: 2, name: 'Computer Science 3rd Semester', admin: 'Bob' },
  { id: 3, name: 'Mathematics Lab Group', admin: 'Charlie' },
])
</script>

<style scoped>
.q-list {
  max-width: 600px;
  margin: auto;
}
</style>
