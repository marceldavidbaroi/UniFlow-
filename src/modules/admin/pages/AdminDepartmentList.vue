<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Department Management</div>
    <div class="row items-center q-mb-md">
      <q-select
        v-model="searchType"
        :options="searchTypeOptions"
        dense
        emit-value
        map-options
        outlined
        color="blue-2"
        text-color="blue-10"
        class="q-mr-sm"
        style="min-width: 120px"
      />
      <q-input
        v-model="searchText"
        dense
        outlined
        color="secondary"
        placeholder="Search..."
        :debounce="350"
        @update:model-value="onSearch"
        @keyup.enter="onSearch"
        @blur="onSearch"
        clearable
        @clear="onSearchClear"
        class="q-mr-sm"
        style="min-width: 180px"
      >
        <template v-slot:append>
          <q-icon name="search" @click="fetchDepartments" class="cursor-pointer" />
        </template>
      </q-input>
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
    <q-dialog v-model="showSampleDialog">
      <q-card class="q-pa-md" style="min-width: 340px; max-width: 95vw; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-negative">Add Sample Departments</div>
          <div class="text-body2 q-mt-sm">
            <b>Warning:</b> This action will
            <span class="text-negative">permanently delete <u>all existing departments</u></span>
            and replace them with sample data.<br />
            <span class="text-warning">This cannot be undone.</span><br />
            <br />
            To proceed, please enter the admin password. <br />
            <span class="text-caption text-grey-7"
              >(All current department records will be lost and replaced with sample data.)</span
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
            @keyup.enter="confirmSampleDepartments"
            :error="samplePasswordError !== ''"
            :error-message="samplePasswordError"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup :disable="sampleLoading" />
          <q-btn
            unelevated
            label="Confirm"
            color="negative"
            @click="confirmSampleDepartments"
            :loading="sampleLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import AddDepartmentDialog from '../components/AddDepartmentDialog.vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'

const adminStore = useAdminStore()
const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const showAddDialog = ref(false)
const showSampleDialog = ref(false)
const sampleLoading = ref(false)
const samplePassword = ref('')
const samplePasswordError = ref('')

const searchText = ref('')
const searchType = ref('name')
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
  samplePasswordError.value = ''
  if (samplePassword.value !== '123123') {
    samplePasswordError.value = 'Incorrect password. Please try again.'
    return
  }
  await addSampleDepartments()
}
async function addSampleDepartments() {
  sampleLoading.value = true
  try {
    // Remove all departments
    const res = await adminStore.fetchDepartments()
    if (res.data && res.data?.length) {
      for (const dep of res.data) {
        await adminStore.deleteDepartment(dep.id)
      }
    }
    // Insert sample departments
    await adminStore.injectSampleDepartments()
    $q.notify({ type: 'positive', message: 'Sample departments added!' })
    await fetchDepartments()
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to add sample departments.' })
  }
  sampleLoading.value = false
  showSampleDialog.value = false
  resetSampleDialog()
}

function onSearch() {
  if (!searchText.value) {
    fetchDepartments()
  } else {
    fetchDepartments({ [searchType.value]: searchText.value })
  }
}
function onSearchClear() {
  searchText.value = ''
  fetchDepartments()
}

onMounted(fetchDepartments)
</script>
