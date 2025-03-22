<template>
  <q-page class="flex flex-center">
    <q-card class="my-card q-pa-lg" style="max-width: 600px; width: 520px; border-radius: 8%">
      <q-card-section class="q-pt-md q-pb-xl">
        <div class="text-h2 text-heading-shadow text-center">SIGNUP</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
          <!-- user name -->
          <q-input
            outlined
            v-model="userName"
            type="text"
            placeholder="Full Name"
            :dense="dense"
            color="primary"
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[(val) => !!val || 'Full Name is required']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-user" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="userName !== ''"
                name="fa-solid fa-xmark"
                @click="userName = ''"
                class="cursor-pointer"
                color="accent"
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
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[
              (val) => !!val || 'Email is required',
              (val) => /.+@.+\..+/.test(val) || 'Please enter a valid email address',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-envelope" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="email !== ''"
                name="fa-solid fa-xmark"
                @click="email = ''"
                class="cursor-pointer"
                color="accent"
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
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[(val) => !!val || 'Batch is required']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user-group" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="batch !== ''"
                name="fa-solid fa-xmark"
                @click="batch = ''"
                class="cursor-pointer"
                color="accent"
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
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[(val) => !!val || 'ID is required']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-id-card" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="id !== ''"
                name="fa-solid fa-xmark"
                @click="id = ''"
                class="cursor-pointer"
                color="accent"
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
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[(val) => !!val || 'Deparment  is required']"
            menu-class="black-dropdown"
          >
            <template v-slot:prepend>
              <q-icon name="fa-regular fa-building" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="department !== 'Department'"
                name="fa-solid fa-xmark"
                @click="department = 'Department'"
                class="cursor-pointer"
                color="accent"
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
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val.length >= 6 || 'Password must be at least 6 characters long',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-key" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="password !== ''"
                name="fa-solid fa-xmark"
                @click="password = ''"
                class="cursor-pointer"
                color="accent"
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
            input-style="color: #d7d8d3;"
            placeholder-style="color: #d7d8d3;"
            :rules="[
              (val) => !!val || 'Password is required',
              (val) => val === password || 'Password do not match',
            ]"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-key" color="accent" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="confirmPassword !== ''"
                name="fa-solid fa-xmark"
                @click="confirmPassword = ''"
                class="cursor-pointer"
                color="accent"
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

      <q-card-section class="q-pt-lg text-body2 text-center text-accent">
        Have Account??
        <span class="cursor-pointer text-heading-solid text-h6" @click="router.push('login')"
          >Login</span
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userName = ref('')
const email = ref('')
const batch = ref('')
const id = ref('')
const department = ref('Department')
const password = ref('')
const confirmPassword = ref('')

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
  console.log('Form submitted with text:')
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.text-heading-shadow {
  font-family: 'Londrina Shadow', cursive;
  color: #c29d48;
}
.text-heading-solid {
  font-family: 'Londrina Solid', cursive;
  color: #c29d48;
}
</style>
