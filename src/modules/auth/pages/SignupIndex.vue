<template>
  <q-page class="flex flex-center">
    <q-card class="my-card q-pa-lg" style="max-width: 600px; width: 520px; border-radius: 8%">
      <q-card-section class="q-pt-md q-pb-sm">
        <div
          class="cursor-pointer text-h2 text-heading-shadow text-center"
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
            :dense="dense"
            color="primary"
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
            placeholder="Email"
            :dense="dense"
            color="primary"
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
          <!-- batch-->
          <q-input
            outlined
            v-model="batch"
            type="text"
            placeholder="Batch"
            :dense="dense"
            color="primary"
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

          <!-- id-->
          <q-input
            outlined
            v-model="id"
            type="text"
            placeholder="ID Ex: XXX-XXX-XXXX"
            :dense="dense"
            color="primary"
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

          <!-- department-->
          <q-select
            outlined
            v-model="department"
            :options="departmentOptions"
            placeholder="Select Deparment"
            :dense="dense"
            color="primary"
            class="text-primary"
            label-color="primary"
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
                v-if="department !== 'Department'"
                name="fa-solid fa-xmark"
                @click="department = 'Department'"
                class="cursor-pointer"
                color="dark"
              />
            </template>
          </q-select>

          <!-- password -->

          <q-input
            outlined
            v-model="password"
            type="password"
            placeholder="Password"
            :dense="dense"
            class=""
            color="primary"
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
            outlined
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            :dense="dense"
            class=""
            color="primary"
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
              class="full-width text-heading-solid text-h6"
              dense
              padding="xs"
              no-caps
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section class="q-pt-lg text-body2 text-center text-dark">
        Have Account??
        <span class="cursor-pointer hover-transform text-h6" @click="router.push('login')"
          >Login</span
        >
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

const userName = ref('dd')
const email = ref('d@gmail.com')
const batch = ref('44')
const id = ref('44')
const department = ref('Department')
const password = ref('123123')
const confirmPassword = ref('123123')

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

const onSubmit = () => {
  authStore
    .registerUser(
      userName.value,
      email.value,
      batch.value,
      id.value,
      department.value,
      password.value,
    )
    .then((result) => {
      Notify.create({
        message: result.message,
        color: result.success ? 'green' : 'red', // Green for success, Red for failure
        position: 'top',
        icon: 'warning', // Adds an icon
        timeout: 5000, // Stays for 5 seconds
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
      if (result.success) {
        setTimeout(() => {
          router.push('/auth/login') // Redirect to login page after success
        }, 2000) // Delay for better UX (optional)
      }
    })
    .catch(() => {
      Notify.create({
        message: 'Something went wrong!',
        color: 'red',
        position: 'top',
        icon: 'warning', // Adds an icon
        timeout: 5000, // Stays for 5 seconds
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
    })
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 0px 10px rgba(0, 0, 0, 0.4);
}

.text-heading-shadow {
  font-family: 'Londrina Shadow', cursive;
  color: #c29d48;
  transition: transform 0.3s ease-in-out;
}
.text-heading-shadow:hover {
  transform: scale(1.2);
}

.text-heading-solid {
  font-family: 'Londrina Solid', cursive;
  color: #c29d48;
}

.hover-transform {
  font-family: 'Londrina Solid', cursive;
  color: #c29d48;
  display: inline-block;
  transition: transform 0.3s ease-in-out;
}
.hover-transform:hover {
  transform: scale(1.2);
}
</style>
