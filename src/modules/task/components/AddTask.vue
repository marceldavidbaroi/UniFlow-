<template>
  <div class="row justify-center q-pa-lg">
    <div class="col-xs-12 col-sm-8 col-md-6">
      <q-form @submit="onSubmit" class="q-gutter-md q-pa-md rounded-borders">
        <div class="row q-col-gutter-md">
          <!-- <q-input v-model="formData.taskID" label="Task ID" outlined class="col-xs-12 col-sm-6" /> -->
          <q-select
            v-model="formData.sessionId"
            :options="sessionOption"
            label="Session "
            outlined
            class="col-xs-12 col-sm-6"
          />
          <q-select
            v-model="formData.groupID"
            :options="groupOption"
            label="Group"
            outlined
            class="col-xs-12 col-sm-6"
          />
          <!-- <q-input
            v-model="formData.ownerId"
            label="Owner ID"
            outlined
            class="col-xs-12 col-sm-6"
          /> -->
          <q-input v-model="formData.subject" label="Subject" outlined class="col-xs-12" />
          <q-input
            v-model="formData.description"
            type="textarea"
            label="Description"
            outlined
            class="col-xs-12"
          />
          <q-select
            v-model="formData.category"
            :options="categories"
            label="Category"
            outlined
            class="col-xs-12 col-sm-6"
          />
          <div class="col-xs-12">
            <label class="text-weight-medium q-mb-sm text-grey-8">Tags</label>
            <div class="row items-center q-gutter-sm">
              <div class="col-12">
                <q-chip
                  v-for="(tag, index) in formData.tags"
                  :key="index"
                  closable
                  square
                  @close="removeTag(index)"
                  color="secondary"
                  text-color="white"
                >
                  {{ tag }}
                </q-chip>
              </div>
              <q-select
                v-model="formData.tags"
                :options="tags"
                label="Tags"
                outlined
                dense
                multiple
                emit-value
                map-options
                class="col"
              />
            </div>
          </div>
          <q-input
            v-model="formData.deadline"
            label="Deadline"
            outlined
            class="col-xs-12 col-sm-6"
            readonly
          >
            <template v-slot:append>
              <q-icon name="event" color="secondary" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="formData.deadline"
                    mask="YYYY-MM-DDTHH:mm:ss"
                    :default-view="'Calendar'"
                    :emit-immediately="false"
                    color="secondary"
                  >
                    <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                      <q-btn label="OK" color="secondary" flat v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="formData.deadline" mask="YYYY-MM-DDTHH:mm:ss" format24h>
                <div class="row items-center justify-end q-gutter-sm q-pa-sm">
                  <q-btn label="OK" color="secondary" flat v-close-popup />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-input>

          <q-input
            v-model="formData.totalMarks"
            type="number"
            label="Total Marks"
            outlined
            class="col-xs-12 col-sm-6"
          />
        </div>
        <q-expansion-item label="Grading Rubric" icon="rule" color="secondary" class="q-mt-md">
          <q-card bordered="">
            <q-card-section class="bg-grey-2">
              <div
                v-for="(criterion, index) in formData.gradingRubric.criteria"
                :key="criterion.criterionId || index"
                class="row q-col-gutter-md items-end"
              >
                <!-- <q-input
                  v-model="criterion.criterionId"
                  label="Criterion ID"
                  outlined
                  class="col-xs-12 col-sm-6"
                /> -->
                <div class="col-12 text-bold text-secondary q-mt-lg">
                  Criterion No: {{ criterion.criterionId }}
                  <q-btn
                    icon="delete"
                    color="negative"
                    @click="removeCriterion(index)"
                    size="sm"
                    flat
                    round
                    dense
                  />
                </div>
                <q-input
                  v-model="criterion.description"
                  label="Description"
                  outlined
                  class="col-xs-12 col-sm-8"
                >
                  <template #default></template>
                </q-input>
                <q-input
                  v-model="criterion.maxPoints"
                  type="number"
                  label="Max Points"
                  outlined
                  class="col-xs-12 col-sm-4"
                />
              </div>
              <div class="q-mt-md">
                <q-btn label="Add Criterion" @click="addCriterion" color="secondary" />
                <q-input
                  v-model="formData.gradingRubric.notes"
                  type="textarea"
                  label="Notes"
                  outlined
                  class="q-mt-md"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Tasks" icon="list_alt" color="secondary" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <div
                v-for="(task, index) in formData.tasks"
                :key="task.taskId || index"
                class="q-mb-md bg-grey-2"
              >
                <div class="q-pa-md">
                  <div class="row q-col-gutter-md">
                    <!-- <q-input
                      v-model="task.taskId"
                      label="Task ID"
                      outlined
                      class="col-xs-12 col-sm-6"
                    /> -->

                    <div class="text-bold text-secondary">
                      Task No: {{ task.taskId }}
                      <q-btn
                        flat
                        size="sm"
                        dense
                        icon="delete"
                        color="negative"
                        @click="removeTask(index)"
                      />
                    </div>
                    <q-input
                      v-model="task.question"
                      type="textarea"
                      label="Question"
                      outlined
                      class="col-xs-12"
                    />
                  </div>
                  <q-separator class="q-my-md" />
                  <div class="row q-col-gutter-md">
                    <q-input
                      v-model="task.taskDetails.description"
                      type="textarea"
                      label="Description"
                      outlined
                      class="col-xs-12"
                    />
                    <q-input
                      v-model="task.taskDetails.points"
                      type="number"
                      label="Points"
                      outlined
                      class="col-xs-12 col-sm-6"
                    />
                    <q-input
                      v-model="task.taskDetails.type"
                      label="Type"
                      outlined
                      class="col-xs-12 col-sm-6"
                    />
                    <q-input
                      v-model="task.taskDetails.timeLimit"
                      label="Time Limit"
                      outlined
                      class="col-xs-12 col-sm-6"
                    />
                    <q-input
                      v-model="task.taskDetails.difficulty"
                      label="Difficulty"
                      outlined
                      class="col-xs-12 col-sm-6"
                    />
                    <div class="col-xs-12 q-mt-md">
                      <label class="text-weight-medium q-mb-sm text-grey-8">Attachments</label>
                      <div
                        v-for="(attachment, attachIndex) in task.taskDetails.attachments"
                        :key="attachIndex"
                        class="row q-col-gutter-sm items-end q-mb-sm"
                      >
                        <q-input
                          v-model="attachment.filename"
                          label="Filename"
                          outlined
                          class="col"
                        />
                        <q-input v-model="attachment.url" label="URL" outlined class="col" />
                        <q-btn
                          icon="delete"
                          color="negative"
                          @click="removeTaskAttachment(index, attachIndex)"
                          size="sm"
                          flat
                          round
                          dense
                        />
                      </div>
                      <q-btn
                        label="Add Attachment"
                        @click="addTaskAttachment(index)"
                        color="secondary"
                        size="sm"
                      />
                    </div>
                    <q-input
                      v-model="task.dependencies"
                      label="Dependencies (comma-separated)"
                      outlined
                      class="col-xs-12"
                    />
                    <q-input
                      v-model="task.learningObjectives"
                      label="Learning Objectives (comma-separated)"
                      outlined
                      class="col-xs-12"
                    />
                  </div>
                  <div class="q-mt-md flex justify-end">
                    <!-- <q-btn icon="delete" color="negative" @click="removeTask(index)" /> -->
                  </div>
                </div>
              </div>
              <q-btn label="Add Task" @click="addTask" color="secondary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Settings" icon="settings" color="secondary" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <q-toggle
                v-model="formData.settings.allowLateSubmissions"
                label="Allow Late Submissions"
              />
              <q-input
                v-model="formData.settings.lateSubmissionPenalty"
                type="number"
                label="Late Submission Penalty"
                outlined
              />
              <q-input v-model="formData.settings.gradingScheme" label="Grading Scheme" outlined />
              <q-input
                v-model="formData.settings.submissionType"
                label="Submission Type"
                outlined
              />
              <div class="q-mt-md">
                <q-toggle
                  v-model="formData.settings.reviewSettings.peerReview"
                  label="Peer Review"
                />
                <q-toggle
                  v-model="formData.settings.reviewSettings.instructorReview"
                  label="Instructor Review"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Announcements" icon="campaign" color="secondary" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <div
                v-for="(announcement, index) in formData.announcements"
                :key="announcement.announcementId || index"
                class="q-mb-md bordered rounded-borders bg-grey-2"
              >
                <div class="q-pa-md row q-col-gutter-md items-end">
                  <!-- <q-input
                    v-model="announcement.announcementId"
                    label="Announcement ID"
                    outlined
                    class="col-xs-12 col-sm-6"
                  /> -->
                  <div class="text-secondary text-bold">
                    Announcement No: {{ announcement.announcementId }}
                    <q-btn
                      icon="delete"
                      color="negative"
                      @click="removeAnnouncement(index)"
                      size="sm"
                      flat
                      round
                      dense
                    />
                  </div>
                  <q-input v-model="announcement.title" label="Title" outlined class="col-xs-12" />
                  <q-input
                    v-model="announcement.content"
                    type="textarea"
                    label="Content"
                    outlined
                    class="col-xs-12"
                  />
                  <q-input
                    v-model="announcement.createdAt"
                    type="datetime"
                    label="Created At"
                    outlined
                    class="col-xs-12 col-sm-6"
                  />
                  <q-input
                    v-model="announcement.authorId"
                    label="Author ID"
                    outlined
                    class="col-xs-12 col-sm-6"
                  />
                </div>
              </div>
              <q-btn label="Add Announcement" @click="addAnnouncement" color="secondary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Resources" icon="folder" color="secondary" class="q-mt-md">
          <q-card class="bg-grey-2">
            <q-card-section class="">
              <div
                v-for="(resource, index) in formData.resources"
                :key="resource.resourceId || index"
                class="row q-col-gutter-md items-end q-mb-sm q-mt-md"
              >
                <!-- <q-input
                  v-model="resource.resourceId"
                  label="Resource ID"
                  outlined
                  class="col-xs-12 col-sm-4"
                /> -->
                <div class="text-secondary text-bold col-12">
                  Resource No: {{ resource.resourceId }}
                  <q-btn
                    icon="delete"
                    color="negative"
                    @click="removeResource(index)"
                    size="sm"
                    flat
                    round
                    dense
                    class="col-auto"
                  />
                </div>
                <q-input v-model="resource.title" label="Title" outlined class="col-12" />
                <q-input v-model="resource.url" label="URL" outlined class="col-12" />
                <q-input v-model="resource.type" label="Type" outlined class="col-12" />
                <!-- <q-btn
                  icon="delete"
                  color="negative"
                  @click="removeResource(index)"
                  size="sm"
                  flat
                  round
                  dense
                  class="col-auto"
                /> -->
              </div>
              <q-btn label="Add Resource" @click="addResource" color="secondary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <div class="row q-col-gutter-md q-mt-md"></div>
        <q-btn-dropdown
          class="full-width q-mt-md"
          color="secondary"
          :label="submitLabel"
          v-model="submitDropdown"
        >
          <q-list>
            <q-item clickable v-close-popup @click="onSubmit('draft')">
              <q-item-section>Save as Draft</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onSubmit('ready')">
              <q-item-section>{{
                taskStore.selectedTask ? 'Edit Task' : 'Create Task'
              }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { useGroupStore } from 'src/stores/group-store'
import { useSessionStore } from 'src/stores/sessionStore'
import { useTaskStore } from 'src/stores/taskStore'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const taskStore = useTaskStore()
const sessionStore = useSessionStore()
const groupStore = useGroupStore()

const sessionOption = ref([])
const groupOption = ref([])
onMounted(async () => {
  const sessions = await sessionStore.fetchCreatedSessions()
  sessionOption.value = sessions.data.map((session) => ({
    label: `${session.sessionID} - ${session.sessionName}`,
    value: session.id,
  }))

  const groups = await groupStore.fetchAllGroups()

  groupOption.value = groups.data.map((group) => ({
    label: group.groupName,
    value: group.id,
  }))

  // Initialize sessionAssignment
  formData.value.sessionAssignment = {}
  sessions.data.forEach((session) => {
    formData.value.sessionAssignment[session.id] = false
  })
})

const categories = ref([
  { label: 'Assignment', value: 'assignment' },
  { label: 'Project', value: 'project' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Lab Work', value: 'lab_work' },
  { label: 'Homework', value: 'homework' },
  { label: 'Exam', value: 'exam' },
  { label: 'Presentation', value: 'presentation' },
  { label: 'Peer Review', value: 'peer_review' },
  { label: 'Research Paper', value: 'research_paper' },
  { label: 'Discussion', value: 'discussion' },
])

const tags = ref([
  { label: 'Group', value: 'group' },
  { label: 'Graded', value: 'graded' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Critical', value: 'critical' },
  { label: 'Collaborative', value: 'collaborative' },
  { label: 'Peer Review', value: 'peer_review' },
  { label: 'Easy', value: 'easy' },
  { label: 'Medium', value: 'medium' },
  { label: 'Hard', value: 'hard' },
  { label: 'Programming', value: 'programming' },
  { label: 'Writing', value: 'writing' },
  { label: 'Presentation', value: 'presentation' },
  { label: 'Research', value: 'research' },
  { label: 'Review', value: 'review' },
])

const formData = ref({
  taskID: '',
  sessionId: '',
  groupID: '',
  ownerId: '',
  subject: '',
  description: '',
  category: '',
  tags: [],
  deadline: '',
  totalMarks: null,
  gradingRubric: {
    criteria: [],
    notes: '',
  },
  tasks: [],
  settings: {
    allowLateSubmissions: false,
    lateSubmissionPenalty: null,
    gradingScheme: '',
    submissionType: '',
    reviewSettings: {
      peerReview: false,
      instructorReview: false,
    },
  },
  announcements: [],
  resources: [],
  state: 'draft', // Add state field
  sessionAssignment: {}, // Add sessionAssignment field
})

// Prefill form if editing a task
watch(
  () => taskStore.selectedTask,
  (selected) => {
    if (selected) {
      formData.value = { ...selected }
    }
  },
  { immediate: true },
)

// const newTag = ref('')

// const addTag = () => {
//   if (newTag.value.trim() !== '') {
//     formData.value.tags.push(newTag.value.trim())
//     newTag.value = ''
//   }
// }

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

const criterionCounter = ref(1) // Initialize a counter for auto-incrementing IDs

const addCriterion = () => {
  formData.value.gradingRubric.criteria.push({
    criterionId: criterionCounter.value, // Use the counter for the ID
    description: '',
    maxPoints: null,
  })
  criterionCounter.value++ // Increment the counter
}

const removeCriterion = (index) => {
  formData.value.gradingRubric.criteria.splice(index, 1)
}

const taskCounter = ref(1) // Initialize a counter for auto-incrementing task IDs

const addTask = () => {
  formData.value.tasks.push({
    taskId: taskCounter.value, // Use the counter for the task ID
    question: '',
    taskDetails: {
      description: '',
      points: null,
      type: '',
      attachments: [],
      timeLimit: '',
      difficulty: '',
    },
    dependencies: [],
    learningObjectives: [],
    membersProgress: [], // Note: This is usually populated dynamically
  })
  taskCounter.value++ // Increment the counter
}

const removeTask = (index) => {
  formData.value.tasks.splice(index, 1)
}

const addTaskAttachment = (taskIndex) => {
  formData.value.tasks[taskIndex].taskDetails.attachments.push({
    filename: '',
    url: '',
  })
}

const removeTaskAttachment = (taskIndex, attachIndex) => {
  formData.value.tasks[taskIndex].taskDetails.attachments.splice(attachIndex, 1)
}
const announcementCounter = ref(1) // Initialize a counter for auto-incrementing IDs
const addAnnouncement = () => {
  formData.value.announcements.push({
    announcementId: announcementCounter.value,
    title: '',
    content: '',
    createdAt: '',
    authorId: '',
  })
  announcementCounter.value++
}

const removeAnnouncement = (index) => {
  formData.value.announcements.splice(index, 1)
}
const resourceCounter = ref(1) // Initialize a counter for auto-incrementing IDs
const addResource = () => {
  formData.value.resources.push({
    resourceId: resourceCounter.value,
    title: '',
    url: '',
    type: '',
  })
  resourceCounter.value++
}

const removeResource = (index) => {
  formData.value.resources.splice(index, 1)
}

import { ref as vueRef } from 'vue'
const submitDropdown = vueRef(false)
// const submitOptions = [
//   { label: 'Save as Draft', value: 'draft' },
//   { label: taskStore.selectedTask ? 'Edit Task' : 'Create Task', value: 'ready' },
// ]
const submitLabel = vueRef(taskStore.selectedTask ? 'Edit Task' : 'Create Task')

const onSubmit = async (action = 'ready') => {
  formData.value.state = action
  console.log('Form Data:', formData.value)

  if (taskStore.selectedTask) {
    // If a task is being edited, update it
    await taskStore.updateTask(taskStore.selectedTask.id, formData.value)
    taskStore.selectedTask = null
    router.push({ name: 'task' })
  } else {
    // Otherwise, create a new task
    await taskStore.createTask(formData.value)
    router.push({ name: 'task' })
  }
}
</script>

<style scoped>
.bordered {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
