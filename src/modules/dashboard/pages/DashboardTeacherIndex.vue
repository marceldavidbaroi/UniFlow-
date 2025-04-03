<template>
  <q-page padding>
    <div class="text-h4 brand_sb text-center">Dashboard</div>
    <!-- action button -->
    <div class="row justify-between">
      <div class="text-bold">Total Gorups 3 Total session 10</div>
      <div class="q-gutter-sm text-right">
        <q-btn flat color="primary" icon="groups" @click="router.push('/group/create')" class="">
          <q-tooltip>Create a Group</q-tooltip>
        </q-btn>

        <q-btn flat color="primary" icon="event" @click="router.push('/session/create')" class="">
          <q-tooltip>Create a Session</q-tooltip>
        </q-btn>
        <q-btn flat color="primary" icon="calendar_today" @click="showCalendar = true" class="">
          <q-tooltip>Calender</q-tooltip>
        </q-btn>
        <q-dialog v-model="showCalendar">
          <q-date v-model="selectedDate" color="secondary">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="secodary" flat v-close-popup /></div
          ></q-date>
        </q-dialog>
      </div>
    </div>
    <div class="row q-gutter-md justify-center q-mt-md">
      <div class="col-12 col-md-9">
        <q-card>
          <q-card-section>
            <div class="text-h6">Session Overview</div>
            <div class="row q-gutter-md q-mt-md justify-center">
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

        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Group and Session Details</div>
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

        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Task Management</div>
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

Chart.register(...registerables)

const userStore = useUserStore()
const router = useRouter()

const showCalendar = ref(false)
const selectedDate = ref(new Date())

const groupStudentChart = ref(null)
const sessionTypeChart = ref(null)

const createGroupStudentChart = () => {
  const ctx = groupStudentChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'doughnut', // Changed to doughnut
    data: {
      labels: ['Group A', 'Group B', 'Group C'],
      datasets: [
        {
          label: '# of Students',
          data: [12, 19, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    },
  })
}

const createSessionTypeChart = () => {
  const ctx = sessionTypeChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'pie', // Changed to pie
    data: {
      labels: ['Lecture', 'Workshop', 'Lab'],
      datasets: [
        {
          label: '# of Sessions',
          data: [5, 3, 7],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
          borderWidth: 1,
        },
      ],
    },
  })
}

onMounted(() => {
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

const totalGroups = ref(3)
const totalSessions = ref(15)

const createGroup = () => {
  router.push('/group/create')
}
</script>

<style lang="scss" scoped></style>
