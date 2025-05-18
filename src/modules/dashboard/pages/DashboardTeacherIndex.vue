<template>
  <q-page padding>
    {{ userStore.currentUser }}
    <div class="text-h4 brand_sb text-center q-mb-md">Dashboard</div>

    <!-- Action Buttons -->
    <div class="row justify-between items-center q-mb-lg">
      <div class="text-bold text-secondary">
        Total Groups: {{ groupStore.groupCount }} | Total Sessions: {{ sessionStore.sessionCount }}
      </div>
      <div class="q-gutter-sm">
        <q-btn flat color="secondary" icon="groups" @click="router.push('/group/create')">
          <q-tooltip>Create a Group</q-tooltip>
        </q-btn>
        <q-btn flat color="secondary" icon="event" @click="router.push('/session/create')">
          <q-tooltip>Create a Session</q-tooltip>
        </q-btn>
        <q-btn flat color="secondary" icon="calendar_today" @click="showCalendar = true">
          <q-tooltip>Calendar</q-tooltip>
        </q-btn>
        <q-dialog v-model="showCalendar">
          <q-date v-model="selectedDate" color="secondary">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="secondary" flat v-close-popup />
            </div>
          </q-date>
        </q-dialog>
      </div>
    </div>

    <!-- Overview Section -->
    <div class="row q-gutter-md justify-center q-mt-md">
      <div class="col-12 col-md-9">
        <q-card flat bordered class="bg-light">
          <q-card-section>
            <div class="text-h6 text-secondary text-center q-mb-md">Overview</div>
            <div class="row q-gutter-md justify-center">
              <div class="col-auto">
                <div style="width: 100%; height: 300px">
                  <canvas ref="groupStudentChart"></canvas>
                </div>
              </div>
              <div class="col-auto">
                <div style="width: 100%; height: 300px">
                  <canvas ref="sessionTypeChart"></canvas>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Group and Session Details -->
        <q-card flat bordered class="q-mt-md bg-light">
          <q-card-section>
            <div class="text-h6 text-secondary text-center q-mb-md">Group and Session Details</div>
            <q-table
              title="Groups and Sessions"
              :rows="tableData"
              :columns="columns"
              row-key="name"
              :sortable="true"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>

        <!-- Task Management -->
        <q-card flat bordered class="q-mt-md bg-light">
          <q-card-section>
            <div class="text-h6 text-secondary text-center q-mb-md">Task Management</div>
            <q-list bordered separator class="q-mt-md">
              <q-item v-for="(task, index) in tasks" :key="index">
                <q-item-section>
                  <q-item-label>{{ task.title }}</q-item-label>
                  <q-item-label caption>{{ task.description }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-checkbox v-model="task.completed" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import { useGroupStore } from 'src/stores/group-store'
import { useSessionStore } from 'src/stores/sessionStore'
const groupStore = useGroupStore()
const sessionStore = useSessionStore()

Chart.register(...registerables)

const userStore = useUserStore()
const router = useRouter()

const showCalendar = ref(false)
const selectedDate = ref(new Date())

const groupStudentChart = ref(null)
const sessionTypeChart = ref(null)

const createGroupStudentChart = () => {
  const ctx = groupStudentChart.value.getContext('2d')

  // Define theme-appropriate colors
  const themeColors = [
    'rgba(75, 192, 192, 0.2)', // Teal
    'rgba(153, 102, 255, 0.2)', // Purple
    'rgba(255, 159, 64, 0.2)', // Orange
    'rgba(255, 99, 132, 0.2)', // Red
    'rgba(54, 162, 235, 0.2)', // Blue
  ]

  const borderColors = [
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
  ]

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: graphDataGroup.value.groupNames, // Use labels for hover
      datasets: [
        {
          label: '# of Students',
          data: graphDataGroup.value.groupData,
          backgroundColor: themeColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false, // Hides the legend with color boxes
        },
        title: {
          display: true, // Adds a label at the top of the donut chart
          text: 'Group Distribution',
          font: {
            size: 18,
            color: 'black', // Sets the label color to black
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label // Show the label instead of the count
            },
          },
        },
      },
    },
  })
}

const graphDataGroup = ref()

const getgraphDataGroup = () => {
  const groupNames = []
  const groupData = []

  groupStore.groupList.forEach((group) => {
    groupNames.push(group.groupName)
    groupData.push(group.members.length)
  })

  return { groupNames, groupData }
}
const graphDataSession = ref()

const getgraphDataSession = () => {
  const sessionNames = []
  const sessionData = []

  sessionStore.sessionList.forEach((session) => {
    sessionNames.push(session.sessionName)
    sessionData.push(session.participants.length)
  })

  return { sessionNames, sessionData }
}

const createSessionTypeChart = () => {
  const ctx = sessionTypeChart.value.getContext('2d')

  // Define theme-appropriate colors
  const themeColors = [
    'rgba(75, 192, 192, 0.2)', // Teal
    'rgba(153, 102, 255, 0.2)', // Purple
    'rgba(255, 159, 64, 0.2)', // Orange
    'rgba(255, 99, 132, 0.2)', // Red
    'rgba(54, 162, 235, 0.2)', // Blue
  ]

  const borderColors = [
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
  ]

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: graphDataSession.value.sessionNames, // Use labels for hover
      datasets: [
        {
          label: '# of Sessions',
          data: graphDataSession.value.sessionData,
          backgroundColor: themeColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false, // Hides the legend with color boxes
        },
        title: {
          display: true, // Adds a label at the top of the donut chart
          text: 'Session Distribution',
          font: {
            size: 18,
            color: 'black', // Sets the label color to black
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.label // Show the label instead of the count
            },
          },
        },
      },
    },
  })
}

onMounted(async () => {
  await groupStore.fetchAllGroups()
  graphDataGroup.value = getgraphDataGroup()
  await sessionStore.fetchCreatedSessions()
  graphDataSession.value = getgraphDataSession()
  createGroupStudentChart()
  createSessionTypeChart()
})

const columns = [
  { name: 'group', required: true, label: 'Group', align: 'left', field: 'group', sortable: true },
  { name: 'session', align: 'left', label: 'Session', field: 'session' },
  { name: 'date', align: 'left', label: 'Date', field: 'date' },
  { name: 'taskSubmitted', align: 'left', label: 'Task Submitted', field: 'taskSubmitted' },
  { name: 'taskEvaluated', align: 'left', label: 'Task Evaluated', field: 'taskEvaluated' },
  {
    name: 'totalParticipated',
    align: 'left',
    label: 'Total Participated',
    field: 'totalParticipated',
  },
]

const tableData = ref([
  {
    group: 'Group A',
    session: 'Session 1',
    date: '2023-10-26',
    taskSubmitted: 10,
    taskEvaluated: 8,
    totalParticipated: 15,
  },
  {
    group: 'Group B',
    session: 'Session 2',
    date: '2023-10-27',
    taskSubmitted: 12,
    taskEvaluated: 11,
    totalParticipated: 20,
  },
  {
    group: 'Group C',
    session: 'Session 3',
    date: '2023-10-28',
    taskSubmitted: 8,
    taskEvaluated: 8,
    totalParticipated: 10,
  },
  {
    group: 'Group D',
    session: 'Session 4',
    date: '2023-10-29',
    taskSubmitted: 15,
    taskEvaluated: 13,
    totalParticipated: 25,
  },
])

const tasks = ref([
  { title: 'Prepare Lesson Plan', description: 'For Group A', completed: false },
  { title: 'Send Session Reminders', description: 'To all students', completed: true },
  { title: 'Review Assignments', description: 'From Week 2', completed: false },
])

// const totalGroups = ref(3)
// const totalSessions = ref(15)

// const createGroup = () => {
//   router.push('/group/create')
// }
</script>

<style lang="scss" scoped>
.text-primary {
  color: #1e88e5;
}
.bg-light {
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.q-btn {
  border-radius: 50%;
  transition: transform 0.2s;
}
.q-btn:hover {
  transform: scale(1.1);
}
.q-card-section {
  padding: 20px;
}
.q-table {
  border-radius: 8px;
  overflow: hidden;
}
</style>
