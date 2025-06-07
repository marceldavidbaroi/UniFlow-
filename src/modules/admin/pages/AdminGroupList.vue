<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Group Management</div>
    <div class="row items-center q-mb-md">
      <FilterSearch :searchTypeOptions="searchTypeOptions" @search="onSearch" />
      <q-space />
      <!-- <q-btn
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
      /> -->
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
        Total Groups: {{ Array.isArray(adminStore.allGroup) ? adminStore.allGroup.length : 0 }}
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
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'
import FilterSearch from '../components/filterSearch.vue'

const adminStore = useAdminStore()
const router = useRouter()

const loading = ref(false)
// const showAddDialog = ref(false)
const showSampleDialog = ref(false)
const samplePassword = ref('')
const samplePasswordError = ref('')

const searchTypeOptions = [
  { label: 'Name', value: 'groupName' },
  { label: 'Year', value: 'year' },
]

const columns = [
  {
    name: 'groupName',
    label: 'Group Name',
    field: 'groupName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'course',
    label: 'Course',
    field: (row) => row.course?.name || '—',
    align: 'left',
    sortable: true,
  },
  {
    name: 'department',
    label: 'Department',
    field: (row) => row.department?.name || '—',
    align: 'left',
    sortable: true,
  },
  {
    name: 'owner',
    label: 'Owner',
    field: (row) => row.owner?.name || '—',
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
  {
    name: 'semester',
    label: 'Semester',
    field: 'semester',
    align: 'left',
    sortable: true,
  },
  {
    name: 'year',
    label: 'Year',
    field: 'year',
    align: 'left',
    sortable: true,
  },
]

async function fetchGroups(search = {}) {
  loading.value = true
  await adminStore.fetchGroups(search)
  console.log(adminStore.allGroup)
  loading.value = false
}
function goToDetailByCode(evt, row) {
  router.push(`/group/${row.id}`)
}
// function openAddDialog() {
//   showAddDialog.value = true
// }
// async function onSearch() {
//   if (!searchText.value) {
//     console.log(searchText)
//     await fetchGroups()
//   } else {
//     await fetchGroups({ [searchType.value]: searchText.value })
//   }
// }

function onSearch({ type, text }) {
  if (!text) {
    fetchGroups()
  } else {
    fetchGroups({ [type]: text })
  }
}

function resetSampleDialog() {
  samplePassword.value = ''
  samplePasswordError.value = ''
}
watch(showSampleDialog, (val) => {
  if (val === true) resetSampleDialog()
})
// async function confirmSampleCourses() {
//   samplePasswordError.value = ''
//   if (samplePassword.value !== '123123') {
//     samplePasswordError.value = 'Incorrect password. Please try again.'
//     return
//   }
//   await addSampleCourses()
// }

// async function addSampleCourses() {
//   sampleLoading.value = true
//   sampleProgress.value = 0
//   sampleProgressMsg.value = 'Starting...'
//   try {
//     // Remove all courses
//     const res = await adminStore.fetchGroups()
//     if (res.data && res.data.length) {
//       let i = 0
//       for (const course of res.data) {
//         await adminStore.deleteCourse(course.id)
//         i++
//         sampleProgress.value = i / res.data.length
//         sampleProgressMsg.value = `Deleting courses (${i}/${res.data.length})`
//       }
//     }
//     sampleProgress.value = 0.95
//     sampleProgressMsg.value = 'Adding sample courses...'
//     // Insert sample courses using the store action (handles all logic)
//     await adminStore.injectSampleCourses()
//     sampleProgress.value = 1
//     sampleProgressMsg.value = 'Done!'
//     $q.notify({ type: 'positive', message: 'Sample courses added!' })
//     await fetchGroups()
//   } catch {
//     $q.notify({ type: 'negative', message: 'Failed to add sample courses.' })
//     sampleProgressMsg.value = 'Failed.'
//   }
//   setTimeout(() => {
//     sampleLoading.value = false
//     showSampleDialog.value = false
//     resetSampleDialog()
//     sampleProgress.value = 0
//     sampleProgressMsg.value = ''
//   }, 800)
// }

onMounted(fetchGroups)
</script>
