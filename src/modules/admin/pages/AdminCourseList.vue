<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Course Management</div>
    <div class="row items-center q-mb-md">
      <FilterSearch :searchTypeOptions="searchTypeOptions" @search="onSearch" />

      <q-space />
      <q-btn
        color="negative"
        label="Add Sample Courses"
        @click="showSampleDialog = true"
        icon="warning"
        class="q-ml-md shadow-1 rounded-borders"
      />
      <q-btn
        color="secondary"
        label="Add Course"
        @click="openAddDialog"
        icon="add"
        class="q-ml-md shadow-1 rounded-borders"
      />
    </div>
    <div class="q-mb-sm">
      <q-chip
        color="secondary"
        size="sm"
        text-color="white"
        dense
        align="middle"
        class="q-pa-sm text-subtitle2 shadow-1 rounded-borders"
      >
        Total Courses: {{ Array.isArray(adminStore.allCourse) ? adminStore.allCourse.length : 0 }}
      </q-chip>
    </div>
    <q-table
      :rows="adminStore.allCourse"
      :columns="columns"
      row-key="code"
      flat
      dense
      bordered
      :pagination="{ rowsPerPage: 10 }"
      color="secondary"
      class="shadow-2 rounded-borders bg-white"
      table-header-class="bg-secondary text-white text-weight-bold"
      :loading="loading"
      @row-click="goToDetailByCode"
    >
    </q-table>

    <bulkDeleteDialog
      v-model="showSampleDialog"
      title="Add Sample Courses"
      warning="This action will permanently delete all existing courses and replace them with sample data."
      note="To proceed, please enter the admin password."
      :password="adminPassword"
      :passwordLabel="'Admin Password'"
      :confirmLabel="'Confirm'"
      @confirm="confirmSampleCourses"
      @cancel="showSampleDialog = false"
      :loading="sampleLoading"
      :progress="sampleProgress"
      :sampleProgressMsg="sampleProgressMsg"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAdminStore } from 'src/stores/admin-store'
import FilterSearch from '../components/filterSearch.vue'
import bulkDeleteDialog from '../components/bulkDeleteDialog.vue'

const adminStore = useAdminStore()
const router = useRouter()
const $q = useQuasar()

const courses = ref([])
const loading = ref(false)
const showAddDialog = ref(false)
const showSampleDialog = ref(false)
const sampleLoading = ref(false)
const samplePassword = ref('')
const samplePasswordError = ref('')
const sampleProgress = ref(0)
const sampleProgressMsg = ref('')
const adminPassword = ref('123123')

const searchTypeOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Code', value: 'code' },
]

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
  { name: 'credits', label: 'Credits', field: 'credits', align: 'left', sortable: true },
]

async function fetchCourses(search = {}) {
  console.log(search)
  loading.value = true
  const res = await adminStore.fetchCourses(search)
  courses.value = res.data || []
  console.log(courses.value)
  loading.value = false
}
function goToDetailByCode(evt, row) {
  router.push(`/admin/course/${row.id}`)
}
function openAddDialog() {
  showAddDialog.value = true
}
function onSearch({ type, text }) {
  console.log('Searching:', type, text)
  if (!text) {
    fetchCourses()
  } else {
    fetchCourses({ [type]: text })
  }
}

function resetSampleDialog() {
  samplePassword.value = ''
  samplePasswordError.value = ''
}
watch(showSampleDialog, (val) => {
  if (val === true) resetSampleDialog()
})
async function confirmSampleCourses(localPassword) {
  console.log(localPassword)
  await addSampleCourses()
}

async function addSampleCourses() {
  sampleLoading.value = true
  sampleProgress.value = 0
  sampleProgressMsg.value = 'Starting...'
  try {
    // Remove all courses
    const res = await adminStore.fetchCourses()
    if (res.data && res.data.length) {
      let i = 0
      for (const course of res.data) {
        await adminStore.deleteCourse(course.id)
        i++
        sampleProgress.value = i / res.data.length
        sampleProgressMsg.value = `Deleting courses (${i}/${res.data.length})`
      }
    }
    sampleProgress.value = 0.95
    sampleProgressMsg.value = 'Adding sample courses...'
    // Insert sample courses using the store action (handles all logic)
    await adminStore.injectSampleCourses()
    sampleProgress.value = 1
    sampleProgressMsg.value = 'Done!'
    $q.notify({ type: 'positive', message: 'Sample courses added!' })
    await fetchCourses()
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to add sample courses.' })
    sampleProgressMsg.value = 'Failed.'
  }
  setTimeout(() => {
    sampleLoading.value = false
    showSampleDialog.value = false
    resetSampleDialog()
    sampleProgress.value = 0
    sampleProgressMsg.value = ''
  }, 800)
}

onMounted(fetchCourses)
</script>
