<template>
  <q-page class="student-dashboard q-pa-md">
    <!-- Header -->
    <div class="row justify-between items-center q-mb-md">
      <div class="text-h5 text-weight-bold text-secondary">
        Welcome, {{ userStore.currentUser?.name || 'Student' }}
      </div>
      <q-btn flat icon="event" color="secondary" @click="showCalendar = true" />
    </div>

    <!-- Centered Calendar Popup -->
    <q-dialog v-model="showCalendar" persistent>
      <q-card class="q-pa-none">
        <q-date v-model="selectedDate" landscape color="secondary" mask="YYYY-MM-DD" />
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Grid Layout for Tables -->
    <div v-if="!isLoading" class="row q-col-gutter-lg q-mt-md">
      <DashboardCard
        icon="checklist"
        title="Tasks"
        :rows="tasks"
        :columns="taskColumns"
        @row-click="onTaskClick"
      />
      <DashboardCard
        icon="event_note"
        title="Sessions"
        :rows="sessions"
        :columns="sessionColumns"
        @row-click="onSessionClick"
      />
      <DashboardCard
        icon="groups"
        title="Groups"
        :rows="groups"
        :columns="groupColumns"
        @row-click="onGroupClick"
      />
    </div>
    <div
      v-else
      :style="{
        height: '70vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }"
    >
      <q-spinner-grid size="50px" color="secondary" />
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import DashboardCard from '../components/DashboardCard.vue'
import { useGroupStore } from 'src/stores/group-store'
import { useSessionStore } from 'src/stores/sessionStore'
import { useTaskStore } from 'src/stores/taskStore'
import { useRouter } from 'vue-router'

const groupStore = useGroupStore()
const sessionStore = useSessionStore()
const taskStore = useTaskStore()
const router = useRouter()

const userStore = useUserStore()
const selectedDate = ref(new Date().toISOString().split('T')[0]) // Default to today's date
const showCalendar = ref(false)
const isLoading = ref(false)
onMounted(async () => {
  isLoading.value = true
  // Fetch user data when the component is mounted
  await groupStore.fetchGroupsByStudent()
  await sessionStore.fetchParticipatingSessions()
  const groupIDs = groupStore.groupList.map((g) => g.id)
  tasks.value = await taskStore.getTasksByGroupIds(groupIDs)
  groups.value = groupStore.groupList
  sessions.value = sessionStore.sessionList.filter(
    (s) => new Date(s.sessionDate).toDateString() === new Date().toDateString(),
  )

  console.log('Sessions:', sessions.value)

  isLoading.value = false
})

const onSessionClick = (row) => {
  router.push(`/session/student/${row.id}`)
}

const onGroupClick = (row) => {
  router.push(`/group/${row.id}`)
}

const tasks = ref([])

const sessions = ref([])

const groups = ref([])

const taskColumns = [
  { name: 'subject', label: 'Task', field: 'subject', align: 'left' },
  { name: 'deadline', label: 'Due Date', field: 'deadline', align: 'left' },
  {
    name: 'totalMarks',
    label: 'Total Marks',
    field: 'totalMarks',
    align: 'left',
  },
]

const sessionColumns = [
  {
    name: 'sessionName',
    label: 'Session Name',
    field: (row) => row.sessionName,
    align: 'left',
    sortable: true,
  },
  {
    name: 'sessionDate',
    label: 'Date',
    field: (row) => row.sessionDate,
    align: 'left',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: (row) => row.isActive,
    align: 'left',
    sortable: true,
    format: (val) => (val ? 'ACTIVE' : 'Inactive'),
    style: (row) => `color: ${row.isActive ? 'green' : 'gray'}; font-weight: 600;`,
  },
]

const groupColumns = [
  {
    name: 'groupName',
    label: 'Group Name',
    field: (row) => row.groupName,
    align: 'left',
    sortable: true,
  },
  {
    name: 'courseCode',
    label: 'Course Code',
    field: (row) => row.course?.code || '',
    align: 'left',
    sortable: true,
  },
  {
    name: 'members',
    label: 'Members',
    field: (row) => row.members?.length || 0,
    align: 'left',
    sortable: true,
  },
]
</script>

<style scoped>
.student-dashboard {
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
</style>
