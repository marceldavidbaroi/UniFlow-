<template>
  <q-page padding class="submission-page">
    <q-card class="q-pa-lg q-mb-md submission-card">
      <div class="row items-center q-mb-md">
        <q-icon name="assignment" size="32px" color="secondary" class="q-mr-md" />
        <div>
          <div class="text-h5 text-weight-bold">Submit Task</div>
          <div class="text-subtitle2 text-grey-7">Task: {{ task?.subject }}</div>
        </div>
        <q-space />
        <q-badge v-if="submission.status === 'draft'" color="grey-5" label="Draft" />
        <q-badge
          v-else-if="submission.status === 'submitted'"
          color="secondary"
          label="Submitted"
        />
        <q-badge v-else-if="submission.status === 'graded'" color="positive" label="Graded" />
        <q-badge v-else-if="submission.status === 'late'" color="warning" label="Late" />
      </div>
      <q-separator />
      <div class="q-mt-md q-mb-md">
        <div class="text-body1 q-mb-xs"><b>Description:</b> {{ task?.description }}</div>
        <div class="text-caption text-grey-7 q-mb-xs">
          <b>Deadline:</b> {{ formatDate(task?.deadline) }}
        </div>
        <div class="text-caption text-grey-7 q-mb-xs">
          <b>Total Marks:</b> {{ task?.totalMarks }}
        </div>
        <div class="text-caption text-grey-7 q-mb-xs">
          <b>Category:</b> {{ task?.category?.label || task?.category }}
        </div>
      </div>
      <q-form @submit.prevent="onSubmit">
        <q-input
          v-model="submission.content"
          type="textarea"
          label="Your Answer (Text)"
          outlined
          autogrow
          class="q-mb-md modern-input"
          placeholder="Write your answer here..."
        />
        <q-input
          v-model="submission.driveLink"
          label="Google Drive Link (optional)"
          outlined
          class="q-mb-md modern-input"
          placeholder="Paste your Google Drive link here..."
        />
        <div class="q-mb-md text-caption text-grey-7">
          You can submit either a text answer, a Google Drive link, or both. You can save as draft
          and submit later.
        </div>
        <div class="row q-gutter-sm">
          <q-btn color="grey-6" label="Save as Draft" @click="onSaveDraft" :disable="loading" />
          <q-btn color="secondary" label="Submit" type="submit" :loading="loading" />
        </div>
      </q-form>
      <q-separator class="q-my-md" />
      <div v-if="submission.status === 'graded'" class="q-mt-md">
        <q-banner dense class="bg-positive text-white">
          <div class="text-h6">Graded</div>
          <div><b>Grade:</b> {{ submission.grade }}</div>
          <div><b>Feedback:</b> {{ submission.feedback }}</div>
        </q-banner>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useTaskStore } from 'src/stores/taskStore'
import { useUserStore } from 'src/stores/user-store'
const route = useRoute()
const taskStore = useTaskStore()
const userStore = useUserStore()

const task = ref(null)
const submission = ref({
  content: '',
  driveLink: '',
  status: 'draft',
  grade: null,
  feedback: '',
})
const loading = ref(false)

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  const taskId = route.params.taskId
  if (!taskId) return
  const userId = userStore.currentUser.id
  task.value = await taskStore.getTaskById(taskId)
  // Try to load existing submission
  const existing = await taskStore.getSubmission(taskId, userId)
  if (existing) {
    submission.value = { ...existing }
  }
})

const onSaveDraft = async () => {
  loading.value = true
  const taskId = route.params.taskId
  const userId = userStore.currentUser.id
  await taskStore.createSubmission({
    ...submission.value,
    taskId,
    userId,
    status: 'draft',
  })
  loading.value = false
}

const onSubmit = async () => {
  loading.value = true
  const taskId = route.params.taskId
  const userId = userStore.currentUser.id
  await taskStore.createSubmission({
    ...submission.value,
    taskId,
    userId,
    status: 'submitted',
  })
  loading.value = false
}
</script>

<style scoped>
.submission-page {
  background: #f9f9f9;
  min-height: 100vh;
}
.submission-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 60, 60, 0.07);
  border: 1px solid #e0e0e0;
  background: #fff;
}
.modern-input .q-field__control {
  border-radius: 8px;
  background: #fff;
  box-shadow: none;
  border: 1px solid #e0e0e0;
}
</style>
