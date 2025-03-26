<template>
  <q-page class="flex flex-center">
    <q-form @submit="submitForm" class="q-gutter-md" style="max-width: 600px; width: 100%">
      <!-- Title -->
      <div class="text-h6 text-center q-mb-md">Create a Group</div>

      <!-- Group Information -->
      <q-input
        v-model="groupName"
        label="Group Name"
        outlined
        :rules="[(val) => !!val || 'Group Name is required']"
        class="q-mb-sm"
      />
      <q-input
        v-model="groupAdmin"
        label="Group Admin"
        outlined
        :rules="[(val) => !!val || 'Group Admin is required']"
        class="q-mb-sm"
      />
      <q-input
        v-model="batch"
        label="Batch"
        outlined
        :rules="[(val) => !!val || 'Batch is required']"
        class="q-mb-sm"
      />
      <q-input
        v-model="semester"
        label="Semester"
        outlined
        :rules="[(val) => !!val || 'Semester is required']"
        class="q-mb-sm"
      />
      <q-input
        v-model="year"
        label="Year"
        type="number"
        outlined
        :rules="[(val) => val > 2000 || 'Enter a valid year (greater than 2000)']"
        class="q-mb-sm"
      />

      <!-- Subject Information -->
      <q-input
        v-model="subjectName"
        label="Subject Name"
        outlined
        :rules="[(val) => !!val || 'Subject Name is required']"
        class="q-mb-sm"
      />
      <q-input v-model="description" label="Description" type="textarea" outlined class="q-mb-sm" />
      <q-input v-model="groupRules" label="Group Rules" type="textarea" outlined class="q-mb-sm" />

      <!-- Group Settings -->
      <q-input
        v-model="password"
        label="Password"
        type="password"
        outlined
        :rules="[(val) => val.length >= 6 || 'Password must be at least 6 characters']"
        class="q-mb-sm"
      />
      <q-input
        v-model="confirmPassword"
        label="Confirm Password"
        type="password"
        outlined
        :rules="[(val) => val === password || 'Passwords do not match']"
        class="q-mb-sm"
      />
      <q-input
        v-model="maxMembers"
        label="Max Members"
        type="number"
        outlined
        :rules="[(val) => val > 0 || 'Enter a valid number of members']"
        class="q-mb-sm"
      />
      <q-toggle v-model="labGroup" label="Lab Group" class="q-mb-sm" />

      <!-- Submit Button -->
      <q-btn
        label="Create Group"
        type="submit"
        color="primary"
        class="full-width q-mt-md"
        rounded
      />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const groupName = ref('')
const groupAdmin = ref('')
const batch = ref('')
const semester = ref('')
const year = ref('')
const subjectName = ref('')
const description = ref('')
const groupRules = ref('')
const password = ref('')
const confirmPassword = ref('')
const maxMembers = ref('')
const labGroup = ref(false)

const submitForm = () => {
  if (
    !groupName.value ||
    !groupAdmin.value ||
    !batch.value ||
    !semester.value ||
    !year.value ||
    !subjectName.value ||
    !password.value ||
    !confirmPassword.value ||
    !maxMembers.value
  ) {
    $q.notify({ type: 'negative', message: 'Please fill in all required fields' })
    return
  }
  if (password.value !== confirmPassword.value) {
    $q.notify({ type: 'negative', message: 'Passwords do not match' })
    return
  }
  $q.notify({ type: 'positive', message: 'Group Created Successfully' })
}
</script>

<style scoped>
.q-form {
  padding: 20px;
}

.q-btn {
  padding: 10px;
  font-size: 16px;
  border-radius: 10px;
}

.full-width {
  width: 100%;
}
</style>
