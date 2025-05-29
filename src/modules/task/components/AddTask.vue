<template>
  <div class="row justify-center q-pa-lg">
    <div class="col-xs-12 col-sm-8 col-md-6">
      <div class="row items-center q-mb-md">
        <div class="col-auto">
          <q-btn flat round dense icon="info" color="secondary" @click="showInfoDialog = true" />
        </div>
        <div class="col">
          <span class="text-h6">Add Task</span>
        </div>
      </div>
      <q-form @submit="onSubmit" class="q-gutter-md q-pa-md rounded-borders modern-form">
        <div class="row q-col-gutter-md">
          <q-input
            v-model="formData.subject"
            label="Subject"
            outlined
            class="col-xs-12 modern-input"
          />
          <q-input
            v-model="formData.description"
            type="textarea"
            label="Description"
            outlined
            class="col-xs-12 modern-input"
            autogrow
          />
          <q-select
            v-model="formData.category"
            :options="categories"
            label="Category"
            outlined
            class="col-xs-12 col-sm-6 modern-input"
            dense
            emit-value
            map-options
            color="secondary"
            bg-color="white"
            placeholder="Select category"
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
                class="col modern-input"
                color="secondary"
                bg-color="white"
                placeholder="Add tags"
              />
            </div>
          </div>
          <q-input
            v-model="formData.deadline"
            label="Deadline"
            outlined
            class="col-xs-12 col-sm-6 modern-input"
            readonly
            color="secondary"
            placeholder="Select deadline"
          >
            <template v-slot:append>
              <q-icon name="event" color="secondary" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="formData.deadline" mask="YYYY-MM-DDTHH:mm:ss" color="secondary">
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
            class="col-xs-12 col-sm-6 modern-input"
            color="secondary"
            placeholder="Enter total marks"
          />
        </div>
        <q-expansion-item label="Grading Rubric" icon="rule" color="secondary" class="q-mt-md">
          <q-card bordered>
            <q-card-section class="bg-grey-2">
              <div
                v-for="(criterion, index) in formData.gradingRubric.criteria"
                :key="criterion.criterionId || index"
                class="row q-col-gutter-md items-end"
              >
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
                  class="col-xs-12 col-sm-8 modern-input"
                  autogrow
                />
                <q-input
                  v-model="criterion.maxPoints"
                  type="number"
                  label="Max Points"
                  outlined
                  class="col-xs-12 col-sm-4 modern-input"
                />
              </div>
              <div class="q-mt-md">
                <q-btn label="Add Criterion" @click="addCriterion" color="secondary" />
                <q-input
                  v-model="formData.gradingRubric.notes"
                  type="textarea"
                  label="Notes"
                  outlined
                  class="q-mt-md modern-input"
                  autogrow
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
                class="q-mb-md bg-grey-2 rounded-borders"
              >
                <div class="q-pa-md">
                  <div class="row q-col-gutter-md">
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
                      class="col-xs-12 modern-input"
                      autogrow
                    />
                  </div>
                  <q-separator class="q-my-md" />
                  <div class="row q-col-gutter-md">
                    <q-input
                      v-model="task.taskDetails.description"
                      type="textarea"
                      label="Description"
                      outlined
                      class="col-xs-12 modern-input"
                      autogrow
                    />
                    <q-input
                      v-model="task.taskDetails.points"
                      type="number"
                      label="Points"
                      outlined
                      class="col-xs-12 col-sm-6 modern-input"
                    />
                    <q-input
                      v-model="task.taskDetails.type"
                      label="Type"
                      outlined
                      class="col-xs-12 col-sm-6 modern-input"
                    />
                    <q-input
                      v-model="task.taskDetails.timeLimit"
                      label="Time Limit"
                      outlined
                      class="col-xs-12 col-sm-6 modern-input"
                    />
                    <q-input
                      v-model="task.taskDetails.difficulty"
                      label="Difficulty"
                      outlined
                      class="col-xs-12 col-sm-6 modern-input"
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
                          class="col modern-input"
                        />
                        <q-input
                          v-model="attachment.url"
                          label="URL"
                          outlined
                          class="col modern-input"
                        />
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
                      class="col-xs-12 modern-input"
                    />
                    <q-input
                      v-model="task.learningObjectives"
                      label="Learning Objectives (comma-separated)"
                      outlined
                      class="col-xs-12 modern-input"
                    />
                  </div>
                  <div class="q-mt-md flex justify-end"></div>
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
                color="secondary"
              />
              <q-input
                v-model="formData.settings.lateSubmissionPenalty"
                type="number"
                label="Late Submission Penalty"
                outlined
                class="modern-input"
                color="secondary"
              />
              <q-input
                v-model="formData.settings.gradingScheme"
                label="Grading Scheme"
                outlined
                class="modern-input"
                color="secondary"
              />
              <q-input
                v-model="formData.settings.submissionType"
                label="Submission Type"
                outlined
                class="modern-input"
                color="secondary"
              />
              <div class="q-mt-md">
                <q-toggle
                  v-model="formData.settings.reviewSettings.peerReview"
                  label="Peer Review"
                  color="secondary"
                />
                <q-toggle
                  v-model="formData.settings.reviewSettings.instructorReview"
                  label="Instructor Review"
                  color="secondary"
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
                  <q-input
                    v-model="announcement.title"
                    label="Title"
                    outlined
                    class="col-xs-12 modern-input"
                  />
                  <q-input
                    v-model="announcement.content"
                    type="textarea"
                    label="Content"
                    outlined
                    class="col-xs-12 modern-input"
                    autogrow
                  />
                  <q-input
                    v-model="announcement.createdAt"
                    type="datetime"
                    label="Created At"
                    outlined
                    class="col-xs-12 col-sm-6 modern-input"
                  />
                  <q-input
                    v-model="announcement.authorId"
                    label="Author ID"
                    outlined
                    class="col-xs-12 col-sm-6 modern-input"
                  />
                </div>
              </div>
              <q-btn label="Add Announcement" @click="addAnnouncement" color="secondary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Resources" icon="folder" color="secondary" class="q-mt-md">
          <q-card class="bg-grey-2">
            <q-card-section>
              <div
                v-for="(resource, index) in formData.resources"
                :key="resource.resourceId || index"
                class="row q-col-gutter-md items-end q-mb-sm q-mt-md"
              >
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
                <q-input
                  v-model="resource.title"
                  label="Title"
                  outlined
                  class="col-12 modern-input"
                />
                <q-input v-model="resource.url" label="URL" outlined class="col-12 modern-input" />
                <q-input
                  v-model="resource.type"
                  label="Type"
                  outlined
                  class="col-12 modern-input"
                />
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
      <TaskInfoDialog
        :model-value="showInfoDialog"
        @update:model-value="(val) => (showInfoDialog = val)"
      />
    </div>
  </div>
</template>

<script setup>
import { useGroupStore } from 'src/stores/group-store'
import { useSessionStore } from 'src/stores/sessionStore'
import { useTaskStore } from 'src/stores/taskStore'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import TaskInfoDialog from './TaskInfoDialog.vue'
const router = useRouter()
const taskStore = useTaskStore()
const sessionStore = useSessionStore()
const groupStore = useGroupStore()

const sessionOption = ref([])
const groupOption = ref([])
const showInfoDialog = ref(false)
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
  sessionId: null,
  groupID: null,
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
  state: 'draft',
})

watch(
  () => taskStore.selectedTask,
  (selected) => {
    if (selected) {
      formData.value = { ...selected }
    }
  },
  { immediate: true },
)

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

const criterionCounter = ref(1)

const addCriterion = () => {
  formData.value.gradingRubric.criteria.push({
    criterionId: criterionCounter.value,
    description: '',
    maxPoints: null,
  })
  criterionCounter.value++
}

const removeCriterion = (index) => {
  formData.value.gradingRubric.criteria.splice(index, 1)
}

const taskCounter = ref(1)

const addTask = () => {
  formData.value.tasks.push({
    taskId: taskCounter.value,
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
    membersProgress: [],
  })
  taskCounter.value++
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
const announcementCounter = ref(1)
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
const resourceCounter = ref(1)
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

const submitDropdown = ref(false)
const submitLabel = ref(taskStore.selectedTask ? 'Edit Task' : 'Create Task')

const onSubmit = async (action = 'ready') => {
  formData.value.state = action
  console.log('Form Data:', formData.value)

  if (taskStore.selectedTask) {
    await taskStore.updateTask(taskStore.selectedTask.id, formData.value)
    taskStore.selectedTask = null
    router.push({ name: 'task' })
  } else {
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
.modern-form {
  background: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 60, 60, 0.07);
  border: 1px solid #e0e0e0;
}
.modern-input .q-field__control {
  border-radius: 8px;
  background: #fff;
  box-shadow: none;
  border: 1px solid #e0e0e0;
}
.modern-input .q-field__label {
  color: #607d8b;
  font-weight: 500;
}
.modern-input .q-chip {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}
.modern-input .q-field__native {
  font-size: 15px;
}
</style>
