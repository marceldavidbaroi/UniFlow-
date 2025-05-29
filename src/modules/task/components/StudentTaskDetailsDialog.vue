<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    persistent
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="q-pa-lg student-task-dialog">
      <q-bar class="bg-secondary text-white q-mb-md flex items-center">
        <q-icon name="assignment" size="md" class="q-mr-md" />
        <div class="text-h6">Task Details</div>
        <q-space />
        <q-btn dense flat icon="close" @click="$emit('update:modelValue', false)" />
      </q-bar>
      <q-card-section>
        <div class="text-h5 text-primary q-mb-xs">{{ taskSubject }}</div>
        <div class="q-mb-md text-grey-7 text-body1">{{ taskDescription }}</div>
        <q-chip v-if="taskCategory" color="secondary" text-color="white" icon="category">
          {{ taskCategory }}
        </q-chip>
        <div class="q-mt-md q-gutter-y-sm">
          <div>
            <q-icon name="event" class="q-mr-xs text-grey-8" />
            <span class="text-bold">Deadline:</span> {{ formatDate(task?.deadline) }}
          </div>
          <div>
            <q-icon name="grade" class="q-mr-xs text-grey-8" />
            <span class="text-bold">Total Marks:</span>
            <q-badge color="positive" class="q-ml-xs">{{ task?.totalMarks }}</q-badge>
          </div>
          <div>
            <q-icon name="group" class="q-mr-xs text-grey-8" />
            <span class="text-bold">Assigned Group:</span>
            <q-chip v-if="taskGroup" color="accent" text-color="white" icon="groups">
              {{ taskGroup }}
            </q-chip>
            <span v-else class="text-grey-6">No group assigned</span>
          </div>
          <div>
            <q-icon name="label" class="q-mr-xs text-grey-8" />
            <span class="text-bold">Session:</span>
            <q-chip v-if="taskSession" color="teal" text-color="white" icon="event_note">
              {{ taskSession }}
            </q-chip>
            <span v-else class="text-grey-6">No session assigned</span>
          </div>
        </div>
        <q-separator class="q-my-md" />
        <div class="q-mt-md">
          <q-btn
            color="secondary"
            label="Submit / Edit Submission"
            icon="send"
            @click="goToSubmission"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  task: {
    type: Object,
    default: () => ({}),
  },
})
const router = useRouter()

const taskSubject = computed(() => props.task?.subject || 'No subject')
const taskDescription = computed(() => props.task?.description || 'No description')
const taskCategory = computed(() => {
  const cat = props.task?.category
  if (!cat) return null
  return typeof cat === 'object' ? cat.label || '' : cat
})
const taskGroup = computed(() => {
  const group = props.task?.groupID
  if (!group) return null
  return typeof group === 'object' ? group.label || '' : group
})
const taskSession = computed(() => {
  const session = props.task?.sessionId
  if (!session) return null
  return typeof session === 'object' ? session.label || '' : session
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date)) return dateStr
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function goToSubmission() {
  router.push({ name: 'task-submit', params: { taskId: props.task.id || props.task.taskID } })
}
</script>

<style scoped>
.student-task-dialog {
  max-width: 500px;
  width: 98vw;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  background: #fff;
  margin: 0 auto;
}
</style>
