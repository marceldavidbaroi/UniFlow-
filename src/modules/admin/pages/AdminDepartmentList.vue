<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Department Management</div>
    <div class="row items-center q-mb-md">
      <FilterSearch :searchTypeOptions="searchTypeOptions" @search="onSearch" />

      <q-space />
      <q-btn
        color="negative"
        label="Add Sample Departments"
        @click="showSampleDialog = true"
        icon="warning"
        class="q-ml-md shadow-1 rounded-borders"
      />
      <q-btn
        color="secondary"
        label="Add Department"
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
        Total Departments:
        {{ Array.isArray(adminStore.allDepartment) ? adminStore.allDepartment.length : 0 }}
      </q-chip>
    </div>
    <q-table
      :rows="adminStore.allDepartment"
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
    <AddDepartmentDialog
      :show="showAddDialog"
      @close="showAddDialog = false"
      @submit="addDepartment"
    />

    <bulkDeleteDialog
      v-model="showSampleDialog"
      title="Refactor Sample Departments"
      warning="This action will permanently delete all existing departments and replace them with sample data."
      note="To proceed, please enter the admin password."
      :password="adminPassword"
      :passwordLabel="'Admin Password'"
      :confirmLabel="'Confirm'"
      @confirm="confirmSampleDepartments"
      @cancel="showSampleDialog = false"
      :loading="sampleLoading"
      :progress="sampleProgress"
      :sampleProgressMsg="sampleProgressMsg"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import AddDepartmentDialog from '../components/AddDepartmentDialog.vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'
import FilterSearch from '../components/filterSearch.vue'
import bulkDeleteDialog from '../components/bulkDeleteDialog.vue'

const adminStore = useAdminStore()
const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const showAddDialog = ref(false)
const showSampleDialog = ref(false)
const sampleLoading = ref(false)
const samplePassword = ref('')
const samplePasswordError = ref('')
const sampleProgress = ref(0)
const sampleProgressMsg = ref('')
const adminPassword = ref('123123')

// const searchText = ref('')
// const searchType = ref('name')
const searchTypeOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Initial', value: 'initial' },
  { label: 'Code', value: 'code' },
  { label: 'Faculty Initial', value: 'facultyInitial' },
]

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'initial', label: 'Initial', field: 'initial', align: 'left', sortable: true },
  { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
  {
    name: 'facultyInitial',
    label: 'Faculty Initial',
    field: 'facultyInitial',
    align: 'left',
    sortable: true,
  },
]

async function fetchDepartments(search = {}) {
  loading.value = true
  await adminStore.fetchDepartments(search)
  loading.value = false
}
function goToDetailByCode(evt, row) {
  router.push(`/admin/department/${row.id}`)
}
async function addDepartment(data) {
  loading.value = true
  await adminStore.addDepartment(data)
  await fetchDepartments()
  $q.notify({ type: 'positive', message: 'Department added!' })
  loading.value = false
}
function openAddDialog() {
  showAddDialog.value = true
}
function resetSampleDialog() {
  samplePassword.value = ''
  samplePasswordError.value = ''
}

watch(showSampleDialog, (val) => {
  if (val === true) resetSampleDialog()
})

async function confirmSampleDepartments() {
  await addSampleDepartments()
}
async function addSampleDepartments() {
  sampleLoading.value = true
  sampleProgress.value = 0
  sampleProgressMsg.value = 'Starting...'
  try {
    // Remove all departments
    const res = await adminStore.fetchDepartments()
    if (res.data && res.data.length) {
      let i = 0
      for (const dep of res.data) {
        await adminStore.deleteDepartment(dep.id)
        i++
        sampleProgress.value = i / res.data.length
        sampleProgressMsg.value = `Deleting departments (${i}/${res.data.length})`
      }
    }

    sampleProgress.value = 0.95
    sampleProgressMsg.value = 'Adding sample departments...'

    // Insert sample departments
    await adminStore.injectSampleDepartments()

    sampleProgress.value = 1
    sampleProgressMsg.value = 'Done!'
    $q.notify({ type: 'positive', message: 'Sample departments added!' })

    await fetchDepartments()
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to add sample departments.' })
    sampleProgressMsg.value = 'Failed.'
  }

  // Reset UI after short delay
  setTimeout(() => {
    sampleLoading.value = false
    showSampleDialog.value = false
    resetSampleDialog()
    sampleProgress.value = 0
    sampleProgressMsg.value = ''
  }, 800)
}

function onSearch({ type, text }) {
  if (!text) {
    fetchDepartments()
  } else {
    fetchDepartments({ [type]: text })
  }
}

onMounted(fetchDepartments)
</script>
