<template>
  <q-page>
    <div v-if="data">
      <!-- Session Name -->
      <div class="brand_sb text-center text-h2 q-my-lg">
        #<span class="text-5 text-bold">{{ data.sessionID }}</span> - {{ data.sessionName }}
      </div>

      <!-- Buttons to Toggle Status -->
      <div class="row justify-center q-my-md">
        <div>
          <!-- button to end session -->
          <!-- If session is ended, show only this --><!-- If session is ended -->
          <q-chip
            v-if="data.isEnded"
            outline
            square
            color="red"
            text-color="white"
            icon="event_busy"
          >
            Session Ended
          </q-chip>

          <!-- If not ended -->
          <template v-else>
            <!-- Ongoing or Not Started -->
            <q-chip
              outline
              square
              :color="data.isActive ? 'teal' : 'orange'"
              text-color="white"
              :icon="data.isActive ? 'play_circle' : 'pause_circle'"
            >
              {{ data.isActive ? 'Ongoing' : 'Not Started' }}
            </q-chip>

            <!-- Discussion status (only when active) -->
            <q-chip
              v-if="data.isActive"
              outline
              square
              :color="data.discussionOption ? 'blue' : 'light-blue'"
              text-color="white"
              :icon="data.discussionOption ? 'forum' : 'chat_bubble_outline'"
            >
              {{ data.discussionOption ? 'Discussion Open' : 'Discussion Closed' }}
            </q-chip>
          </template>
        </div>
        <div>
          <q-btn
            dense
            flat
            color="primary"
            size="md"
            icon="share"
            class="q-px-xs"
            @click="showSharePopup = true"
          />
          <ShareDialog v-model="showSharePopup" :link="shareLink" />
        </div>
      </div>

      <!-- Tabs Section -->
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-secondary">
          <q-tab name="info" label="Basic Info" icon="info" />
          <q-tab name="materials" label="Material Links" icon="article" />
          <q-tab name="questions" label="Questions" icon="quiz" />
          <q-tab name="coding" label="Coding Challenges " icon="code" />
          <!-- <q-tab name="tasks" label="Tasks" icon="task" /> -->
          <q-tab name="participants" label="Participants" icon="group" />
        </q-tabs>

        <q-tab-panels v-model="tab">
          <q-tab-panel name="info">
            <!-- <div class="text-h5 brand_sb q-mb-md">Session Information</div> -->

            <div class="flex flex-center q-mt-lg" style="width: 100%">
              <q-table
                :rows="[
                  { label: 'Session Length', value: data.sessionLength },
                  {
                    label: 'Total Participants',
                    value: data.participants ? data.participants.length : 0,
                  },
                  {
                    label: 'Total Material Links',
                    value: data.materialLinks ? data.materialLinks.length : 0,
                  },
                  { label: 'Total Questions', value: data.questions ? data.questions.length : 0 },
                  { label: 'Playground', value: data.playgroundLink || 'N/A' },
                  { label: 'Description', value: data.sessionDescription || 'N/A' },
                  { label: 'Start Date', value: startDate(data.sessionDate) || 'N/A' },
                  ...(data?.endedAt
                    ? [{ label: 'End Date', value: formatTimestamp(data.endedAt) }]
                    : []),
                ]"
                :columns="[
                  {
                    name: 'label',
                    label: 'Item',
                    field: 'label',
                    align: 'left',
                    style: 'font-weight: 500;',
                  },
                  { name: 'value', label: 'Value', field: 'value', align: 'left' },
                ]"
                row-key="label"
                bordered
                flat
                hide-bottom
                class="text-body1"
                style="width: 800px"
                :pagination="{ rowsPerPage: 0 }"
                :style="{ 'word-break': 'break-word', 'border-radius': '8px', overflow: 'hidden' }"
              >
                <!-- Playground Link Fix (Prevents Raw HTML Injection) -->
                <template v-slot:body-cell-value="{ row }">
                  <q-td>
                    <template v-if="row.label === 'Playground' && data.playgroundLink">
                      <a :href="data.playgroundLink" target="_blank" class="text-primary">
                        {{ data.playgroundLink }}
                      </a>
                    </template>
                    <template v-else>
                      {{ row.value }}
                    </template>
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <!-- Tasks -->
          <q-tab-panel name="tasks" class="q-pa-md">
            <div class="text-h5 text-weight-bold text-primary q-mb-md">My Tasks</div>
            <q-list separator>
              <q-item
                v-for="(task, index) in data.tasks"
                :key="index"
                clickable
                v-ripple
                @click="task.expanded = !task.expanded"
              >
                <q-item-section>
                  <q-item-label class="text-body1 text-weight-medium">{{
                    task.title
                  }}</q-item-label>
                  <q-item-label v-if="task.expanded" class="q-mt-sm text-body1">{{
                    task.description
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon :name="task.expanded ? 'expand_less' : 'expand_more'" color="grey-5" />
                </q-item-section>
              </q-item>
            </q-list>
            <div v-if="data.tasks.length === 0" class="text-grey-6 q-mt-md text-center">
              No tasks available.
            </div>
          </q-tab-panel>

          <!-- Material Links -->
          <q-tab-panel name="materials">
            <div class="text-h6">Material Links</div>

            <q-splitter v-model="splitterModel" unit="px">
              <!-- Left Panel: Material Links -->
              <template v-slot:before>
                <div class="q-pa-md" v-if="data.materialLinks.length > 0">
                  <div
                    v-for="(link, index) in data.materialLinks"
                    :key="index"
                    class="q-ma-sm row items-center"
                  >
                    <div class="col-auto q-gutter-sm">
                      <q-btn
                        color="primary"
                        :label="`Preview ${index + 1}`"
                        @click="selectedMaterial = link"
                      />
                      <q-btn
                        color="secondary"
                        :label="`Open ${index + 1}`"
                        @click="openLink(link)"
                      />
                    </div>
                  </div>
                </div>
                <div v-else class="text-grey-6 text-bod-1 q-mt-md">
                  There is no taks for this session
                </div>
              </template>

              <!-- Splitter Handle -->
              <template v-slot:separator>
                <q-separator vertical />
              </template>

              <!-- Right Panel: Iframe -->
              <template v-slot:after>
                <q-responsive :ratio="16 / 9">
                  <iframe
                    :src="selectedMaterial"
                    frameborder="0"
                    allowfullscreen
                    style="width: 100%; height: 100%"
                  ></iframe>
                </q-responsive>
              </template>
            </q-splitter>
          </q-tab-panel>
          <!-- Participants -->
          <q-tab-panel name="participants" class="q-pa-md">
            <div class="text-h5 text-weight-bold text-primary q-mb-md">Participants</div>
            <q-list bordered separator>
              <q-item
                v-for="(participant, index) in data.participants"
                :key="index"
                clickable
                v-ripple
              >
                <q-item-section>
                  <q-item-label
                    >{{ getUserName(participant).personId }} -
                    {{ getUserName(participant).name }}&nbsp;[{{
                      getUserName(participant).faculty?.label
                    }}]</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-icon name="person" color="grey-5" size="sm" />
                </q-item-section>
              </q-item>
              <q-item v-if="!data.participants || data.participants.length === 0">
                <q-item-section class="text-grey-6 text-italic">
                  No participants yet.
                </q-item-section>
              </q-item>
            </q-list>
          </q-tab-panel>

          <!-- Questions -->
          <!-- <q-tab-panel name="questions">
            <div class="text-h6">Questions</div>
            <ul>
              <li v-for="(question, index) in data.questions" :key="index">
                {{ question.text }}
              </li>
            </ul>
          </q-tab-panel> -->

          <q-tab-panel name="questions">
            <div v-if="!isQAFinished && data.isActive">
              <div class="text-h5 q-mb-md">Questions</div>
              <div v-for="(question, index) in data.questions" :key="question.qno" class="q-mb-md">
                <q-card class="q-pa-md no-shadow bordered">
                  <div class="row items-start justify-between q-mb-sm">
                    <div class="col">
                      <div class="text-subtitle1 q-mb-xs">
                        <span class="text-primary">Q{{ question.qno }}:</span> {{ question.text }}
                      </div>
                      <div class="text-caption text-weight-medium">
                        Marks: <span class="text-bold">{{ question.marks }}</span>
                      </div>
                      <div
                        class="text-caption"
                        :class="question.isSubmitted ? 'text-positive' : 'text-grey'"
                      >
                        {{ question.isSubmitted ? 'Answered' : 'Not Answered' }}
                      </div>
                    </div>
                    <q-btn
                      flat
                      icon="edit_note"
                      color="primary"
                      size="md"
                      @click="toggleAnswerInput(index)"
                      class="q-ml-sm"
                    />
                  </div>
                  <!-- Answer Editor -->
                  <q-slide-transition>
                    <div v-show="activeAnswerIndex === index" class="q-mt-sm">
                      <q-editor
                        v-model="question.answer"
                        :toolbar="[
                          ['bold', 'italic', 'underline'],
                          ['unordered', 'ordered'],
                          ['link'],
                        ]"
                        min-height="100px"
                        class="bg-grey-1 q-pa-sm rounded-borders"
                        @blur="markAsSubmitted(index)"
                      />
                    </div>
                  </q-slide-transition>
                </q-card>
              </div>
              <!-- Finish Button -->
              <div class="q-mt-xl flex justify-center">
                <q-btn
                  label="Finish"
                  color="primary"
                  icon="task_alt"
                  @click="confirmFinish = true"
                  class="q-px-xl"
                />
              </div>
              <!-- Confirmation Dialog -->
              <q-dialog v-model="confirmFinish">
                <q-card class="q-pa-md">
                  <q-card-section class="row items-center">
                    <q-icon name="warning" color="warning" size="md" class="q-mr-sm" />
                    <div class="text-h6">Confirm Finish</div>
                  </q-card-section>
                  <q-card-section>
                    Are you sure you want to finish answering the questions? You won't be able to
                    edit them afterward.
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Yes, Submit" color="primary" @click="submitAnswers" />
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
            <div v-else class="text-center text-body1 q-pa-md q-mt-md">
              <div v-if="!data.isActive">
                <strong>The session hasn’t started yet.</strong><br />
                Please wait for the host to begin the session.
              </div>
              <div v-else>
                <strong>You’ve completed your exam.</strong><br />
                Thank you for participating!
              </div>
            </div>
          </q-tab-panel>

          <!-- coding platform -->
          <q-tab-panel name="coding">
            <div class="text-h6">Coding Challenges</div>

            <q-splitter v-model="splitterModel" unit="px">
              <!-- Left Panel: Material Links -->
              <template v-slot:before>
                <div class="q-pa-md">
                  <div
                    v-for="(link, index) in data.codingPlatformLinks"
                    :key="index"
                    class="q-ma-sm row items-center"
                  >
                    <div class="col-auto q-gutter-sm">
                      <q-btn
                        color="primary"
                        :label="`Preview ${index + 1}`"
                        @click="selectedCodingPlatform = link"
                      />
                      <q-btn
                        color="secondary"
                        :label="`Open ${index + 1}`"
                        @click="openLink(link)"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <!-- Splitter Handle -->
              <template v-slot:separator>
                <q-separator vertical />
              </template>

              <!-- Right Panel: Iframe -->
              <template v-slot:after>
                <q-responsive :ratio="16 / 9">
                  <iframe
                    :src="selectedCodingPlatform"
                    frameborder="0"
                    allowfullscreen
                    style="width: 100%; height: 100%"
                  ></iframe>
                </q-responsive>
              </template>
            </q-splitter>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- Loading State -->
    <div v-else class="flex flex-center q-mt-md" style="height: 100vh">
      <div class="text-center">
        <q-spinner-grid color="secondary" size="50px" />
        <div>Loading session details...</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useSessionStore } from 'src/stores/sessionStore'
import { useUserStore } from 'src/stores/user-store'
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import { Notify } from 'quasar' // Assuming you are using Quasar Framework for Notify
import ShareDialog from '../components/ShareDialog.vue'

const sessionStore = useSessionStore()
const userStore = useUserStore()

const showSharePopup = ref(false)
const shareLink = ref('')
const baseUrl = ref('')

const data = ref(null)
const sessionID = window.location.pathname.split('/')[3]
const tab = ref('info') // Default tab
const splitterModel = ref(300) // Initial width of left panel
const selectedMaterial = ref()
const selectedCodingPlatform = ref()
const isQAFinished = ref(false)

const formatTimestamp = (ts) => {
  if (!ts?.seconds) return 'N/A'

  const dt = new Date(ts.seconds * 1000)
  return date.formatDate(dt, 'MMMM D, YYYY [at] h:mm A')
}

const startDate = (input) => {
  if (!input) return 'N/A'

  if (input?.seconds) {
    input = new Date(input.seconds * 1000)
  }

  const dt = new Date(input)
  if (isNaN(dt)) return 'Invalid date'

  return date.formatDate(dt, 'MMMM D, YYYY [at] h:mm A')
}

const openLink = (link) => {
  window.open(link, '_blank')
}

const participantsResponded = ref()
const incomingQuestions = ref()
onMounted(async () => {
  try {
    data.value = await sessionStore.searchSessionById(sessionID)
    participantsResponded.value =
      (await sessionStore.getParticipantsResponded(sessionID)).data || {}
    console.log(participantsResponded.value)

    isQAFinished.value = hasUserParticipated(participantsResponded.value, userStore.currentUser?.id)

    if (data.value.materialLinks.length > 0) {
      selectedMaterial.value = data.value.materialLinks[0]
      selectedCodingPlatform.value = data.value.codingPlatformLinks[0]
    }

    incomingQuestions.value = data.value.questions || []
    console.log('incomingQuestions.value', incomingQuestions.value)
  } catch (error) {
    console.error('Error loading session:', error)
  }
  baseUrl.value = window.location.origin

  if (sessionID) {
    shareLink.value = `Join #${data.value.sessionID} session on '${data.value.sessionName}'\n\n${baseUrl.value}/session/join/${sessionID}`
  } else {
    shareLink.value = 'invalid link'
  }
})

const userDetails = ref({})

const getUserName = (id) => {
  if (!userDetails.value[id]) {
    userStore
      .getUserDetails(id)
      .then((user) => {
        userDetails.value[id] = user
      })
      .catch(() => {
        userDetails.value[id] = 'Unknown'
      })
    return 'Loading...'
  }
  return userDetails.value[id]
}

const activeAnswerIndex = ref(null)
const confirmFinish = ref(false)

onMounted(() => {
  if (incomingQuestions.value && Array.isArray(incomingQuestions.value)) {
    data.value.questions = incomingQuestions.value.map((q) => ({
      ...q,
      answer: '',
      isSubmitted: false,
    }))
  }
})

const hasUserParticipated = (participantsResponded, userId) => {
  if (!participantsResponded?.questionResponses) return false
  return participantsResponded.questionResponses.includes(userId)
}

const toggleAnswerInput = (index) => {
  activeAnswerIndex.value = activeAnswerIndex.value === index ? null : index
}

const markAsSubmitted = (index) => {
  const raw = data.value.questions[index].answer || ''
  const cleanText = raw.replace(/<[^>]*>/g, '').trim()
  data.value.questions[index].isSubmitted = cleanText.length > 0
}

const submitAnswers = async () => {
  confirmFinish.value = false
  isQAFinished.value = true

  try {
    const submission = data.value.questions.map((q) => ({
      qno: q.qno,
      answer: q.answer,
      obtainedMarks: 0,
    }))

    const response = await sessionStore.addQuestionResponse(sessionID, submission)

    if (response && response.success) {
      Notify.create({
        type: 'positive',
        message: response.message || 'Answers submitted successfully!',
        position: 'top', // You can adjust the position
        timeout: 3000, // Adjust the duration as needed
      })
      console.log('Answers submitted successfully:', response.message)
      // Optionally, perform other actions after successful submission
    } else {
      Notify.create({
        type: 'negative',
        message: response?.message || 'Failed to submit answers.',
        position: 'top',
        timeout: 5000,
      })
      console.error('Error submitting answers:', response?.error || 'Unknown error')
    }
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: 'An unexpected error occurred during submission.',
      position: 'top',
      timeout: 5000,
    })
    console.error('Error submitting answers:', error)
    // Handle the error appropriately, such as displaying a more detailed error message to the user if needed.
  }
}
</script>

<style scoped>
.q-tab-panels {
  padding: 16px;
}
</style>
