<template>
  <q-card class="q-pa-lg q-mt-lg shadow-10 create-user-card">
    <q-card-section>
      <div class="text-h5 text-secondary text-weight-bold flex items-center">
        <q-icon name="person_add" class="q-mr-sm" />
        Create New User
      </div>
      <div class="text-caption text-grey-7 q-mt-xs">
        Fill in the user details to register a new user.
      </div>
    </q-card-section>

    <q-separator color="grey-4" class="q-my-sm" />

    <q-card-section class="q-gutter-md">
      <q-input v-model="form.fullname" label="Full Name" filled color="secondary" dense clearable />
      <q-input v-model="form.nickname" label="Nickname" filled color="secondary" dense clearable />
      <q-select
        v-model="form.faculty"
        :options="adminStore.allFaculty"
        label="Faculty"
        filled
        color="secondary"
        dense
        option-label="name"
        @update:model-value="onChangeFaculty"
      />
      <q-select
        v-model="form.department"
        :options="adminStore.allDepartment"
        label="Department"
        filled
        color="secondary"
        dense
        option-label="name"
        emit-value
        map-options
      />
      <q-select
        v-model="form.role"
        :options="roles"
        label="Role"
        filled
        color="secondary"
        dense
        emit-value
        map-options
      />
      <q-input
        v-model="form.password"
        label="Password"
        type="password"
        filled
        color="secondary"
        dense
        clearable
        :rules="[(val) => !val || val.length >= 6 || 'Password must be at least 6 characters']"
      />
      <q-input
        v-model="form.confirmPassword"
        label="Confirm Password"
        type="password"
        filled
        color="secondary"
        dense
        clearable
      />
    </q-card-section>

    <q-separator color="grey-4" class="q-mt-md q-mb-sm" />

    <q-card-actions align="right">
      <q-btn
        label="Create User"
        color="secondary"
        icon="check_circle"
        unelevated
        class="text-weight-medium"
        @click="createUser"
      />
    </q-card-actions>
    <q-card-actions vertical align="center">
      <div>
        Already have an account?&nbsp;<span
          class="text-bold text-secondary"
          @click="router.push('/auth/login')"
          style="cursor: pointer"
          >Log in</span
        >
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useAdminStore } from 'src/stores/admin-store'
import { useAuthStore } from 'src/stores/auth-store'
import { useRouter } from 'vue-router'
const adminStore = useAdminStore()
const authStore = useAuthStore()
const router = useRouter()

const $q = useQuasar()

const form = ref({
  fullname: '',
  nickname: '',
  faculty: null,
  department: null,
  role: null,
  password: '',
  confirmPassword: '',
})

const onChangeFaculty = async () => {
  await adminStore.fetchDepartments({ facultyInitial: form.value.faculty.initial })
  console.log(adminStore.allDepartment)
}

const roles = [
  { label: 'Student', value: 'student' },
  { label: 'teacher', value: 'teacher' },
  { label: 'Admin', value: 'admin' },
]

async function createUser() {
  if (
    !form.value.fullname ||
    !form.value.nickname ||
    !form.value.faculty ||
    !form.value.department ||
    !form.value.role ||
    form.value.password === ''
  ) {
    $q.notify({ type: 'negative', message: 'Please fill in all fields.' })
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    $q.notify({ type: 'negative', message: 'Passwords do not match.' })
    return
  }

  const currentYear = new Date().getFullYear().toString().slice(-2)
  const departmentCode = form.value.department.code || form.value.department.initial

  // Fetch the latest department info to get accurate counts
  const depData = adminStore.allDepartment.find((dep) => dep.id === form.value.department.id) || {
    studentCount: 0,
    teacherCount: 0,
  }

  const count =
    form.value.role === 'student'
      ? (depData.studentCount || 0) + 1
      : (depData.teacherCount || 0) + 1

  const paddedCount = count.toString().padStart(3, '0') // e.g. 001
  const userID = `${currentYear}-${departmentCode}-${paddedCount}`

  const email = `${form.value.nickname.toLowerCase()}${userID}@example.com`.replace(/\s+/g, '')

  const data = {
    name: form.value.fullname,
    nickname: form.value.nickname,
    faculty: { id: form.value.faculty.id, initial: form.value.faculty.initial },
    department: { id: form.value.department.id, initial: form.value.department.initial },
    role: form.value.role,
    userID,
    email,
    password: form.value.password,
  }

  await authStore.registerUser(data)
  await adminStore.updateDepartment(form.value.department.id, {
    studentCount: form.value.role === 'student' ? depData.studentCount + 1 : depData.studentCount,
    teacherCount: form.value.role === 'teacher' ? depData.teacherCount + 1 : depData.teacherCount,
  })

  console.log('Creating user:', data)
  $q.notify({ type: 'positive', message: `User ${userID} created successfully!` })

  // Optionally: save the user in the database here

  // Reset form
  form.value = {
    fullname: '',
    nickname: '',
    faculty: null,
    department: null,
    role: null,
    password: '',
    confirmPassword: '',
  }

  router.push('/auth/login')
}

onMounted(async () => {
  await adminStore.fetchFaculties()
  // Fetch faculties, departments, and roles if needed
  // adminStore.fetchFaculties().then(data => faculties.value = data)
  // adminStore.fetchDepartments().then(data => departments.value = data)
  // adminStore.fetchRoles().then(data => roles.value = data)
})
</script>

<style scoped>
.create-user-card {
  width: 100%;
  max-width: 600px;
  border-radius: 20px;
  background: white;
  transition: box-shadow 0.3s ease;
}
.create-user-card:hover {
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
}
</style>
