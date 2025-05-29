<template>
  <q-page padding class="bg-grey-1">
    <div class="text-h5 text-weight-bold q-mb-md text-secondary">Admin User List</div>
    <div class="row items-center q-mb-md">
      <q-btn-toggle
        v-model="selectedRole"
        :options="roleOptions"
        color="grey-6"
        toggle-color="secondary"
        unelevated
        size="sm"
        class="shadow-1 rounded-borders"
      >
        <template v-slot:option="{ option, selected }">
          <q-chip
            :color="selected ? option.color : 'grey-2'"
            :text-color="selected ? option.textColor : 'grey-8'"
            class="q-px-md q-py-xs text-weight-medium"
            square
            dense
          >
            {{ option.label }}
          </q-chip>
        </template>
      </q-btn-toggle>
      <div class="col-grow" />
      <div class="col-auto flex items-center">
        <q-select
          v-model="searchType"
          :options="searchTypeOptions"
          dense
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
          @keyup.enter="fetchAndFilterUsers"
          @blur="fetchAndFilterUsers"
          clearable
          class="q-mr-sm"
          style="min-width: 180px"
        >
          <template v-slot:append>
            <q-icon name="search" @click="fetchAndFilterUsers" class="cursor-pointer" />
          </template>
        </q-input>
        <q-toggle
          v-model="editMode"
          color="secondary"
          class="q-ml-md"
          label="Edit Mode"
          @update:model-value="onEditModeToggle"
        />
      </div>
    </div>

    <div class="">
      <q-chip
        color="secondary"
        size="sm"
        text-color="white"
        dense
        align="middle"
        class="q-pa-sm text-subtitle2 shadow-1 rounded-borders"
      >
        Total {{ selectedRoleLabel }}: {{ filteredUsers.length }}
      </q-chip>
    </div>
    <q-table
      :rows="filteredUsers"
      :columns="columns"
      row-key="id"
      flat
      dense
      bordered
      :pagination="{ rowsPerPage: 10 }"
      color="secondary"
      class="shadow-2 rounded-borders bg-white"
      table-header-class="bg-secondary text-white text-weight-bold"
      :loading="loading"
    >
      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
      </template>
      <template v-slot:body-cell-department="props">
        <q-td :props="props">
          {{ props.row.department?.label || '-' }}
        </q-td>
      </template>
      <template v-slot:body-cell-faculty="props">
        <q-td :props="props">
          {{ props.row.faculty?.label || '-' }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="row">
          <q-btn-dropdown
            color="secondary"
            :label="props.row.role.charAt(0).toUpperCase() + props.row.role.slice(1)"
            dense
            size="sm"
            unelevated
            :disable="props.row.role === 'admin' || !editMode"
            class="q-mr-sm"
          >
            <q-list dense>
              <q-item
                v-for="option in roleEditOptions"
                :key="option.value"
                clickable
                @click="onRoleChange(props.row, option.value)"
                dense
                :style="{
                  backgroundColor: `var(--q-${option.color})`,
                  color: `var(--q-${option.textColor})`,
                  borderRadius: '8px',
                  marginBottom: '2px',
                }"
                class="q-pa-xs"
              >
                <q-item-section>
                  <q-chip
                    :color="option.color"
                    :text-color="option.textColor"
                    dense
                    square
                    class="q-px-sm q-py-xs text-weight-medium"
                  >
                    {{ option.label }}
                  </q-chip>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn
            icon="delete"
            color="negative"
            dense
            unelevated
            flat
            size="sm"
            class="q-ml-sm"
            :disable="props.row.role === 'admin' || !editMode"
            @click="() => confirmDelete(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <q-dialog v-model="deleteDialog">
      <q-card class="bg-grey-2">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="md" class="q-mr-md" />
          <span
            >Are you sure you want to delete user <b>{{ userToDelete?.name }}</b
            >?</span
          >
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup color="secondary" />
          <q-btn flat label="Delete" color="negative" @click="deleteUserConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="editModeDialog">
      <q-card
        class="bg-gradient shadow-6 rounded-borders q-pa-md"
        style="
          min-width: 340px;
          max-width: 95vw;
          border-radius: 22px;
          background: linear-gradient(135deg, #e3f0ff 0%, #f8fafd 100%);
          box-shadow: 0 6px 32px 0 rgba(60, 80, 180, 0.1);
        "
      >
        <q-card-section class="q-pb-none">
          <div class="row items-center q-mb-md">
            <q-icon
              name="lock"
              color="secondary"
              size="32px"
              class="q-mr-md bg-blue-1 rounded-borders"
              style="
                padding: 8px;
                border-radius: 12px;
                box-shadow: 0 2px 8px 0 rgba(60, 80, 180, 0.08);
              "
            />
            <div class="text-h6 text-secondary text-weight-bold" style="letter-spacing: 0.5px">
              Activate Edit Mode
            </div>
          </div>
          <div class="text-body2 text-grey-8 q-mb-lg" style="font-size: 1.08em">
            Are you sure you want to go to
            <span class="text-weight-bold text-secondary">edit mode</span>?<br />
            <span class="text-grey-7">Please enter the password to continue.</span>
          </div>
          <q-input
            v-model="editModePassword"
            type="password"
            label="Password"
            dense
            outlined
            color="secondary"
            autofocus
            @keyup.enter="confirmEditMode"
            class="q-mt-sm bg-blue-1 rounded-borders"
            :error="!!editModeError"
            :error-message="editModeError"
            style="border-radius: 12px"
          >
            <template v-slot:prepend>
              <q-icon name="vpn_key" color="secondary" />
            </template>
          </q-input>
        </q-card-section>
        <q-card-actions align="right" class="q-pt-none q-mt-md">
          <q-btn
            flat
            label="Cancel"
            color="grey"
            v-close-popup
            @click="cancelEditMode"
            class="rounded-borders"
          />
          <q-btn
            unelevated
            label="Confirm"
            color="secondary"
            @click="confirmEditMode"
            class="rounded-borders"
            style=""
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useAdminStore } from 'src/stores/admin-store'
import { ref, computed, onMounted, watch } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const adminStore = useAdminStore()
const selectedRole = ref('teacher')
const roleOptions = [
  { label: 'Teacher', value: 'teacher', color: 'blue-2', textColor: 'blue-10' },
  { label: 'Student', value: 'student', color: 'green-2', textColor: 'green-10' },
]

const selectedRoleLabel = computed(() =>
  selectedRole.value === 'teacher' ? 'Teachers' : 'Students',
)

const roleEditOptions = [
  { label: 'Teacher', value: 'teacher', color: 'blue-2', textColor: 'blue-10' },
  { label: 'Student', value: 'student', color: 'green-2', textColor: 'green-10' },
  { label: 'Admin', value: 'admin', color: 'grey-3', textColor: 'grey-10' },
]

const deleteDialog = ref(false)
const userToDelete = ref(null)
const editMode = ref(false)
const editModeDialog = ref(false)
const editModePassword = ref('')
const editModeError = ref('')

const searchType = ref('name')
const searchText = ref('')
const filteredUsers = ref([])
const loading = ref(false)

const columns = computed(() => {
  const base = [
    { name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true },
    { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
    { name: 'personId', label: 'Person ID', field: 'personId', align: 'left', sortable: true },
    { name: 'department', label: 'Department', field: 'department', align: 'left', sortable: true },
    { name: 'createdAt', label: 'Created At', field: 'createdAt', align: 'left', sortable: true },
    { name: 'role', label: 'Role', field: 'role', align: 'left', sortable: true },
    { name: 'actions', label: 'Actions', field: 'actions', align: 'center' },
  ]
  if (selectedRole.value === 'teacher') {
    base.splice(4, 0, {
      name: 'faculty',
      label: 'Faculty',
      field: 'faculty',
      align: 'left',
      sortable: true,
    })
  } else {
    base.splice(4, 0, {
      name: 'batch',
      label: 'Batch',
      field: 'batch',
      align: 'left',
      sortable: true,
    })
  }
  return base
})

async function fetchAndFilterUsers() {
  loading.value = true
  try {
    // Build search object for action store
    const searchObj = {}
    if (searchText.value) {
      if (searchType.value === 'department') {
        searchObj['department'] = searchText.value
      } else {
        searchObj[searchType.value] = searchText.value
      }
    }
    // Always filter by selectedRole
    searchObj['role'] = selectedRole.value
    const { data } = await adminStore.fetchUsers(searchObj)
    filteredUsers.value = data
  } finally {
    loading.value = false
  }
}

onMounted(fetchAndFilterUsers)

watch([selectedRole, searchType, searchText], fetchAndFilterUsers)

async function onRoleChange(user, newRole) {
  if (user.role === newRole) return
  const oldRole = user.role
  try {
    const { success } = await adminStore.updateUser(user.id, { role: newRole })
    if (success) {
      user.role = newRole
      $q.notify({ type: 'positive', message: `Role updated to ${newRole}` })
      // Optionally, refresh the list
      fetchAndFilterUsers()
    } else {
      $q.notify({ type: 'negative', message: 'Failed to update role' })
    }
  } catch {
    user.role = oldRole
    $q.notify({ type: 'negative', message: 'Failed to update role' })
  }
}

function confirmDelete(user) {
  userToDelete.value = user
  deleteDialog.value = true
}

async function deleteUserConfirmed() {
  if (!userToDelete.value) return
  try {
    await adminStore.deleteUser(userToDelete.value.id)
    // Remove from filteredUsers
    filteredUsers.value = filteredUsers.value.filter((u) => u.id !== userToDelete.value.id)
    $q.notify({ type: 'positive', message: 'User deleted' })
  } catch {
    $q.notify({ type: 'negative', message: 'Failed to delete user' })
  }
  deleteDialog.value = false
  userToDelete.value = null
}

function onEditModeToggle(val) {
  if (val) {
    // Trying to enable edit mode
    editModeDialog.value = true
    // Reset password and error
    editModePassword.value = ''
    editModeError.value = ''
    // Immediately revert toggle until confirmed
    editMode.value = false
  }
}
function cancelEditMode() {
  editModeDialog.value = false
  editMode.value = false
}
function confirmEditMode() {
  if (editModePassword.value === '123123') {
    editMode.value = true
    editModeDialog.value = false
    editModePassword.value = ''
    editModeError.value = ''
    $q.notify({ type: 'positive', message: 'Edit mode activated!' })
  } else {
    editMode.value = false
    editModeError.value = 'Incorrect password.'
  }
}

function formatDate(ts) {
  if (!ts) return '-'
  if (ts.seconds) {
    // Firestore Timestamp object
    return date.formatDate(new Date(ts.seconds * 1000), 'YYYY-MM-DD HH:mm:ss')
  }
  // If it's a string or Date
  try {
    return date.formatDate(new Date(ts), 'YYYY-MM-DD HH:mm:ss')
  } catch {
    return ts
  }
}
</script>
