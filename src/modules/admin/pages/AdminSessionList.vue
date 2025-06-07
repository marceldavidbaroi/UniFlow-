<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Session Management</div>
    <div class="row items-center q-mb-md">
      <FilterSearch :searchTypeOptions="searchTypeOptions" @search="onSearch" />
      <q-space />
      <q-select
        v-model="selectedFilter"
        :options="selectOptions"
        outlined
        dense
        emit-value
        map-options
        @update:model-value="onFilterChange"
        style="min-width: 100px"
      />
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
        Total Sessions:
        {{ Array.isArray(adminStore.allSession) ? adminStore.allSession.length : 0 }}
      </q-chip>
    </div>
    <q-table
      :rows="adminStore.allSession"
      :columns="sessionColumns"
      row-key="code"
      flat
      dense
      bordered
      :pagination="{ rowsPerPage: 25 }"
      color="secondary"
      class="shadow-2 rounded-borders bg-white"
      table-header-class="bg-secondary text-white text-weight-bold"
      :loading="loading"
    >
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'
import FilterSearch from '../components/filterSearch.vue'

const adminStore = useAdminStore()
// const router = useRouter()

const loading = ref(false)
// const showAddDialog = ref(false)
const showSampleDialog = ref(false)
const samplePassword = ref('')
const samplePasswordError = ref('')

const searchTypeOptions = [
  { label: 'Name', value: 'sessionName' },
  { label: 'Session ID', value: 'sessionID' },
]

const sessionColumns = [
  {
    name: 'sessionName',
    label: 'Session',
    field: 'sessionName',
    align: 'left',
    sortable: true,
  },
  {
    name: 'sessionDate',
    label: 'Date',
    field: 'sessionDate',
    align: 'left',
    sortable: true,
  },
  {
    name: 'group',
    label: 'Group',
    field: (row) => row.selectedGroup?.label || '—',
    align: 'left',
    sortable: true,
  },
  {
    name: 'participants',
    label: 'Participants',
    field: (row) => row.participants?.length || 0,
    align: 'center',
    sortable: true,
  },
  {
    name: 'isActive',
    label: 'Status',
    field: (row) => (row.isActive ? 'Ongoing' : 'Inactive'),
    align: 'center',
    sortable: true,
  },
  {
    name: 'isEnded',
    label: 'Ended?',
    field: (row) => (row.isEnded ? 'Yes' : 'No'),
    align: 'center',
    sortable: true,
  },
]

const selectOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Ended', value: 'ended' },
]
const selectedFilter = ref('all')

async function fetchSessions(search = {}) {
  loading.value = true
  await adminStore.fetchSessions(search)
  console.log(adminStore.allSession)
  loading.value = false
}
// function goToDetailByCode(evt, row) {
//   router.push(`/group/${row.id}`)
// }

function onSearch({ type, text }) {
  if (!text) {
    fetchSessions()
  } else {
    fetchSessions({ [type]: text })
  }
}

function resetSampleDialog() {
  samplePassword.value = ''
  samplePasswordError.value = ''
}

const onFilterChange = (value) => {
  if (value === 'all') {
    fetchSessions()
  } else if (value === 'active') {
    fetchSessions({ isActive: true })
  } else if (value === 'ended') {
    fetchSessions({ isEnded: true })
  }
}
watch(showSampleDialog, (val) => {
  if (val === true) resetSampleDialog()
})

onMounted(fetchSessions)
</script>
