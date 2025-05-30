<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Faculty Management</div>
    <div class="row items-center q-mb-md">
      <FilterSearch :searchTypeOptions="searchTypeOptions" @search="onSearch" />

      <!-- <q-select
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
          <q-icon name="search" @click="fetchFaculties" class="cursor-pointer" />
        </template>
      </q-input> -->
      <q-space />
      <q-btn
        color="negative"
        label="Add Sample Faculties"
        @click="showSampleDialog = true"
        icon="warning"
        class="q-ml-md shadow-1 rounded-borders"
      />
      <q-btn
        color="secondary"
        label="Add Faculty"
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
        Total Faculties: {{ faculties.length }}
      </q-chip>
    </div>
    <q-table
      :rows="adminStore.allFaculty"
      :columns="columns"
      row-key="code"
      flat
      dense
      bordered
      :pagination="{ rowsPerPage: 50 }"
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
    <AddFacultyDialog :show="showAddDialog" @close="showAddDialog = false" @submit="addFaculty" />
    <!-- <q-dialog v-model="showSampleDialog">
      <q-card class="q-pa-md" style="min-width: 340px; max-width: 95vw; border-radius: 16px">
        <q-card-section>
          <div class="text-h6 text-negative">Add Sample Faculties</div>
          <div class="text-body2 q-mt-sm">
            <b>Warning:</b> This action will
            <span class="text-negative">permanently delete <u>all existing faculties</u></span> and
            replace them with sample data.<br />
            <span class="text-warning">This cannot be undone.</span><br />
            <br />
            To proceed, please enter the admin password. <br />
            <span class="text-caption text-grey-7"
              >(All current faculty records will be lost and replaced with sample data.)</span
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
            @keyup.enter="confirmSampleFaculties"
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
            @click="confirmSampleFaculties"
            :loading="sampleLoading"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <BulkDeleteDialog
      v-model="showSampleDialog"
      title="Add Sample Courses"
      warning="This action will permanently delete all existing faculties and replace them with sample data."
      note="To proceed, please enter the admin password."
      :password="adminPassword"
      :passwordLabel="'Admin Password'"
      :confirmLabel="'Confirm'"
      @confirm="confirmSampleFaculties"
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
import AddFacultyDialog from '../components/AddFacultyDialog.vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'
import FilterSearch from '../components/filterSearch.vue'
import BulkDeleteDialog from '../components/bulkDeleteDialog.vue'

const adminStore = useAdminStore()
const $q = useQuasar()
const router = useRouter()
const faculties = ref([])
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
  { label: 'Initial', value: 'initial' },
  { label: 'Code', value: 'code' },
]

const columns = [
  // { name: 'id', label: 'ID', field: 'id', align: 'left' }, // hidden but kept for reference
  { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
  { name: 'initial', label: 'Initial', field: 'initial', align: 'left', sortable: true },
  { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
]

async function fetchFaculties(search = {}) {
  loading.value = true
  const res = await adminStore.fetchFaculties(search)
  faculties.value = res.data || []
  loading.value = false
}
function goToDetailByCode(evt, row) {
  console.log(row)
  router.push(`/admin/faculty/${row.id}`)
}
async function addFaculty(data) {
  loading.value = true
  await adminStore.addFaculty(data)
  await fetchFaculties()
  $q.notify({ type: 'positive', message: 'Faculty added!' })
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

async function confirmSampleFaculties() {
  await addSampleFaculties()
}
async function addSampleFaculties() {
  sampleLoading.value = true
  sampleProgress.value = 0
  sampleProgressMsg.value = 'Starting...'

  try {
    // Remove all faculties
    const res = await adminStore.fetchFaculties()
    if (res.data && res.data.length) {
      let i = 0
      for (const fac of res.data) {
        await adminStore.deleteFaculty(fac.id)
        i++
        sampleProgress.value = i / res.data.length
        sampleProgressMsg.value = `Deleting faculties (${i}/${res.data.length})`
      }
    }

    sampleProgress.value = 0.95
    sampleProgressMsg.value = 'Adding sample faculties...'

    // Insert sample faculties
    await adminStore.injectSampleFaculties()

    sampleProgress.value = 1
    sampleProgressMsg.value = 'Done!'
    $q.notify({ type: 'positive', message: 'Sample faculties added!' })

    await fetchFaculties()
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to add sample faculties.' })
    sampleProgressMsg.value = 'Failed.'
  }

  // Reset the dialog and loading state
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
    fetchFaculties()
  } else {
    fetchFaculties({ [type]: text })
  }
}

onMounted(fetchFaculties)
</script>
