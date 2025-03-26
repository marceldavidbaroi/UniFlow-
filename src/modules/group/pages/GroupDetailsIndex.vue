<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h5">{{ group.name }}</div>
        <q-item-label caption>Admin: {{ group.admin }}</q-item-label>
        <q-item-label caption>Batch: {{ group.batch }}</q-item-label>
        <q-item-label caption>Semester: {{ group.semester }}</q-item-label>
        <q-item-label caption>Year: {{ group.year }}</q-item-label>
        <q-item-label caption>Subject: {{ group.subject }}</q-item-label>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">Description</div>
        <q-item-label>{{ group.description }}</q-item-label>
      </q-card-section>

      <q-card-section>
        <div class="text-subtitle1">Group Rules</div>
        <q-item-label>{{ group.rules }}</q-item-label>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const group = ref({
  id: route.params.id,
  name: 'Physics Batch 2025',
  admin: 'Alice',
  batch: '2025',
  semester: 'Spring',
  year: 2025,
  subject: 'Physics',
  description: 'This group is for physics students of batch 2025 to discuss study materials.',
  rules: 'Be respectful. No spamming. Stay on topic.',
})
</script>

<style scoped>
.q-card {
  max-width: 600px;
  margin: auto;
}
</style>
