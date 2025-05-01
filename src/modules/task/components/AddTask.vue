<template>
  <div class="row justify-center q-pa-lg">
    <div class="col-xs-12 col-sm-8 col-md-6">
      <q-form @submit="onSubmit" class="q-gutter-md q-pa-md rounded-borders">
        <div class="row q-col-gutter-md">
          <!-- <q-input v-model="formData.taskID" label="Task ID" outlined class="col-xs-12 col-sm-6" /> -->
          <q-input
            v-model="formData.sessionId"
            label="Session ID"
            outlined
            class="col-xs-12 col-sm-6"
          />
          <q-input
            v-model="formData.groupID"
            label="Group ID"
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
          <q-input
            v-model="formData.category"
            label="Category"
            outlined
            class="col-xs-12 col-sm-6"
          />
          <div class="col-xs-12">
            <label class="text-weight-medium q-mb-sm text-grey-8">Tags</label>
            <div class="row items-center q-gutter-sm">
              <q-input
                v-model="newTag"
                placeholder="Add tag and press Enter"
                outlined
                dense
                @keyup.enter="addTag"
                class="col"
              />
              <q-chip
                v-for="(tag, index) in formData.tags"
                :key="index"
                closable
                @close="removeTag(index)"
                color="primary"
                text-color="white"
              >
                {{ tag }}
              </q-chip>
            </div>
          </div>
          <q-input
            v-model="formData.deadline"
            type="datetime"
            label="Deadline"
            outlined
            class="col-xs-12 col-sm-6"
          />
          <q-input
            v-model="formData.totalMarks"
            type="number"
            label="Total Marks"
            outlined
            class="col-xs-12 col-sm-6"
          />
        </div>
        <q-expansion-item label="Grading Rubric" icon="rule" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <div
                v-for="(criterion, index) in formData.gradingRubric.criteria"
                :key="criterion.criterionId || index"
                class="row q-col-gutter-md items-end"
              >
                <q-input
                  v-model="criterion.criterionId"
                  label="Criterion ID"
                  outlined
                  class="col-xs-12 col-sm-6"
                />
                <q-input
                  v-model="criterion.description"
                  label="Description"
                  outlined
                  class="col-xs-12 col-sm-8"
                />
                <q-input
                  v-model="criterion.maxPoints"
                  type="number"
                  label="Max Points"
                  outlined
                  class="col-xs-12 col-sm-4"
                />
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
              <div class="q-mt-md">
                <q-btn label="Add Criterion" @click="addCriterion" color="primary" />
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
        <q-expansion-item label="Tasks" icon="list_alt" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <div
                v-for="(task, index) in formData.tasks"
                :key="task.taskId || index"
                class="q-mb-md bordered rounded-borders"
              >
                <div class="q-pa-md">
                  <div class="row q-col-gutter-md">
                    <q-input
                      v-model="task.taskId"
                      label="Task ID"
                      outlined
                      class="col-xs-12 col-sm-6"
                    />
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
                        color="primary"
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
                    <q-btn icon="delete" color="negative" @click="removeTask(index)" />
                  </div>
                </div>
              </div>
              <q-btn label="Add Task" @click="addTask" color="primary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Settings" icon="settings" class="q-mt-md">
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
        <q-expansion-item label="Announcements" icon="campaign" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <div
                v-for="(announcement, index) in formData.announcements"
                :key="announcement.announcementId || index"
                class="q-mb-md bordered rounded-borders"
              >
                <div class="q-pa-md row q-col-gutter-md items-end">
                  <q-input
                    v-model="announcement.announcementId"
                    label="Announcement ID"
                    outlined
                    class="col-xs-12 col-sm-6"
                  />
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
                  <q-btn
                    icon="delete"
                    color="negative"
                    @click="removeAnnouncement(index)"
                    size="sm"
                    flat
                    round
                    dense
                    class="col-auto"
                  />
                </div>
              </div>
              <q-btn label="Add Announcement" @click="addAnnouncement" color="primary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-expansion-item label="Resources" icon="folder" class="q-mt-md">
          <q-card>
            <q-card-section class="q-gutter-md">
              <div
                v-for="(resource, index) in formData.resources"
                :key="resource.resourceId || index"
                class="row q-col-gutter-md items-end q-mb-sm"
              >
                <q-input
                  v-model="resource.resourceId"
                  label="Resource ID"
                  outlined
                  class="col-xs-12 col-sm-4"
                />
                <q-input
                  v-model="resource.title"
                  label="Title"
                  outlined
                  class="col-xs-12 col-sm-4"
                />
                <q-input v-model="resource.url" label="URL" outlined class="col-xs-12 col-sm-4" />
                <q-input v-model="resource.type" label="Type" outlined class="col-xs-12 col-sm-4" />
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
              <q-btn label="Add Resource" @click="addResource" color="primary" />
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <div class="row q-col-gutter-md q-mt-md">
          <!-- <q-input
            v-model="formData.createdAt"
            type="datetime"
            label="Created At"
            outlined
            class="col-xs-12 col-sm-6"
          />
          <q-input
            v-model="formData.updatedAt"
            type="datetime"
            label="Updated At"
            outlined
            class="col-xs-12 col-sm-6"
          /> -->
        </div>
        <q-btn label="Create Task" type="submit" color="primary" class="full-width q-mt-md" />
      </q-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
})

const newTag = ref('')

const addTag = () => {
  if (newTag.value.trim() !== '') {
    formData.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index) => {
  formData.value.tags.splice(index, 1)
}

const addCriterion = () => {
  formData.value.gradingRubric.criteria.push({
    criterionId: '',
    description: '',
    maxPoints: null,
  })
}

const removeCriterion = (index) => {
  formData.value.gradingRubric.criteria.splice(index, 1)
}

const addTask = () => {
  formData.value.tasks.push({
    taskId: '',
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

const addAnnouncement = () => {
  formData.value.announcements.push({
    announcementId: '',
    title: '',
    content: '',
    createdAt: '',
    authorId: '',
  })
}

const removeAnnouncement = (index) => {
  formData.value.announcements.splice(index, 1)
}

const addResource = () => {
  formData.value.resources.push({
    resourceId: '',
    title: '',
    url: '',
    type: '',
  })
}

const removeResource = (index) => {
  formData.value.resources.splice(index, 1)
}

const onSubmit = () => {
  console.log('Form Data:', formData.value)
  // Here you would typically send the formData to your backend
}
</script>

<style scoped>
.bordered {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
