<template>
  <q-page padding>
    <div class="brand_sb text-center text-h3 q-my-lg">Create Session</div>
    <q-form @submit="handleSubmit" class="q-gutter-md">
      <!-- Tabs -->
      <q-tabs v-model="activeTab" class="text-primary" dense>
        <q-tab name="session" label="Session Info" />
        <q-tab name="questions" label="Questions" />
        <q-tab name="materials" label="Materials" />
        <q-tab name="video" label="Video Links" />
        <q-tab name="coding" label="Coding Links" />
        <q-tab name="tasks" label="Tasks" />
      </q-tabs>

      <q-separator class="q-my-md" />

      <!-- Tab Panels -->
      <q-tab-panels v-model="activeTab">
        <!-- Session Info -->
        <q-tab-panel name="session" class="q-gutter-md">
          <q-input
            v-model="sessionName"
            label="Session Name"
            filled
            :rules="[(val) => !!val || 'Session Name is required']"
            required
          />
          <q-input
            v-model="sessionLength"
            label="Session Length (in minutes)"
            type="number"
            filled
            :rules="[(val) => val > 0 || 'Session Length must be greater than 0']"
            required
          />
          <q-editor
            v-model="sessionDescription"
            label="Session Description"
            filled
            rows="4"
            :rules="[(val) => !!val || 'Session Description is required']"
            required
            class="q-mb-lg"
          />

          <q-input
            v-model="playgroundLink"
            label="Real-time Playground Link (URL)"
            filled
            type="url"
          />

          <q-input filled v-model="sessionDate">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="sessionDate" mask="YYYY-MM-DD HH:mm">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="sessionDate" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-toggle
            v-model="discussionOption"
            label="Allow Discussion"
            class="q-mb-md"
            :true-value="true"
            :false-value="false"
          />
        </q-tab-panel>

        <!-- Questions -->
        <q-tab-panel name="questions">
          <div class="q-mb-md">
            <div v-for="(question, index) in questions" :key="index" class="q-mb-sm">
              <div class="text-h6">Question {{ index + 1 }}</div>
              <q-editor
                v-model="questions[index].text"
                label="Question"
                filled
                :rules="[(val) => !!val || 'Question is required']"
                required
              />
              <q-btn
                color="negative"
                icon="delete"
                label="Remove"
                flat
                @click="removeQuestion(index)"
                class="q-mt-sm"
              />
            </div>
            <div class="row justify-between">
              Total questions: {{ questions.length }}
              <q-btn label="Add Question" color="primary" @click="addQuestion" />
            </div>
          </div>
        </q-tab-panel>

        <!-- Material Links -->
        <q-tab-panel name="materials">
          <div v-for="(link, index) in materialLinks" :key="index" class="q-mb-sm">
            <q-input v-model="materialLinks[index]" label="Material Link (URL)" filled type="url" />
            <q-btn
              color="negative"
              icon="delete"
              label="Remove"
              flat
              @click="removeLink('materialLinks', index)"
              class="q-mt-sm"
            />
          </div>
          <div class="row justify-between">
            Total materials: {{ materialLinks.length }}
            <q-btn label="Add Material Link" color="primary" @click="addMaterialLink" />
          </div>
        </q-tab-panel>

        <!-- Video Links -->
        <q-tab-panel name="video">
          <div v-for="(link, index) in videoLink" :key="index" class="q-mb-sm">
            <q-input
              v-model="videoLink[index]"
              label="Video Website Link (URL)"
              filled
              type="url"
            />
            <q-btn
              color="negative"
              icon="delete"
              label="Remove"
              flat
              @click="removeLink('videoLink', index)"
              class="q-mt-sm"
            />
          </div>
          <div class="row justify-between">
            Total: {{ videoLink.length }}
            <q-btn label="Add Video Link" color="primary" @click="addVideoLink" />
          </div>
        </q-tab-panel>

        <!-- Coding Platform Links -->
        <q-tab-panel name="coding">
          <div v-for="(link, index) in codingPlatformLinks" :key="index" class="q-mb-sm">
            <q-input
              v-model="codingPlatformLinks[index]"
              label="Coding Platform Link (URL)"
              filled
              type="url"
            />
            <q-btn
              color="negative"
              icon="delete"
              label="Remove"
              flat
              @click="removeLink('codingPlatformLinks', index)"
              class="q-mt-sm"
            />
          </div>
          <div class="row justify-between">
            Total: {{ codingPlatformLinks.length }}
            <q-btn
              label="Add Coding Platform Link"
              color="primary"
              @click="addCodingPlatformLink"
            />
          </div>
        </q-tab-panel>

        <!-- Tasks -->
        <q-tab-panel name="tasks">
          <div v-for="(task, index) in tasks" :key="index" class="q-mb-sm">
            <div class="text-h6">Task {{ index + 1 }}</div>
            <q-editor
              v-model="tasks[index].description"
              label="Task Description"
              filled
              :rules="[(val) => !!val || 'Task description is required']"
              required
            />
            <q-btn
              color="negative"
              icon="delete"
              label="Remove"
              flat
              @click="removeTask(index)"
              class="q-mt-sm"
            />
          </div>
          <div class="row justify-between">
            Total: {{ tasks.length }}
            <q-btn label="Add Task" color="primary" @click="addTask" class="q-mb-sm" />
          </div>
        </q-tab-panel>
      </q-tab-panels>

      <!-- Submit -->
      <div class="flex justify-center">
        <q-btn
          label="Create Session"
          color="primary"
          type="submit"
          class="q-px-xl q-my-lg"
          :loading="isLoading"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useSessionStore } from 'src/stores/sessionStore'
import { useUserStore } from 'src/stores/user-store'

import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
const sesstionStore = useSessionStore()
const userStore = useUserStore()

const activeTab = ref('session')

// Form data
const sessionName = ref('')
const sessionLength = ref('')
const sessionDescription = ref('')
const playgroundLink = ref('')
const sessionDate = ref('')
const discussionOption = ref(true) // default to true (allow discussion)

// Links arrays
const materialLinks = ref([''])
const codingPlatformLinks = ref([''])
const videoLink = ref([''])

// Questions Array
const questions = ref([{ text: '' }])

// Tasks Array
const tasks = ref([])

// Add Question Function
const addQuestion = () => {
  questions.value.push({ text: '' })
}

// Add Material Link Function
const addMaterialLink = () => {
  materialLinks.value.push('')
}

// Add Coding Platform Link Function
const addCodingPlatformLink = () => {
  codingPlatformLinks.value.push('')
}

const addVideoLink = () => {
  videoLink.value.push('')
}

// Add Task Function
const addTask = () => {
  tasks.value.push({ description: '' })
}

// Remove Question Function
const removeQuestion = (index) => {
  questions.value.splice(index, 1)
}

// Remove Task Function
const removeTask = (index) => {
  tasks.value.splice(index, 1)
}

// Remove Link Function (for material, video, and coding platform links)
const removeLink = (arrayName, index) => {
  // Dynamically remove from the correct array (materialLinks, videoLink, codingPlatformLinks)
  if (arrayName === 'materialLinks') {
    materialLinks.value.splice(index, 1)
  } else if (arrayName === 'videoLink') {
    videoLink.value.splice(index, 1)
  } else if (arrayName === 'codingPlatformLinks') {
    codingPlatformLinks.value.splice(index, 1)
  }
}

const isLoading = ref(false)
// Handle form submission
const handleSubmit = () => {
  isLoading.value = true
  const payload = {
    sessionName: sessionName.value,
    sessionLength: sessionLength.value,
    sessionDescription: sessionDescription.value,
    sessionDate: sessionDate.value,
    videoLink: videoLink.value,
    playgroundLink: playgroundLink.value,
    discussionOption: discussionOption.value,
    questions: questions.value,
    materialLinks: materialLinks.value,
    codingPlatformLinks: codingPlatformLinks.value,
    tasks: tasks.value,
  }

  sesstionStore
    .createSession(userStore.currentUser.id, payload)
    .then((result) => {
      Notify.create({
        message: result.message,
        color: result.success ? 'green' : 'red',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
    })
    .catch(() => {
      Notify.create({
        message: 'Something went wrong!',
        color: 'red',
        position: 'top',
        icon: 'warning',
        timeout: 5000,
        actions: [{ icon: 'close', color: 'white', handler: () => {} }],
      })
    })
    .finally(() => {
      isLoading.value = false
      router.push('/session/list')
    })
}
</script>

<style scoped>
.q-form {
  max-width: 800px;
  margin: auto;
}
</style>
