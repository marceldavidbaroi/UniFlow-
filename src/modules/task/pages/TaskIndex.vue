<template>
  <q-page padding>
    <TaskList />

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn rounded color="secondary" icon="add" @click="router.push('tasks/add')" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import TaskList from '../components/TaskList.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style lang="scss" scoped></style>
