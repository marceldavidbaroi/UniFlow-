<template>
  <q-page class="flex flex-center">
    <q-card class="my-card q-pa-lg" style="max-width: 600px; width: 420px; border-radius: 8%">
      <q-card-section class="q-pt-md q-pb-xl">
        <div class="text-h2 text-heading-shadow text-center">LOGIN</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-sm">
          <!-- email -->
          <q-input
            outlined
            fill
            v-model="email"
            type="email"
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
              <q-icon name="fa-solid fa-envelope" color="dark" />
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

          <!-- password -->
          <q-input
            outlined
            fill
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

          <!-- login buttom -->
          <div>
            <q-btn
              label="Login"
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
        Don't have Account??
        <span class="cursor-pointer text-heading-solid text-h6" @click="router.push('signup')"
          >Register Now</span
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { useUserStore } from 'src/stores/user-store'

import { Notify } from 'quasar'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const email = ref('d@gmail.com')
const password = ref('123123')
const onSubmit = () => {
  authStore
    .loginUser(email.value, password.value)
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
          if (userStore.currentRole === 'teacher') {
            router.push('/dashboard/teacher')
          } else if (userStore.currentRole === 'student') {
            router.push('/dashboard/student')
          }
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
