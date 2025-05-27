<template>
  <div class="task-list-header">
    <div class="task-count">Tasks: {{ tasks.length }}</div>
  </div>
  <q-list class="task-list">
    <q-item
      v-for="task in props.tasks"
      :key="task.taskID"
      clickable
      class="task-card"
      @mouseenter="(event) => handleMouseenter(task, event)"
      @mouseleave="handleMouseleave"
      @click="openTaskDialog(task)"
    >
      <div
        class="task-state-bar-vertical"
        :style="{
          backgroundColor: task.state === 'ready' ? '#b9f6ca' : '#ffe082',
        }"
      />
      <q-item-section>
        <q-item-label class="task-title">{{ task.subject }}</q-item-label>
        <div class="task-meta-row">
          <q-chip dense color="secondary" text-color="white" icon="task">
            Total tasks: {{ task.tasks ? task.tasks.length : 0 }}
          </q-chip>
          <q-chip dense color="info" text-color="white" icon="schedule">
            Remaining: {{ getRemainingTime(task.deadline) }}
          </q-chip>
        </div>
        <q-linear-progress
          v-if="task.deadline"
          :value="getProgress(task.deadline)"
          color="secondary"
          track-color="grey-3"
          class="task-progress-bar q-mb-sm"
        />
        <q-item-section>
          <!-- <q-select
            v-model="task.status"
            :options="statusOptions"
            label="Status"
            dense
            outlined
            class="task-status-dropdown"
          /> -->
        </q-item-section>
        <q-item-label caption class="task-description">{{ task.description }}</q-item-label>

        <!-- <q-linear-progress
          :value="task.progress"
          :color="getProgressColor(task.progress)"
          track-color="grey-3"
          class="task-progress"
        /> -->
        <q-item-label caption class="task-deadline">
          Due: {{ formatDate(task.deadline) }}
        </q-item-label>
        <q-item-label caption class="task-state">
          State:
          <span
            :class="{
              'text-positive': task.state === 'ready',
              'text-warning': task.state === 'draft',
            }"
            >{{ task.state || 'draft' }}</span
          >
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
  <TaskDetailsDialog
    v-model="showTaskDialog"
    :task="selectedTask"
    @delete-task="handleDeleteTask"
    @edit="handleUpdateTask"
  />
</template>

<script setup>
import { ref } from 'vue'
import TaskDetailsDialog from './TaskDetailsDialog.vue'
import { useUserStore } from 'src/stores/user-store'
const userStore = useUserStore()
const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['delete-task', 'update'])

const showTaskDialog = ref(false)
const selectedTask = ref(null)

function openTaskDialog(task) {
  if (userStore.currentRole !== 'student') {
    selectedTask.value = task
    showTaskDialog.value = true
  } else {
    console.warn('Students cannot open task details dialog.')
  }
}

async function handleDeleteTask(taskId) {
  emit('delete-task', taskId)
  showTaskDialog.value = false
}

function handleUpdateTask(updatedTask) {
  emit('update', updatedTask)
}

// Dummy data for tasks
// const tasks = ref([
//   {
//     taskID: '1',
//     subject: 'Complete Assignment',
//     description: 'Finish the math assignment on calculus.',
//     progress: 0.5,
//     deadline: '2025-05-01',
//     status: 'Pending',
//   },
//   {
//     taskID: '2',
//     subject: 'Prepare Presentation',
//     description: 'Create slides for the science project presentation.',
//     progress: 0.7,
//     deadline: '2025-05-03',
//     status: 'In Progress',
//   },
//   {
//     taskID: '3',
//     subject: 'Submit Report',
//     description: 'Submit the final report for the history project.',
//     progress: 1.0,
//     deadline: '2025-05-05',
//     status: 'Completed',
//   },
//   {
//     taskID: '4',
//     subject: 'Read Chapter 5',
//     description: 'Read chapter 5 of the history textbook and take notes.',
//     progress: 0.2,
//     deadline: '2025-05-08',
//     status: 'Pending',
//   },
//   {
//     taskID: '5',
//     subject: 'Code Functionality',
//     description: 'Implement the user authentication functionality.',
//     progress: 0.9,
//     deadline: '2025-05-10',
//     status: 'In Progress',
//   },
//   {
//     taskID: '6',
//     subject: 'Review Draft',
//     description: 'Review the first draft of the research paper.',
//     progress: 0.6,
//     deadline: '2025-05-12',
//     status: 'In Progress',
//   },
//   {
//     taskID: '7',
//     subject: 'Attend Meeting',
//     description: 'Attend the team meeting at 2 PM.',
//     progress: 1.0,
//     deadline: '2025-05-02',
//     status: 'Completed',
//   },
// ])

// const statusOptions = ['Pending', 'In Progress', 'Completed']

const handleMouseenter = () => {}
const handleMouseleave = () => {}

// const getProgressColor = (progress) => {
//   if (progress < 0.33) return 'red'
//   if (progress < 0.66) return 'orange'
//   return 'green'
// }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function getRemainingTime(deadline) {
  if (!deadline) return ''
  const now = new Date()
  const end = new Date(deadline)
  const diff = end - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  return `${days}d ${hours}h`
}

function getProgress(deadline) {
  if (!deadline) return 0
  const now = new Date()
  const end = new Date(deadline)
  const diff = end - now
  const total = end - new Date(deadline.split('T')[0])
  return Math.max(0, Math.min(1, 1 - diff / total))
}
</script>

<style lang="scss" scoped>
.task-list-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 32px;
  margin: 0 0 12px 8px;
  font-size: 16px;
  font-weight: 500;
  color: #607d8b;
}

.task-count,
.session-count {
  background: #f5f5f5;
  border-radius: 6px;
  padding: 4px 12px;
}

.task-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  padding: 16px;
}

.task-card {
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  position: relative; /* Needed for proper positioning of potential children */
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer; /* Indicate it's interactive */
}

.task-state-bar-vertical {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 7px;
  border-radius: 8px 0 0 8px;
  transition: background 0.3s;
}

.task-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.task-meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.task-status-dropdown {
  margin-bottom: 8px;
}

.task-description {
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
}

.task-progress {
  margin: 8px 0;
}

.task-progress-bar {
  height: 4px;
  border-radius: 2px;
}

.task-deadline {
  font-size: 12px;
  color: #999;
}

.task-state {
  font-size: 12px;
  color: #999;
}
</style>
