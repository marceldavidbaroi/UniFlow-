<template>
  <q-page class="flex flex-center">
    <q-form @submit="submitForm" class="q-gutter-md" style="max-width: 600px; width: 100%">
      <div class="text-h4 text-center q-mb-md brand_sb">Create a Group</div>

      <q-input
        v-model="groupName"
        label="Group Name"
        outlined
        :rules="[(val) => !!val || 'Group Name is required']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="group" />
        </template>
      </q-input>

      <q-input
        v-model="batch"
        label="Batch"
        outlined
        :rules="[(val) => !!val || 'Batch is required']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="calendar_today" />
        </template>
      </q-input>
      <q-input
        v-model="semester"
        label="Semester"
        outlined
        :rules="[(val) => !!val || 'Semester is required']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="school" />
        </template>
      </q-input>
      <q-input
        v-model="year"
        label="Year"
        type="number"
        outlined
        :rules="[(val) => val > 2000 || 'Enter a valid year (greater than 2000)']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="event" />
        </template>
      </q-input>

      <q-input
        v-model="subjectName"
        label="Subject Name"
        outlined
        :rules="[(val) => !!val || 'Subject Name is required']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="subject" />
        </template>
      </q-input>
      <q-input v-model="description" label="Description" type="textarea" outlined class="q-mb-sm">
        <template v-slot:prepend>
          <q-icon name="description" />
        </template>
      </q-input>
      <q-toggle v-model="addRules" label="Add Group Rules" class="q-mb-sm" />
      <q-editor
        v-if="addRules"
        v-model="groupRules"
        label="Group Rules"
        outlined
        class="q-mb-sm"
        :toolbar="toolbarItems"
      />

      <q-input
        v-model="password"
        label="Password"
        :type="passwordVisible ? 'text' : 'password'"
        outlined
        :rules="[(val) => val.length >= 6 || 'Password must be at least 6 characters']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="lock" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="passwordVisible ? 'visibility_off' : 'visibility'"
            @click="passwordVisible = !passwordVisible"
            class="cursor-pointer"
          />
        </template>
      </q-input>
      <q-input
        v-model="confirmPassword"
        label="Confirm Password"
        :type="confirmPasswordVisible ? 'text' : 'password'"
        outlined
        :rules="[(val) => val === password || 'Passwords do not match']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="lock_open" />
        </template>
        <template v-slot:append>
          <q-icon
            :name="confirmPasswordVisible ? 'visibility_off' : 'visibility'"
            @click="confirmPasswordVisible = !confirmPasswordVisible"
            class="cursor-pointer"
          />
        </template>
      </q-input>
      <q-input
        v-model="maxMembers"
        label="Max Members"
        type="number"
        outlined
        :rules="[(val) => val > 0 || 'Enter a valid number of members']"
        class="q-mb-sm"
      >
        <template v-slot:prepend>
          <q-icon name="people" />
        </template>
      </q-input>
      <q-toggle v-model="labGroup" label="Lab Group" class="q-mb-sm" />

      <q-btn
        label="Create Group"
        type="submit"
        color="primary"
        class="full-width q-mt-md"
        :loading="isLoading"
      />
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
// import { useQuasar } from 'quasar'
import { useGroupStore } from 'src/stores/group-store'
import { useQuasar } from 'quasar'

const $q = useQuasar()

import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const groupStore = useGroupStore()
const router = useRouter()

const groupName = ref('')
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
const addRules = ref(false)

const isLoading = ref(false)
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)

const submitForm = () => {
  isLoading.value = true

  groupStore
    .createGroup(
      groupName.value,
      batch.value,
      semester.value,
      year.value,
      subjectName.value,
      description.value,
      groupRules.value,
      password.value,
      confirmPassword.value,
      maxMembers.value,
      labGroup.value,
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
        // Reset form fields
        groupName.value = ''
        batch.value = ''
        semester.value = ''
        year.value = ''
        subjectName.value = ''
        description.value = ''
        groupRules.value = ''
        password.value = ''
        confirmPassword.value = ''
        maxMembers.value = ''
        labGroup.value = false

        setTimeout(() => {
          router.push('/group/list')
        }, 2000)
      }
    })
    .catch(() => {
      Notify.create({
        message: 'An error occurred while creating the group.',
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
</script>

<style scoped>
.q-form {
  padding: 20px;
}

.q-btn {
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
}
</style>
