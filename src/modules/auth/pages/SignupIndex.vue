<template>
  <q-page class="flex flex-center">
    <q-card
      class="my-card q-pa-lg q-my-xl"
      style="max-width: 600px; width: 520px; border-radius: 8%"
    >
      <q-card-section class="q-pt-md q-pb-sm">
        <div
          class="cursor-pointer text-h2 text-bold brand_bb text-center"
          @click="router.push('/home')"
        >
          SIGNUP
        </div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-xs">
          <!-- user name -->
          <q-input
            outlined
            v-model="userName"
            type="text"
            placeholder="Full Name"
            label="Full Name"
            :dense="dense"
            color="secondary"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[(val) => !!val || 'Full Name is required']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-user" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="userName !== ''"
                name="fa-solid fa-xmark"
                @click="userName = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- email -->
          <q-input
            outlined
            v-model="email"
            type="text"
            label="Email"
            placeholder="Email"
            :dense="dense"
            color="secondary"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email address',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-envelope" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="email !== ''"
                name="fa-solid fa-xmark"
                @click="email = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- id-->
          <q-input
            outlined
            v-model="id"
            type="text"
            label="ID Ex: XXX-XXX-XXXX"
            placeholder="ID Ex: XXX-XXX-XXXX"
            :dense="dense"
            color="secondary"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[(val) => !!val || 'ID is required']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-id-card" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="id !== ''"
                name="fa-solid fa-xmark"
                @click="id = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- teacher or student  -->
          <q-select
            outlined
            v-model="role"
            :options="roleOptions"
            label="Role"
            placeholder="Role"
            :dense="dense"
            color="secondary"
            class="text-primary"
            label-color="dark"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[(val) => !!val || 'Role  is required']"
            menu-class="black-dropdown"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-user" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="role !== ''"
                name="fa-solid fa-xmark"
                @click="role = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-select>

          <!-- password -->

          <q-input
            v-if="role.value === 'teacher'"
            outlined
            v-model="adminAccessPassword"
            type="password"
            label="Admin Passwpord (Teacher)"
            placeholder="Admin Passwpord (Teacher)"
            :dense="dense"
            class=""
            color="secondary"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters long',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-key" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="adminAccessPassword !== ''"
                name="fa-solid fa-xmark"
                @click="adminAccessPassword = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- batch-->
          <q-input
            v-if="role.value === 'student'"
            outlined
            v-model="batch"
            type="text"
            label="Batch"
            placeholder="Batch"
            :dense="dense"
            color="dark"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[(val) => !!val || 'Batch is required']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user-group" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="batch !== ''"
                name="fa-solid fa-xmark"
                @click="batch = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- faculty-->
          <q-select
            v-if="role.value === 'teacher'"
            outlined
            v-model="faculty"
            :options="facultyOptions"
            label="Faculty"
            placeholder="Select Faculty"
            :dense="dense"
            color="secondary"
            class="text-primary"
            label-color="dark"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[(val) => !!val || 'Faculty  is required']"
            menu-class="black-dropdown"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-user" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="faculty !== ''"
                name="fa-solid fa-xmark"
                @click="faculty = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-select>

          <!-- department-->
          <q-select
            v-if="role.value"
            outlined
            v-model="department"
            :options="departmentOptions"
            label="Deparment"
            placeholder="Select Deparment"
            :dense="dense"
            color="secondary"
            class="text-primary"
            label-color="dark"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[(val) => !!val || 'Deparment  is required']"
            menu-class="black-dropdown"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-building" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="department !== ''"
                name="fa-solid fa-xmark"
                @click="department = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-select>

          <!-- password -->

          <q-input
            v-if="role.value"
            outlined
            v-model="password"
            type="password"
            label="Password"
            placeholder="Password"
            :dense="dense"
            class=""
            color="secondary"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters long',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-key" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="password !== ''"
                name="fa-solid fa-xmark"
                @click="password = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- confirm password -->
          <q-input
            v-if="role.value"
            outlined
            v-model="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password"
            :dense="dense"
            class=""
            color="secondary"
            input-style="color: #272727;"
            placeholder-style="color: #272727;"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val === password || 'Password do not match',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-key" color="dark" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="confirmPassword !== ''"
                name="fa-solid fa-xmark"
                @click="confirmPassword = ''"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-input>

          <!-- login buttom -->
          <div>
            <q-btn
              label="Sign Up"
              type="submit"
              color="primary"
              class="full-width brand_sw text-h6"
              dense
              padding="xs"
              no-caps
              :loading="isLoading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="q-pt-lg text-body2 text-center text-dark">
        Have Account??
        <span class="cursor-pointer brand_sb text-h6" @click="router.push('login')">Login</span>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { Notify } from 'quasar'

const authStore = useAuthStore()

const router = useRouter()

const userName = ref('')
const email = ref('')
const batch = ref('')
const id = ref('')
const role = ref('')
const department = ref('')
const faculty = ref('')
const adminAccessPassword = ref('')
const password = ref('123123')
const confirmPassword = ref('123123')

const isLoading = ref()

const departmentOptions = ref([
  { label: 'Computer Science & Engineering', value: 'CSE' },
  { label: 'Electrical & Electronics Engineering', value: 'EEE' },
  { label: 'Mechanical Engineering', value: 'ME' },
  { label: 'Civil Engineering', value: 'CE' },
  { label: 'Business Administration', value: 'BBA' },
  { label: 'Economics', value: 'ECO' },
  { label: 'Mathematics', value: 'MATH' },
  { label: 'Physics', value: 'PHYS' },
  { label: 'Chemistry', value: 'CHEM' },
  { label: 'Biotechnology', value: 'BIO' },
  { label: 'Pharmacy', value: 'PHARM' },
  { label: 'Architecture', value: 'ARCH' },
  { label: 'Law', value: 'LAW' },
  { label: 'Psychology', value: 'PSY' },
  { label: 'English Literature', value: 'ENG' },
  { label: 'Media & Communication', value: 'MEDIA' },
  { label: 'Political Science', value: 'POLSCI' },
  { label: 'Environmental Science', value: 'ENV' },
  { label: 'Medical Science', value: 'MED' },
  { label: 'Nursing', value: 'NURS' },
])

const roleOptions = ref([
  { label: 'Teacher', value: 'teacher' },
  { label: 'Student', value: 'student' },
])
const facultyOptions = ref([
  { label: 'Professor', value: 'professor' },
  { label: 'Associate Professor', value: 'associate_professor' },
  { label: 'Assistant Professor', value: 'assistant_professor' },
  { label: 'Lecturer', value: 'lecturer' },
  { label: 'Teaching Assistant', value: 'teaching_assistant' },
  { label: 'Research Scholar', value: 'research_scholar' },
  { label: 'Postdoctoral Researcher', value: 'postdoc' },
  { label: 'Dean', value: 'dean' },
  { label: 'Head of Department (HOD)', value: 'hod' },
  { label: 'Lab Instructor', value: 'lab_instructor' },
  { label: 'Academic Advisor', value: 'academic_advisor' },
  { label: 'Administrative Staff', value: 'admin_staff' },
  { label: 'Librarian', value: 'librarian' },
])

const onSubmit = () => {
  isLoading.value = true // Start loading spinner

  authStore
    .registerUser(
      userName.value,
      email.value,
      batch.value,
      id.value,
      department.value,
      faculty.value,
      adminAccessPassword.value,
      role.value,
      password.value,
    )
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
          router.push('/auth/login')
        }, 2000)
      }
    })
    .catch(() => {
      Notify.create({
        message: 'Something went wrong!',
        color: 'red',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
    })
    .finally(() => {
      isLoading.value = false // Stop loading spinner
    })
}
</script>

<style lang="scss" scoped></style>
