<template>
  <q-page class="q-pa-lg bg-grey-1 flex flex-center">
    <q-form @submit.prevent="submitForm" class="q-gutter-lg" style="max-width: 700px; width: 100%">
      <div class="text-h4 text-center text-secondary q-mb-md brand_sb">Edit Group</div>
      <q-card flat bordered class="q-pa-xl shadow-2 rounded-borders bg-white">
        <!-- Group Basics -->
        <div class="text-subtitle1 text-secondary q-mb-sm">Group Info</div>
        <div class="q-gutter-md">
          <q-input
            v-model="groupName"
            label="Group Name"
            outlined
            color="secondary"
            :rules="[(val) => !!val || 'Group Name is required']"
          />
          <q-input
            v-model="description"
            label="Description"
            type="textarea"
            autogrow
            outlined
            color="secondary"
          />
        </div>
        <!-- Academic Info -->
        <div class="text-subtitle1 text-secondary q-mt-lg q-mb-sm">Academic Info</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="department"
              :options="departmentOptions"
              label="Department"
              emit-value
              map-options
              option-label="name"
              outlined
              color="secondary"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="course"
              :options="courseOptions"
              label="Course"
              emit-value
              map-options
              option-label="name"
              outlined
              color="secondary"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="semester"
              :options="semesterOptions"
              label="Semester"
              outlined
              color="secondary"
            />
          </div>
          <div class="col-6 col-md-3">
            <q-select
              v-model="year"
              :options="yearOptions"
              label="Year"
              outlined
              color="secondary"
              :rules="[(val) => val > 2000 || 'Enter a valid year']"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="batch" label="Batch (Optional)" outlined color="secondary" />
          </div>
        </div>
        <!-- Rules & Toggles -->
        <div class="q-mt-lg q-gutter-md">
          <q-toggle v-model="addRules" label="Add Group Rules" color="secondary" />
          <q-editor
            v-if="addRules"
            v-model="groupRules"
            label="Group Rules"
            :toolbar="toolbarItems"
            class="bg-grey-2 q-pa-sm"
            height="150px"
          />
        </div>
        <!-- Access Settings -->
        <div class="text-subtitle1 text-secondary q-mt-xl q-mb-sm">Access Settings</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="password"
              label="Password"
              :type="passwordVisible ? 'text' : 'password'"
              outlined
              color="secondary"
              :rules="[(val) => val.length >= 6 || 'Password must be at least 6 characters']"
            >
              <template v-slot:append>
                <q-icon
                  :name="passwordVisible ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="passwordVisible = !passwordVisible"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <q-input
              v-model="confirmPassword"
              label="Confirm Password"
              :type="confirmPasswordVisible ? 'text' : 'password'"
              outlined
              color="secondary"
              :rules="[(val) => val === password || 'Passwords do not match']"
            >
              <template v-slot:append>
                <q-icon
                  :name="confirmPasswordVisible ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="confirmPasswordVisible = !confirmPasswordVisible"
                />
              </template>
            </q-input>
          </div>
        </div>
        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-6 col-md-4">
            <q-input
              v-model="maxMembers"
              label="Max Members"
              type="number"
              outlined
              color="secondary"
              :rules="[(val) => val > 0 || 'Enter a valid number']"
            />
          </div>
          <div class="col-6 col-md-4 flex items-center">
            <q-toggle v-model="labGroup" label="Lab Group" color="secondary" />
          </div>
        </div>
        <!-- Submit -->
        <div class="row justify-end q-mt-xl">
          <q-btn
            label="Save"
            type="submit"
            color="secondary"
            class="q-px-xl q-py-sm"
            :loading="isLoading"
            unelevated
          />
        </div>
      </q-card>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGroupStore } from 'src/stores/group-store'
import { useQuasar, Notify } from 'quasar'
import { useRouter } from 'vue-router'
import { useAdminStore } from 'src/stores/admin-store'

const adminStore = useAdminStore()
const groupStore = useGroupStore()
const router = useRouter()
const $q = useQuasar()

const groupName = ref('')
const batch = ref('')
const semester = ref('')
const year = ref(new Date().getFullYear())
const department = ref('')
const course = ref('')
const description = ref('')
const groupRules = ref('')
const password = ref('')
const confirmPassword = ref('')
const maxMembers = ref('')
const labGroup = ref(false)
const addRules = ref(false)
const isLoading = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString())
const semesterOptions = ['Spring', 'Summer', 'Fall']
const departmentOptions = adminStore.allDepartment
const courseOptions = adminStore.allCourse
const groupId = ref()
const group = ref()
const toolbarItems = [
  [
    'left',
    'center',
    'right',
    'justify',
    'bold',
    'italic',
    'strike',
    'underline',
    'subscript',
    'superscript',
  ],
  [
    {
      label: $q.lang.editor.fontSize,
      icon: $q.iconSet.editor.fontSize,
      fixedLabel: true,
      fixedIcon: true,
      list: 'no-icons',
      options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7'],
    },
  ],
  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
  ['undo', 'redo'],
]

onMounted(async () => {
  groupId.value = window.location.pathname.split('/group/edit/')[1]
  await adminStore.fetchDepartments()
  await adminStore.fetchCourses()
  if (groupId.value) {
    try {
      const result = await groupStore.searchGroupById(groupId.value)
      if (result?.data) {
        group.value = result.data
        groupName.value = group.value.groupName
        batch.value = group.value.batch
        semester.value = group.value.semester
        year.value = group.value.year
        department.value = group.value.department
        course.value = group.value.course
        description.value = group.value.description
        groupRules.value = group.value.groupRules
        password.value = group.value.password
        confirmPassword.value = group.value.password
        maxMembers.value = group.value.maxMembers
        labGroup.value = group.value.labGroup
        addRules.value = !!group.value.groupRules
      }
    } catch (error) {
      console.error('Error fetching group data:', error)
    }
  }
})

const submitForm = () => {
  isLoading.value = true
  const updatedData = {
    groupName: groupName.value,
    batch: batch.value,
    semester: semester.value,
    year: year.value,
    department: department.value,
    course: course.value,
    description: description.value,
    groupRules: addRules.value ? groupRules.value : '',
    password: password.value,
    confirmPassword: confirmPassword.value,
    maxMembers: maxMembers.value,
    labGroup: labGroup.value,
  }
  groupStore
    .editGroup(groupId.value, updatedData)
    .then((result) => {
      Notify.create({
        message: result.message,
        color: result.success ? 'green' : 'red',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
      if (result.success) {
        setTimeout(() => {
          router.push('/group/list')
        }, 2000)
      }
    })
    .catch(() => {
      Notify.create({
        message: 'An error occurred while editing the group.',
        color: 'red',
        position: 'top',
        icon: 'error',
        timeout: 5000,
      })
    })
    .finally(() => {
      isLoading.value = false
    })
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
