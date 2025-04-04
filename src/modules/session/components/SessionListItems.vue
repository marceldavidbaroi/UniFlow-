<template>
  <div class="container">
    <div class="session-wrapper" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <q-item clickable v-ripple @click="showDetails(session.id)">
        <q-item-section>
          <q-item-label class="text-bold text-h6">{{ session.sessionName }}</q-item-label>
          <div class="row items-center q-mt-sm q-px-sm">
            <!-- Info section: takes 100% minus icon space -->
            <div class="row col" style="gap: 8px">
              <div class="col-4"><b>Start:</b> {{ startDate(session.startDate) }}</div>
              <div class="col"><b>Duration:</b> {{ session.sessionLength }} Min</div>
              <div class="col" v-if="session.isEnded">
                <b class="text-red">Ended:</b> {{ formatTimestamp(session.endedAt) }}
              </div>
            </div>

            <!-- Icon section: takes minimum space, sticks to right -->
            <div class="col-auto">
              <q-icon
                name="question_answer"
                :color="session.discussionOption ? 'green' : 'red'"
                class="q-mr-sm"
              />
              <q-icon name="fiber_manual_record" :color="session.isActive ? 'green' : 'red'" />
            </div>
          </div>
        </q-item-section>
      </q-item>

      <!-- Show only on hover -->
      <div v-if="isHovered" class="row justify-end q-mr-lg">
        <div>
          <q-btn
            dense
            size="sm"
            color="dark"
            :label="session.isEnded ? 'Session Ended' : 'End Session'"
            class="q-px-xs"
            @click="showDetails(session.id)"
            :disable="session.isEnded"
          />
          <q-btn
            dense
            size="sm"
            :color="session.isActive ? 'green' : 'red'"
            :label="session.isActive ? 'Active' : 'Inactive'"
            class="q-px-xs q-mx-sm"
            @click="toggleActive(session.id, session.isActive)"
            :disable="session.isEnded"
          />
        </div>
        <div>
          <q-btn
            dense
            size="sm"
            :color="session.discussionOption ? 'green' : 'red'"
            :label="session.discussionOption ? 'Discussion' : 'No Discussion'"
            class="q-px-xs q-mx-sm"
            @click="toggleDiscussion(session.id, session.discussionOption)"
            :disable="session.isEnded"
          />
        </div>
        <div>
          <q-btn
            dense
            flat
            color="primary"
            size="sm"
            icon="share"
            class="q-px-xs"
            @click="toggleActive"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSessionStore } from 'src/stores/sessionStore'
import { ref, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { date } from 'quasar'

const sessionStore = useSessionStore()
const router = useRouter()
defineProps({
  session: Object,
})
const emit = defineEmits(['updateSessionStatus'])

const isHovered = ref(false)
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
const toggleActive = (id, isActive) => {
  sessionStore.updateSessionData(id, { isActive: !isActive })
  emit('updateSessionStatus')
}
const toggleDiscussion = (id, discussionOption) => {
  sessionStore.updateSessionData(id, { discussionOption: !discussionOption })
  emit('updateSessionStatus')
}

const showDetails = (id) => {
  router.push(`/session/${id}`)
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
}

.session-wrapper {
  width: 800px;
  background: rgba(255, 255, 255, 0.164);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.session-wrapper:hover {
  background-color: var(--brand-bl);
}
</style>
