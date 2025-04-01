<template>
  <q-page>
    <div v-if="data">
      <!-- Session Name -->
      <div class="brand_sb text-center text-h2">{{ data.sessionName }}</div>

      <!-- Buttons to Toggle Status -->
      <div class="row justify-center q-my-md">
        <div>
          <q-btn
            dense
            outline
            size="md"
            :color="data.isActive ? 'green' : 'red'"
            :label="data.isActive ? 'Active' : 'Inactive'"
            class="q-px-xs q-px-md"
            @click="toggleActive(sessionID, data.isActive)"
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
          />
        </div>
        <div>
          <q-btn dense flat color="primary" size="md" icon="share" class="q-px-xs" />
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
          <!-- Basic Info -->
          <q-tab-panel name="info">
            <div class="text-h5 brand_sb q-mb-md">Session Information</div>
            <div class="text-body1">
              <div>Total Participants: {{ data.participants.length }}</div>
              <div>Session Length {{ data.sessionLength }}</div>
              <div>Total Participants: {{ data.participants.length }}</div>
              <div>Total Material Links: {{ data.materialLinks.length }}</div>
              <div>Total Questions: {{ data.questions.length }}</div>
              <div>
                Playgronud:
                <a :href="data.playgroundLink" target="_blank">{{ data.playgroundLink }}</a>
              </div>
              <div>Description: {{ data.sessionDescription }}</div>
            </div>
          </q-tab-panel>

          <!-- Tasks -->
          <q-tab-panel name="tasks">
            <div class="text-h6">Tasks</div>
            <ul>
              <li v-for="(task, index) in data.tasks" :key="index">
                {{ task }}
              </li>
            </ul>
          </q-tab-panel>

          <!-- Material Links -->
          <q-tab-panel name="materials">
            <div class="text-h6">Material Links</div>
            <ul>
              <li v-for="(link, index) in data.materialLinks" :key="index">
                <a :href="link" target="_blank">{{ link }}</a>
              </li>
            </ul>
          </q-tab-panel>
          <!-- Participants -->
          <q-tab-panel name="participants">
            <div class="text-h6">Participants</div>
            <ul>
              <li v-for="(participant, index) in data.participants" :key="index">
                {{ participant }}
              </li>
            </ul>
          </q-tab-panel>

          <!-- Questions -->
          <q-tab-panel name="questions">
            <div class="text-h6">Questions</div>
            <ul>
              <li v-for="(question, index) in data.questions" :key="index">
                {{ question.text }}
              </li>
            </ul>
          </q-tab-panel>
          <!-- coding platform -->
          <q-tab-panel name="coding">
            <div class="text-h6">Coding Challenges</div>
            <ul>
              <li v-for="(c, index) in data.codingPlatformLinks" :key="index">
                {{ c }}
              </li>
            </ul>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>

    <!-- Loading State -->
    <div v-else class="text-center q-mt-md">
      <q-spinner color="primary" size="2em" /> Loading session details...
    </div>
  </q-page>
</template>

<script setup>
import { useSessionStore } from 'src/stores/sessionStore'
import { ref, onMounted } from 'vue'

const sessionStore = useSessionStore()
const data = ref(null)
const sessionID = window.location.pathname.split('/')[2]
const tab = ref('info') // Default tab

const toggleActive = async (id, isActive) => {
  await sessionStore.updateSessionData(id, { isActive: !isActive })
  data.value = await sessionStore.searchSessionById(sessionID)
}

const toggleDiscussion = async (id, discussionOption) => {
  await sessionStore.updateSessionData(id, { discussionOption: !discussionOption })
  data.value = await sessionStore.searchSessionById(sessionID)
}

onMounted(async () => {
  try {
    data.value = await sessionStore.searchSessionById(sessionID)
    console.log('Fetched session data:', data.value)
  } catch (error) {
    console.error('Error loading session:', error)
  }
})
</script>

<style scoped>
.q-tab-panels {
  padding: 16px;
}
</style>
