<template>
  <q-page padding>
    <template v-if="taskStore.taskList && taskStore.taskList.length > 0">
      <TaskList
        :tasks="taskStore.taskList"
        :group-options="groupOption"
        :session-options="sessionOptions"
        @delete-task="handleDeleteTask"
        @update="handleUpdateTask"
      />
    </template>
    <template v-else>
      <div class="q-mt-xl flex flex-center column no-tasks-container">
        <q-icon name="inbox" size="64px" color="grey-5" class="q-mb-md" />
        <div class="text-h6 text-grey-7 q-mb-xs">No tasks found</div>
        <div class="text-subtitle2 text-grey-5 q-mb-md">
          You have no tasks yet. Click the + button to add your first task!
        </div>
      </div>
    </template>

    <q-page-sticky position="bottom-right" :offset="[20, 20]">
      <q-btn rounded color="secondary" icon="add" @click="router.push('tasks/add')" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import TaskList from '../components/TaskList.vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from 'src/stores/taskStore'
import { useSessionStore } from 'src/stores/sessionStore'
import { useGroupStore } from 'src/stores/group-store'
import { useUserStore } from 'src/stores/user-store'
const userStore = useUserStore()
const groupStore = useGroupStore()
const sessionStore = useSessionStore()
const taskStore = useTaskStore()
const router = useRouter()
const sessionOptions = ref([])
const groupOption = ref([])
const sessionTask = ref([])
const groupTask = ref([])
const sessionIDs = ref([]) // Add this line
const groupIDs = ref([]) // Add this line
onMounted(async () => {
  sessionOptions.value = await sessionStore.getAllSessionsForCurrentUser()
  sessionIDs.value = Array.isArray(sessionOptions.value)
    ? sessionOptions.value.map((s) => s.id)
    : []
  groupOption.value = await groupStore.getAllGroupsForCurrentUser()
  groupIDs.value = Array.isArray(groupOption.value) ? groupOption.value.map((g) => g.id) : []
  if (userStore.currentRole === 'teacher') {
    await taskStore.getTasks()
  } else {
    const sessionTasksResult = await taskStore.getTasksBySessionIds(sessionOptions.value)
    const groupTasksResult = await taskStore.getTasksByGroupIds(groupIDs.value)
    sessionTask.value = Array.isArray(sessionTasksResult) ? sessionTasksResult : []
    groupTask.value = Array.isArray(groupTasksResult) ? groupTasksResult : []
    // Merge and deduplicate tasks by id
    const mergedTasks = [...sessionTask.value, ...groupTask.value]
    const uniqueTasksMap = new Map()
    mergedTasks.forEach((task) => {
      if (task && task.id) uniqueTasksMap.set(task.id, task)
    })
    taskStore.taskList = Array.from(uniqueTasksMap.values())
    console.log(groupTasksResult)
  }

  // Create a new array with just the session IDs
})

const handleDeleteTask = async (taskId) => {
  await taskStore.deleteTask(taskId)
  await taskStore.getTasks()

  // Optionally, you can refresh the task list here if needed
}

const handleUpdateTask = async (updatedTask) => {
  // Ensure groupID and sessionId are arrays of IDs for backend compatibility
  const normalizedTask = { ...updatedTask }
  if (Array.isArray(normalizedTask.groupID)) {
    normalizedTask.groupID = normalizedTask.groupID.map((g) => (typeof g === 'object' ? g.id : g))
  }
  if (Array.isArray(normalizedTask.sessionId)) {
    normalizedTask.sessionId = normalizedTask.sessionId.map((s) =>
      typeof s === 'object' ? s.id : s,
    )
  }
  if (normalizedTask && normalizedTask.id) {
    await taskStore.updateTask(normalizedTask.id, normalizedTask)
    await taskStore.getTasks()
  }
}
</script>

<style lang="scss" scoped>
.no-tasks-container {
  min-height: 300px;
}
</style>
