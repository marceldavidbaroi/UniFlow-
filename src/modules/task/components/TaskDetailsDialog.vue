<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => emit('update:modelValue', val)"
    square
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
    class="modern-task-dialog"
  >
    <q-card class="q-pa-lg task-details-dialog modern-task-card">
      <q-bar class="bg-secondary text-white q-mb-md flex items-center modern-task-bar">
        <q-icon name="assignment" size="md" class="q-mr-md" />
        <div class="text-h6">Task Details</div>
        <q-space />
        <q-btn-dropdown
          v-if="userStore.currentRole === 'teacher'"
          :color="taskState === 'ready' ? 'light-green-4' : 'amber-2'"
          :label="taskState === 'ready' ? 'Ready' : 'Draft'"
          style="min-width: 110px; margin-right: 12px"
          flat
          dense
        >
          <q-list>
            <q-item clickable v-close-popup @click="onStateChange('draft')">
              <q-item-section class="text-warning">Draft</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="onStateChange('ready')">
              <q-item-section class="text-positive">Ready</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn
          v-if="userStore.currentRole === 'teacher'"
          flat
          color="negative"
          icon="delete"
          @click="onDeleteTask"
        />
        <q-btn
          v-if="userStore.currentRole === 'teacher'"
          flat
          color="white"
          icon="edit"
          @click="onEditTask(task)"
        />
        <q-btn dense flat icon="close" @click="$emit('update:modelValue', false)" />
      </q-bar>
      <q-card-section>
        <div class="row q-col-gutter-xl modern-task-row">
          <div class="col-12 col-md-6 modern-task-col">
            <div
              class="row q-gutter-x-lg q-mb-md"
              style="
                background: #f9f9f9;
                border-radius: 10px;
                padding: 16px 12px 8px 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
              "
            >
              <q-select
                v-model="selectedGroup"
                :options="groupOptions"
                label="Group"
                outlined
                multiple
                use-chips
                option-label="groupName"
                option-value="id"
                map-options
                emit-value
                @update:model-value="onGroupChange"
                class="q-mr-md q-mb-sm group-session-select"
                dense
                color="secondary"
                bg-color="white"
                style="min-width: 160px; max-width: 220px"
              />

              <!-- <q-select
                v-model="selectedSession"
                :options="sessionOptions"
                label="Session"
                outlined
                multiple
                use-chips
                option-label="sessionName"
                option-value="id"
                map-options
                emit-value
                @update:model-value="onSessionChange"
                class="q-mb-sm group-session-select"
                dense
                color="secondary"
                bg-color="white"
                style="min-width: 160px; max-width: 220px"
              /> -->
            </div>
            <div class="text-h5 text-primary q-mb-xs modern-task-title">{{ task?.subject }}</div>
            <div class="q-mb-md text-grey-7 text-body1 modern-task-desc">
              {{ task?.description }}
            </div>
            <div class="q-mb-sm">
              <q-chip v-if="task?.category" color="secondary" text-color="white" icon="category">
                {{ task.category.label || task.category }}
              </q-chip>
              <q-chip
                v-for="tag in task?.tags || []"
                :key="tag"
                color="primary"
                text-color="white"
                icon="label"
                class="q-mr-xs q-mb-xs"
                >{{ tag }}</q-chip
              >
            </div>
            <q-separator spaced />
            <div class="q-mt-md q-gutter-y-sm modern-task-info">
              <div>
                <q-icon name="event" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Deadline:</span> {{ formatDate(task?.deadline) }}
              </div>
              <div>
                <q-icon name="person" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Owner:</span>
                <q-badge color="info" class="q-ml-xs">{{ task?.ownerId }}</q-badge>
              </div>
              <div>
                <q-icon name="grade" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Total Marks:</span>
                <q-badge color="positive" class="q-ml-xs">{{ task?.totalMarks }}</q-badge>
              </div>
              <div>
                <q-icon name="group" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Assigned Group:</span>
                <q-chip v-if="task?.groupID" color="accent" text-color="white" icon="groups">
                  {{ task.groupID.label }}
                </q-chip>
                <span v-else class="text-grey-6">No group assigned</span>
              </div>
              <div>
                <q-icon name="label" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Session:</span>
                <q-chip v-if="task?.sessionId" color="teal" text-color="white" icon="event_note">
                  {{ task.sessionId.label }}
                </q-chip>
              </div>
              <div>
                <q-icon name="calendar_today" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Created:</span> {{ formatDate(task?.createdAt) }}
              </div>
              <div>
                <q-icon name="update" class="q-mr-xs text-grey-8" />
                <span class="text-bold">Updated:</span> {{ formatDate(task?.updatedAt) }}
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6 modern-task-col">
            <q-expansion-item
              icon="task"
              label="Tasks"
              v-if="task?.tasks && task.tasks.length"
              class="q-mb-md"
              expand-separator
            >
              <q-chip
                square
                color="secondary"
                text-color="white"
                :label="`Task count: ${task.tasks.length}`"
              />

              <q-list bordered>
                <q-item v-for="t in task.tasks" :key="t.taskId || t.taskID || t.id">
                  <q-item-section>
                    <div class="text-bold">Task #{{ t.taskId || t.taskID || t.id }}</div>
                    <div v-if="t.taskDetails">
                      <div class="text-caption">Type: {{ t.taskDetails.type }}</div>
                      <div class="text-caption">Difficulty: {{ t.taskDetails.difficulty }}</div>
                      <div class="text-caption">Points: {{ t.taskDetails.points }}</div>
                      <div class="text-caption">Time Limit: {{ t.taskDetails.timeLimit }}</div>
                      <div class="text-caption">
                        Attachments:
                        <span v-for="a in t.taskDetails.attachments || []" :key="a.description">
                          {{ a.description }}
                        </span>
                      </div>
                    </div>
                    <div v-if="t.dependencies">
                      <span class="text-caption">Dependencies: {{ t.dependencies }}</span>
                    </div>
                    <div v-if="t.learningObjectives">
                      <span class="text-caption"
                        >Learning Objectives: {{ t.learningObjectives }}</span
                      >
                    </div>
                    <div v-if="t.membersProgress && t.membersProgress.length">
                      <span class="text-caption">Members Progress:</span>
                      <ul>
                        <li v-for="mp in t.membersProgress" :key="mp.question">
                          {{ mp.question }}
                        </li>
                      </ul>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>

            <q-expansion-item
              icon="campaign"
              label="Announcements"
              v-if="task?.announcements && task.announcements.length"
              class="q-mb-md"
              expand-separator
            >
              <q-list bordered>
                <q-item v-for="a in task.announcements" :key="a.announcementId">
                  <q-item-section>
                    <div class="text-bold">{{ a.title }}</div>
                    <div class="text-caption">By: {{ a.authorId }} | {{ a.createdAt }}</div>
                    <div>{{ a.content }}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-expansion-item
              icon="attach_file"
              label="Resources"
              v-if="task?.resources && task.resources.length"
              class="q-mb-md"
              expand-separator
            >
              <q-list bordered>
                <q-item v-for="r in task.resources" :key="r.resourceId">
                  <q-item-section>
                    <div class="text-bold">{{ r.title }}</div>
                    <div class="text-caption">Type: {{ r.type }}</div>
                    <q-btn
                      v-if="r.url"
                      flat
                      color="primary"
                      :label="'Open Resource'"
                      :href="r.url"
                      target="_blank"
                      size="sm"
                    />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-expansion-item
              icon="grading"
              label="Grading Rubric"
              v-if="
                task?.gradingRubric &&
                task.gradingRubric.criteria &&
                task.gradingRubric.criteria.length
              "
              class="q-mb-md"
              expand-separator
            >
              <q-list bordered>
                <q-item v-for="c in task.gradingRubric.criteria" :key="c.criterionId">
                  <q-item-section>
                    <div class="text-bold">{{ c.description }}</div>
                    <div class="text-caption">Max Points: {{ c.maxPoints }}</div>
                    <div class="text-caption">Notes: {{ c.notes }}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-expansion-item
              icon="settings"
              label="Settings"
              v-if="task?.settings"
              class="q-mb-md"
              expand-separator
            >
              <q-list bordered>
                <q-item>
                  <q-item-section>
                    <div>Grading Scheme: {{ task.settings.gradingScheme }}</div>
                    <div>Submission Type: {{ task.settings.submissionType }}</div>
                    <div>Late Submission Penalty: {{ task.settings.lateSubmissionPenalty }}</div>
                    <div>
                      Allow Late Submissions:
                      {{ task.settings.allowLateSubmissions ? 'Yes' : 'No' }}
                    </div>
                  </q-item-section>
                </q-item>
                <q-item v-if="task.settings.reviewSettings">
                  <q-item-section>
                    <div>
                      Instructor Review:
                      {{ task.settings.reviewSettings.instructorReview ? 'Yes' : 'No' }}
                    </div>
                    <div>
                      Peer Review: {{ task.settings.reviewSettings.peerReview ? 'Yes' : 'No' }}
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useTaskStore } from 'src/stores/taskStore'
import { useUserStore } from 'src/stores/user-store'
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const taskStore = useTaskStore()
const userStore = useUserStore()

const props = defineProps({
  modelValue: Boolean,
  task: Object,
  groupOptions: {
    type: Array,
    default: () => [],
  },
  sessionOptions: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'delete-task', 'edit'])
const taskState = ref(props.task?.state || 'draft')
const selectedGroup = ref()
const selectedSession = ref()

watch(
  () => props.task,
  (task) => {
    selectedGroup.value = task?.groupID
    selectedSession.value = task?.sessionId
  },
  { immediate: true },
)

function onGroupChange(val) {
  emit('edit', { ...props.task, groupID: val })
}
// function onSessionChange(val) {
//   emit('edit', { ...props.task, sessionId: val })
// }

watch(
  () => props.task?.state,
  (val) => {
    if (val) taskState.value = val
  },
)

const onStateChange = (val) => {
  taskState.value = val
  emit('edit', { ...props.task, state: val })
}

const onEditTask = () => {
  taskStore.selectedTask = props.task
  router.push({ name: 'task-add' })
}

const onDeleteTask = () => {
  emit('delete-task', props.task?.id)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.task-details-dialog.modern-task-card {
  max-width: 100vw;
  width: 100vw;
  min-width: 320px;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  background: #fff;
  margin: 0 auto;
}
.modern-task_dialog .q_dialog__inner {
  align-items: flex-start !important;
  justify-content: center !important;
}
.modern-task-row {
  flex-wrap: wrap;
  align-items: flex-start;
}
.modern-task-col {
  min-width: 320px;
  max-width: 100vw;
}
.modern-task-title {
  font-weight: 700;
  letter-spacing: 0.5px;
  font-size: 1.5rem;
}
.modern-task-desc {
  font-size: 1.1rem;
}
.modern-task-info > div {
  margin-bottom: 8px;
}
.q-chip {
  font-size: 13px;
  font-weight: 500;
}
.q-expansion-item {
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 8px;
}
.q-list {
  background: #fff;
  border-radius: 8px;
}
.q-bar.modern-task-bar {
  border-radius: 12px 12px 0 0;
  min-height: 56px;
}
.group-session-select .q-field__control {
  border-radius: 8px;
  background: #fff;
  box-shadow: none;
}
.group-session-select .q-field__label {
  color: #607d8b;
  font-weight: 500;
}
.group-session-select .q-chip {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}
@media (max-width: 900px) {
  .task-details-dialog.modern-task-card {
    max-width: 98vw;
    width: 98vw;
    padding: 0.5rem;
  }
  .modern-task-col {
    min-width: 0;
    width: 100%;
  }
}
</style>
