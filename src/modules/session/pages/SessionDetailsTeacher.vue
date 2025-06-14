<template>
  <q-page>
    <div v-if="data">
      <!-- Session Name -->
      <div class="brand_sb text-center text-h2 q-my-lg">
        #<span class="text-5 text-bold">{{ data.sessionID }}</span> - {{ data.sessionName }}
        <q-btn
          dense
          flat
          rounded
          size="md"
          icon="edit"
          color="primary"
          class="q-ml-md"
          @click="router.push(`/session/edit/${sessionID}`)"
        />
      </div>

      <!-- Buttons to Toggle Status -->
      <div class="row justify-center q-my-md">
        <div>
          <!-- button to end session -->
          <q-btn
            dense
            outline
            size="md"
            color="dark"
            :label="data.isEnded ? 'Session Ended' : 'End Session'"
            class="q-px-xs q-px-md q-mx-sm"
            @click="openConfirmEnd"
            :disable="data.isEnded"
          />

          <q-dialog v-model="showEndDialog" persistent>
            <q-card class="q-pa-md" style="min-width: 400px; border-radius: 8px">
              <q-card-section>
                <div class="text-h6">Confirm Session End</div>
                <div class="text-subtitle2 q-mt-sm">
                  Enter the session name
                  <span class="text-red text-bold">"{{ data.sessionName }}"</span> to confirm:
                </div>
              </q-card-section>

              <q-card-section>
                <q-input
                  v-model="confirmSessionName"
                  label="Session Name"
                  filled
                  color="secondary"
                  autofocus
                  :rules="[(val) => !!val || 'Session name is required']"
                />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="Cancel" color="secondary" v-close-popup />
                <q-btn label="Confirm" color="negative" @click="confirmEndSession" />
              </q-card-actions>
            </q-card>
          </q-dialog>
          <q-btn
            dense
            outline
            size="md"
            :color="data.isActive ? 'green' : 'red'"
            :label="data.isActive ? 'Active' : 'Inactive'"
            class="q-px-xs q-mx-sm q-px-md"
            @click="toggleActive(sessionID, data.isActive)"
            :disable="data.isEnded"
          />
        </div>
        <div>
          <q-btn
            dense
            outline
            size="md"
            :color="data.discussionOption ? 'green' : 'red'"
            :label="data.discussionOption ? 'Discussion' : 'No Discussion'"
            class="q-px-xs q-mx-sm q-px-md"
            @click="toggleDiscussion(sessionID, data.discussionOption)"
            :disable="data.isEnded"
          />
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
          <q-tab name="tasks" label="Tasks" icon="task" />
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
                flat
                separator="vertical"
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
          <q-tab-panel name="questions" class="q-pa-sm">
            <div class="text-xl font-bold text-primary mb-sm">Questions</div>
            <q-card flat bordered class="q-pa-sm bg-grey-1 shadow-md rounded-borders">
              <q-list dense separator>
                <q-item
                  v-for="(question, index) in data.questions"
                  :key="index"
                  class="hover:bg-grey-2 rounded"
                >
                  <q-item-section avatar class="text-primary"> {{ index + 1 }}. </q-item-section>
                  <q-item-section>
                    <div class="text-base">{{ question.text }}</div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
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
import { Notify } from 'quasar'
import { useSessionStore } from 'src/stores/sessionStore'
import { useUserStore } from 'src/stores/user-store'
import { ref, onMounted } from 'vue'
import { date } from 'quasar'
import ShareDialog from '../components/ShareDialog.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

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

const formatTimestamp = (ts) => {
  if (!ts?.seconds) return 'N/A'

  const dt = new Date(ts.seconds * 1000)
  return date.formatDate(dt, 'MMMM D, YYYY [at] h:mm A')
}

function startDate(input) {
  if (!input) return 'N/A'

  if (input?.seconds) {
    input = new Date(input.seconds * 1000)
  }

  const dt = new Date(input)
  if (isNaN(dt)) return 'Invalid date'

  return date.formatDate(dt, 'MMMM D, YYYY [at] h:mm A')
}

const toggleEnded = async (id) => {
  await sessionStore.endSession(id)
  data.value = await sessionStore.searchSessionById(sessionID)
}
const toggleActive = async (id, isActive) => {
  await sessionStore.updateSessionData(id, { isActive: !isActive })
  data.value = await sessionStore.searchSessionById(sessionID)
}

const toggleDiscussion = async (id, discussionOption) => {
  await sessionStore.updateSessionData(id, { discussionOption: !discussionOption })
  data.value = await sessionStore.searchSessionById(sessionID)
}
const openLink = (link) => {
  window.open(link, '_blank')
}
onMounted(async () => {
  try {
    data.value = await sessionStore.searchSessionById(sessionID)
    console.log(data)

    // Set default material link if available
    if (data.value.materialLinks.length > 0) {
      selectedMaterial.value = data.value.materialLinks[0]
      selectedCodingPlatform.value = data.value.codingPlatformLinks[0]
    }
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

const showEndDialog = ref(false)
const confirmSessionName = ref('')

const openConfirmEnd = () => {
  confirmSessionName.value = ''
  showEndDialog.value = true
}

const confirmEndSession = () => {
  const isOwner = data.value.createdBy === userStore.currentUser?.id
  const nameMatches = confirmSessionName.value === data.value.sessionName

  if (!isOwner) {
    Notify.create({
      type: 'negative',
      message: 'Only the session owner can end the session.',
    })
    return
  }

  if (!nameMatches) {
    Notify.create({
      type: 'negative',
      message: 'Session name does not match.',
    })
    return
  }

  toggleEnded(sessionID)
  showEndDialog.value = false
}

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
</script>

<style scoped>
.q-tab-panels {
  padding: 16px;
}
</style>
