<template>
  <q-page padding>
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
            <div class="text-h6 text-secondary text-center q-mb-md">Todays Session</div>
            <q-table
              dense
              :rows="todaysSession"
              :columns="todaysSessionColumn"
              row-key="name"
              @row-click="(evt, row, index) => router.push(`/session/teacher/${row.id}`)"
              :sortable="true"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>

        <!-- Group and Session Details -->
        <q-card flat bordered class="q-mt-md bg-light">
          <q-card-section>
            <div class="text-h6 text-secondary text-center q-mb-md">Group Details</div>
            <q-table
              dense
              :rows="groupStore.groupList"
              :columns="groupColumns"
              row-key="name"
              :sortable="true"
              class="q-mt-md"
              @row-click="(evt, row, index) => router.push(`/group/${row.id}`)"
            />
          </q-card-section>
        </q-card>

        <!-- Task Management -->
        <q-card flat bordered class="q-mt-md bg-light">
          <q-card-section>
            <div class="text-h6 text-secondary text-center q-mb-md">Task List</div>
            <q-table
              dense
              :rows="taskStore.taskList"
              :columns="taskColumns"
              row-key="name"
              :sortable="true"
              class="q-mt-md"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Chart, registerables } from 'chart.js'
import { useGroupStore } from 'src/stores/group-store'
import { useSessionStore } from 'src/stores/sessionStore'
import { useTaskStore } from 'src/stores/taskStore'
const groupStore = useGroupStore()
const taskStore = useTaskStore()
const sessionStore = useSessionStore()

Chart.register(...registerables)

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

const taskColumns = [
  { name: 'subject', label: 'Subject', align: 'left', field: 'subject', sortable: true },
  { name: 'category', label: 'Category', align: 'left', field: 'category', sortable: true },
  {
    name: 'deadline',
    label: 'Deadline',
    align: 'left',
    field: (row) => row.deadline?.slice(0, 10) || '-',
    sortable: true,
  },
  { name: 'state', label: 'State', align: 'left', field: 'state', sortable: true },
  { name: 'totalMarks', label: 'Total Marks', align: 'left', field: 'totalMarks', sortable: true },
  {
    name: 'tags',
    label: 'Tags',
    align: 'left',
    field: (row) => row.tags?.join(', ') || '-',
    sortable: false,
  },
  {
    name: 'groupID',
    label: 'Groups',
    align: 'left',
    field: (row) => row.groupID?.length || 0,
    sortable: true,
  },
  {
    name: 'createdAt',
    label: 'Created At',
    align: 'left',
    field: (row) => row.createdAt?.slice(0, 10) || '-',
    sortable: true,
  },
]

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

const todaysSession = ref([])

onMounted(async () => {
  await groupStore.fetchAllGroups()
  graphDataGroup.value = getgraphDataGroup()
  await sessionStore.fetchCreatedSessions()
  graphDataSession.value = getgraphDataSession()
  createGroupStudentChart()
  createSessionTypeChart()

  todaysSession.value = sessionStore.sessionList.filter(
    (session) => new Date(session.sessionDate).toDateString() === new Date().toDateString(),
  )

  console.log(taskStore.taskList)
})

const todaysSessionColumn = [
  {
    name: 'sessionName',
    required: true,
    label: 'Session Name',
    align: 'left',
    field: 'sessionName',
    sortable: true,
  },
  { name: 'sessionDate', align: 'left', label: 'Session Date', field: 'sessionDate' },
  {
    name: 'isActive',
    align: 'left',
    label: 'Active',
    field: 'isActive',
  },
]
const groupColumns = [
  { name: 'groupName', label: 'Group Name', align: 'left', field: 'groupName', sortable: true },
  {
    name: 'code',
    label: 'Course Code',
    align: 'left',
    field: (row) => row.course?.code || '-',
    sortable: true,
  },
  {
    name: 'course',
    label: 'Course Name',
    align: 'left',
    field: (row) => row.course?.name || '-',
    sortable: true,
  },
  {
    name: 'department',
    label: 'Department',
    align: 'left',
    field: (row) => row.department?.name || '-',
    sortable: true,
  },
  { name: 'batch', label: 'Batch', align: 'left', field: 'batch', sortable: true },
  { name: 'semester', label: 'Semester', align: 'left', field: 'semester', sortable: true },
  { name: 'year', label: 'Year', align: 'left', field: 'year', sortable: true },
  {
    name: 'members',
    label: 'Members',
    align: 'left',
    field: (row) => row.members?.length || 0,
    sortable: true,
  },
]

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

/* Header background: grey */
::v-deep(.q-table thead tr) {
  background-color: #f0f0f0;
}

/* Alternate row colors */
::v-deep(.q-table tbody tr:nth-child(even)) {
  background-color: #fafafa;
}

::v-deep(.q-table tbody tr:nth-child(odd)) {
  background-color: #ffffff;
}
</style>
