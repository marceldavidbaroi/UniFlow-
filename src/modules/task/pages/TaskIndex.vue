<template>
  <q-page padding>
    <TaskList
      :tasks="taskStore.taskList"
      @delete-task="handleDeleteTask"
      @update="handleUpdateTask"
    />

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn rounded color="secondary" icon="add" @click="router.push('tasks/add')" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import TaskList from '../components/TaskList.vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from 'src/stores/taskStore'
const taskStore = useTaskStore()
const router = useRouter()

onMounted(async () => {
  await taskStore.getTasks()

  console.log('Tasks loaded:', taskStore.taskList)
})

async function handleDeleteTask(taskId) {
  await taskStore.deleteTask(taskId)
  await taskStore.getTasks()

  // Optionally, you can refresh the task list here if needed
}

async function handleUpdateTask(updatedTask) {
  if (updatedTask && updatedTask.id) {
    await taskStore.updateTask(updatedTask.id, updatedTask)
    await taskStore.getTasks()
  }
}
</script>

<style lang="scss" scoped></style>
