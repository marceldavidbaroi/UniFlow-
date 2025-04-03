<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card
      style="
        width: 400px;
        max-width: 90vw;
        border-radius: 12px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      "
    >
      <q-card-section class="q-pa-lg">
        <div class="text-h5 text-center q-mb-lg brand_bb text-bold">Join Group</div>

        <div class="q-mb-md">
          <div class="text-subtitle1 text-grey-8">Group Name</div>
          <div class="text-body1 brand_sb">{{ groupName }}</div>
        </div>

        <div class="q-mb-md">
          <div class="text-subtitle1 text-grey-8">Owner</div>
          <div class="text-body1 brand_sb">{{ ownerName }}</div>
        </div>

        <div class="q-mb-md">
          <div class="text-subtitle1 text-grey-8">Total Members</div>
          <div class="text-body1 brand_sb">{{ totalMembers }}</div>
        </div>

        <q-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          outlined
          dense
          class="q-mt-md"
          input-class="text-grey-9"
          color="secondary"
          style="border-radius: 8px"
          :rules="[
            (val) => !!val || 'Password is required',
            (val) => val.length >= 6 || 'Password must be at least 6 characters',
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              @click="showPassword = !showPassword"
              class="cursor-pointer"
            />
          </template>
        </q-input>

        <q-btn
          color="secondary"
          label="Join Group"
          class="full-width q-mt-lg"
          @click="joinGroup"
          :loading="loading"
          style="border-radius: 8px; padding: 12px 16px"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const groupName = 'Study Group A'
const ownerName = 'John Doe'
const totalMembers = 25
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const joinGroup = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    console.log('Joining group with password:', password.value)
  }, 1000)
}
</script>

<style lang="scss" scoped>
/* Add any custom styling here */
</style>
