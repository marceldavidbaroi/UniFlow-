<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Group Management</div>
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
        Total Courses: {{ Array.isArray(adminStore.allGroup) ? adminStore.allGroup.length : 0 }}
      </q-chip>
    </div>
    <q-table
      :rows="adminStore.allGroup"
      :columns="columns"
      row-key="code"
      flat
      dense
      bordered
      :pagination="{ rowsPerPage: 25 }"
      color="secondary"
      class="shadow-2 rounded-borders bg-white"
      table-header-class="bg-secondary text-white text-weight-bold"
      :loading="loading"
      @row-click="goToDetailByCode"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          {{ props.row.name }}
        </q-td>
      </template>
      <template v-slot:body-cell-initial="props">
        <q-td :props="props">
          {{ props.row.initial }}
        </q-td>
      </template>
      <template v-slot:body-cell-code="props">
        <q-td :props="props">
          {{ props.row.code }}
        </q-td>
      </template>
    </q-table>
    <!-- AddCourseDialog can be implemented similarly to AddFacultyDialog -->
    <q-dialog v-model="showSampleDialog">
      <q-card class="q-pa-md" style="min-width: 340px; max-width: 95vw; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-negative">Add Sample Courses</div>
          <div class="text-body2 q-mt-sm">
            <b>Warning:</b> This action will
            <span class="text-negative">permanently delete <u>all existing courses</u></span> and
            replace them with sample data.<br />
            <span class="text-warning">This cannot be undone.</span><br />
            <br />
            To proceed, please enter the admin password. <br />
            <span class="text-caption text-grey-7"
              >(All current course records will be lost and replaced with sample data.)</span
            >
          </div>
          <q-input
            v-model="samplePassword"
            label="Admin Password"
            type="password"
            dense
            autofocus
            class="q-mt-md"
            :disable="sampleLoading"
            @keyup.enter="confirmSampleCourses"
            :error="samplePasswordError !== ''"
            :error-message="samplePasswordError"
          />
          <q-linear-progress
            v-if="sampleLoading"
            :value="sampleProgress"
            color="negative"
            class="q-mt-md"
          >
            <div class="absolute-full flex flex-center text-white text-weight-bold">
              {{ Math.round(sampleProgress * 100) }}% - {{ sampleProgressMsg }}
            </div>
          </q-linear-progress>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup :disable="sampleLoading" />
          <q-btn
            unelevated
            label="Confirm"
            color="negative"
            @click="confirmSampleCourses"
            :loading="sampleLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAdminStore } from 'src/stores/admin-store'
import FilterSearch from '../components/filterSearch.vue'

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

const searchText = ref('')
const searchType = ref('name')
const searchTypeOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Initial', value: 'initial' },
  { label: 'Code', value: 'code' },
]

const columns = [
  // { name: 'id', label: 'ID', field: 'id', align: 'left' }, // hidden but kept for reference
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
  { name: 'credits', label: 'Credits', field: 'credits', align: 'left', sortable: true },
]

async function fetchGroups(search = {}) {
  loading.value = true
  const res = await adminStore.fetchGroups(search)
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
function onSearch() {
  if (!searchText.value) {
    fetchGroups()
  } else {
    fetchGroups({ [searchType.value]: searchText.value })
  }
}
function onSearchClear() {
  searchText.value = ''
  fetchGroups()
}
function resetSampleDialog() {
  samplePassword.value = ''
  samplePasswordError.value = ''
}
watch(showSampleDialog, (val) => {
  if (val === true) resetSampleDialog()
})
async function confirmSampleCourses() {
  samplePasswordError.value = ''
  if (samplePassword.value !== '123123') {
    samplePasswordError.value = 'Incorrect password. Please try again.'
    return
  }
  await addSampleCourses()
}

async function addSampleCourses() {
  sampleLoading.value = true
  sampleProgress.value = 0
  sampleProgressMsg.value = 'Starting...'
  try {
    // Remove all courses
    const res = await adminStore.fetchGroups()
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
    await fetchGroups()
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

onMounted(fetchGroups)
</script>
