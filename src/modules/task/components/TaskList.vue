<template>
  <div class="task-list-header">
    <div class="task-count">Tasks: {{ tasks.length }}</div>
  </div>
  <q-list class="task-list" v-if="userStore.userRole === 'student'">
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
          backgroundColor: getStatusColor(task.status || task.state),
        }"
      />
      <q-item-section>
        <div class="row items-center justify-between q-mb-xs">
          <q-item-label class="task-title">{{ task.subject }}</q-item-label>
          <q-btn-dropdown
            color="secondary"
            dense
            flat
            size="sm"
            :label="
              (task.status || task.state || 'planned').replace(/^(.)/, (c) => c.toUpperCase())
            "
            @click.stop
          >
            <q-list>
              <q-item
                v-for="status in studentStatuses"
                :key="status.value"
                clickable
                v-close-popup
                @click.stop="() => updateStudentStatus(task, status.value)"
              >
                <q-item-section>{{ status.label }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
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
        <q-item-label caption class="task-description">{{ task.description }}</q-item-label>
        <q-item-label caption class="task-deadline">
          Due: {{ formatDate(task.deadline) }}
        </q-item-label>
        <q-item-label caption class="task-state">
          Status:
          <q-chip
            :color="getStatusColor(task.status || task.state, true)"
            text-color="white"
            dense
            >{{ (task.status || task.state || 'planned').toUpperCase() }}</q-chip
          >
        </q-item-label>
        <q-btn
          color="secondary"
          label="Submit / Edit Submission"
          class="q-mt-sm"
          @click.stop="goToSubmission(task)"
          icon="send"
          dense
        />
      </q-item-section>
    </q-item>
  </q-list>
  <q-list class="task-list" v-else>
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
        <q-item-section> </q-item-section>
        <q-item-label caption class="task-description">{{ task.description }}</q-item-label>

        <q-item-label caption class="task-deadline">
          Due: {{ formatDate(task.deadline) }}
        </q-item-label>
        <q-item-label v-if="userStore.currentRole === 'teacher'" caption class="task-state">
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
  <StudentTaskDetailsDialog v-model="showStudentDialog" :task="selectedTask" />
  <TaskDetailsDialog
    v-model="showTaskDialog"
    :task="selectedTask"
    :group-options="props.groupOptions"
    :session-options="props.sessionOptions"
    @delete-task="handleDeleteTask"
    @edit="handleUpdateTask"
  />
</template>

<script setup>
import { ref } from 'vue'
import TaskDetailsDialog from './TaskDetailsDialog.vue'
import StudentTaskDetailsDialog from './StudentTaskDetailsDialog.vue'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
const userStore = useUserStore()
const router = useRouter()
const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  groupOptions: {
    type: Array,
    default: () => [],
  },
  sessionOptions: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['delete-task', 'update'])

const showTaskDialog = ref(false)
const showStudentDialog = ref(false)
const selectedTask = ref(null)

function openTaskDialog(task) {
  if (userStore.currentRole === 'student') {
    selectedTask.value = task
    showStudentDialog.value = true
  } else if (userStore.currentRole !== 'student') {
    selectedTask.value = task
    showTaskDialog.value = true
  } else {
    console.warn('Students cannot open task details dialog.')
  }
}

function goToSubmission(task) {
  router.push({ name: 'task-submit', params: { taskId: task.id || task.taskID } })
}

async function handleDeleteTask(taskId) {
  emit('delete-task', taskId)
  showTaskDialog.value = false
}

function handleUpdateTask(updatedTask) {
  emit('update', updatedTask)
}

const handleMouseenter = () => {}
const handleMouseleave = () => {}

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

function getStatusColor(status, chip = false) {
  switch ((status || '').toLowerCase()) {
    case 'ready':
      return chip ? 'positive' : '#b9f6ca'
    case 'pending':
      return chip ? 'grey-5' : '#b0bec5'
    case 'inprogress':
    case 'in progress':
      return chip ? 'info' : '#81d4fa'
    case 'done':
      return chip ? 'secondary' : '#b388ff'
    case 'submitted':
      return chip ? 'secondary' : '#b9f6ca'
    case 'graded':
      return chip ? 'positive' : '#69f0ae'
    case 'late':
      return chip ? 'warning' : '#ffe082'
    case 'draft':
      return chip ? 'warning' : '#ffe082'
    default:
      return chip ? 'grey-6' : '#ececec'
  }
}

const studentStatuses = [
  { label: 'Planned', value: 'planned' },
  { label: 'Ready', value: 'ready' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'In Review', value: 'inreview' },
  { label: 'Done', value: 'done' },
]

function updateStudentStatus(task, newStatus) {
  // Emit or call API/store to update the status for this student-task
  emit('update', { ...task, status: newStatus })
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
  position: relative;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
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
