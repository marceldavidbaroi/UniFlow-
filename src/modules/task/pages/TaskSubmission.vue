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
        <div v-if="task?.tags && task.tags.length" class="q-mb-xs">
          <b>Tags:</b>
          <q-chip
            v-for="tag in task.tags"
            :key="tag"
            dense
            square
            color="secondary"
            text-color="white"
            class="q-mr-xs"
            >{{ tag }}</q-chip
          >
        </div>
        <div v-if="task?.resources && task.resources.length" class="q-mb-xs">
          <b>Resources:</b>
          <ul class="q-pl-md">
            <li v-for="r in task.resources" :key="r.resourceId">
              <a v-if="r.url" :href="r.url" target="_blank">{{ r.title || r.url }}</a>
              <span v-else>{{ r.title }}</span>
              <span v-if="r.type"> ({{ r.type }})</span>
            </li>
          </ul>
        </div>
        <div
          v-if="
            task?.gradingRubric && task.gradingRubric.criteria && task.gradingRubric.criteria.length
          "
          class="q-mb-xs"
        >
          <b>Grading Rubric:</b>
          <ul class="q-pl-md">
            <li v-for="c in task.gradingRubric.criteria" :key="c.criterionId">
              <span class="text-bold">{{ c.description }}</span> - Max Points: {{ c.maxPoints }}
            </li>
          </ul>
          <div v-if="task.gradingRubric.notes" class="text-caption text-grey-7 q-mt-xs">
            Notes: {{ task.gradingRubric.notes }}
          </div>
        </div>
      </div>
      <q-form @submit.prevent="onSubmit">
        <q-card
          flat
          bordered
          class="q-pa-md q-mb-md bg-grey-1 flex items-center justify-between modern-acknowledge-card"
        >
          <div>
            <div class="text-caption text-grey-8 text-weight-bold q-mb-xs">
              <q-icon name="info" color="primary" class="q-mr-xs" />
              Google Drive Submission Instructions
            </div>
            <div class="text-caption text-grey-7">
              For each subtask, if you upload files to Google Drive, create a folder for your files
              named:<br />
              <span class="text-weight-bold text-red">
                {{ task?.taskID }}-{{ userStore.currentUser.personId }}-{{
                  task?.deadline ? new Date(task.deadline).getFullYear() : new Date().getFullYear()
                }}-f&lt;<span style="color: #d32f2f">folder number</span>&gt; </span
              ><br />
              Each file inside should be named:<br />
              <span class="text-weight-bold text-red">
                {{ task?.taskID }}-{{ userStore.currentUser.personId }}-{{
                  task?.deadline ? new Date(task.deadline).getFullYear() : new Date().getFullYear()
                }}-&lt;<span style="color: #d32f2f">file number</span>&gt; </span
              ><br />
              (Replace <b class="text-red">&lt;folder number&gt;</b> and
              <b class="text-red">&lt;file number&gt;</b> with the appropriate numbers for your
              submission. Use the same convention for all subtasks.)
            </div>
          </div>
          <q-toggle
            v-model="acknowledged"
            color="primary"
            keep-color
            size="lg"
            class="q-ml-lg"
            label="Acknowledge"
          />
        </q-card>
        <div class="q-mb-md text-h6 text-weight-bold">
          <span class="text-red text-weight-bold">#{{ task?.taskID }}</span>
          <span class="q-ml-md text-weight-bold">{{ task?.subject }}</span>
          <span v-if="task?.tasks && task.tasks.length" class="q-ml-lg text-grey-7 text-caption">
            (Total Tasks: <b>{{ task.tasks.length }}</b
            >)
          </span>
        </div>
        <div v-for="(t, idx) in task?.tasks || []" :key="t.taskId || idx" class="q-mb-lg">
          <q-expansion-item
            :label="'Task #' + (idx + 1) + ': ' + t.question"
            expand-separator
            class="q-mb-md"
            :default-opened="false"
          >
            <q-editor
              v-model="submission['content_' + idx]"
              :placeholder="'Write your answer for Task #' + (idx + 1) + ' here...'"
              class="q-mb-md modern-input"
              :min-height="100"
              :toolbar="[
                [
                  'bold',
                  'italic',
                  'strike',
                  'underline',
                  'quote',
                  'unordered',
                  'ordered',
                  'link',
                  'hr',
                ],
                ['left', 'center', 'right', 'justify'],
                ['undo', 'redo', 'fullscreen'],
              ]"
            />
            <div class="q-mb-md">
              <div
                v-for="(link, linkIdx) in submission['driveLinks_' + idx] || []"
                :key="linkIdx"
                class="q-mb-sm row items-center"
              >
                <q-input
                  v-model="submission['driveLinks_' + idx][linkIdx]"
                  label="Google Drive Link"
                  outlined
                  class="modern-input col"
                  :placeholder="'Paste your Google Drive link for Task #' + (idx + 1) + ' here...'"
                />
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  size="sm"
                  class="q-ml-xs"
                  @click="removeDriveLink(idx, linkIdx)"
                />
              </div>
              <q-btn
                flat
                color="secondary"
                icon="add"
                label="Add Link"
                size="sm"
                @click="addDriveLink(idx)"
              />
            </div>
            <div class="q-mb-md text-caption text-grey-7">
              You can submit either a text answer, Google Drive links, or both for each subtask.
              Save as draft to continue later, or submit when ready.
            </div>
          </q-expansion-item>
          <q-separator class="q-my-md" />
        </div>
        <div class="q-mb-md text-caption text-grey-7">
          <b>Instructions:</b>
          <ul>
            <li>Fill in the answer for each subtask in the provided text area.</li>
            <li>
              If you have supporting files, upload them to Google Drive and paste the link in the
              corresponding field.
            </li>
            <li>You can save your progress as a draft and return later.</li>
            <li>
              Click <b>Submit</b> only when you are ready to finalize your answers for all subtasks.
            </li>
            <li>
              Once submitted, you may not be able to edit your answers unless allowed by your
              instructor.
            </li>
          </ul>
        </div>
        <div class="row q-gutter-sm">
          <q-btn color="grey-6" label="Save as Draft" @click="onSaveDraft" :disable="loading" />
          <q-btn
            color="secondary"
            label="Submit"
            type="submit"
            :loading="loading"
            :disable="!acknowledged || loading"
          />
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
import { Notify } from 'quasar'
const route = useRoute()
const taskStore = useTaskStore()
const userStore = useUserStore()

const task = ref(null)
const submission = ref({
  status: 'draft',
  grade: null,
  feedback: '',
})
const loading = ref(false)
const acknowledged = ref(false)

// Ensure driveLinks arrays are initialized for each subtask
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
  // Initialize driveLinks arrays for each subtask
  if (task.value && Array.isArray(task.value.tasks)) {
    task.value.tasks.forEach((t, idx) => {
      const key = 'driveLinks_' + idx
      if (!submission.value[key]) submission.value[key] = []
    })
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

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
  if (!acknowledged.value) {
    Notify.create({
      type: 'negative',
      message: 'You must acknowledge the Google Drive submission instructions before submitting.',
      color: 'negative',
      icon: 'warning',
      position: 'top',
      timeout: 2500,
    })
    return
  }
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

// Add methods for dynamic drive links
const addDriveLink = (idx) => {
  const key = 'driveLinks_' + idx
  if (!submission.value[key]) submission.value[key] = []
  submission.value[key].push('')
}
const removeDriveLink = (idx, linkIdx) => {
  const key = 'driveLinks_' + idx
  if (submission.value[key]) submission.value[key].splice(linkIdx, 1)
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
.text-red {
  color: #d32f2f;
}
.modern-acknowledge-card {
  transition: background-color 0.3s;
}
.modern-acknowledge-card:hover {
  background-color: #f0f0f0;
}
</style>
