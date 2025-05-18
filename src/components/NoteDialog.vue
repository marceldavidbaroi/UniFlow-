<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    persistent
    no-backdrop-dismiss
    transition-show="scale"
    transition-hide="scale"
  >
    <!-- Outer container -->
    <div
      class="bg-grey-1 column"
      :style="{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 9999,
        maxWidth: 'none',
        borderRadius: '8px',
        minWidth: '400px',
      }"
      v-touch-pan.prevent.mouse="onPan"
      @mousedown.stop
    >
      <!-- HEADER -->
      <div class="row justify-between q-pa-sm bg-grey-2" style="z-index: 10">
        <div class="text-subtitle2 q-ml-sm">
          My Notes
          <q-btn flat dense size="sm" color="secondary" icon="add" @click="addNoteInput" />
        </div>
        <div>
          <q-btn
            flat
            dense
            color="red-10"
            icon="delete"
            size="sm"
            @click="showAddNoteInput = false"
          />
          <q-btn
            flat
            dense
            color="secondary"
            icon="save"
            size="sm"
            v-if="showAddNoteInput || showEditNoteInput"
            @click="saveNote"
          />
          <q-btn
            flat
            dense
            color="secondary"
            icon="edit"
            size="sm"
            v-if="!showAddNoteInput && !showEditNoteInput"
            @click="editNote"
          />
          <q-btn
            flat
            dense
            color="secondary"
            icon="close"
            size="sm"
            @click="emit('update:modelValue', false)"
          />
        </div>
      </div>

      <!-- BODY: Scrollable Splitter -->
      <div class="col">
        <q-splitter v-model="splitterModel" style="height: 100%">
          <!-- LEFT -->
          <template v-slot:before>
            <div class="column full-height bg-grey-1 q-pa-sm">
              <div class="col-auto text-subtitle1">Notes</div>
              <div class="col scroll">
                <q-list>
                  <q-item
                    v-for="(n, index) in notes"
                    :key="index"
                    clickable
                    v-ripple
                    :active="index === selectedNoteIndex"
                    active-class="bg-secondary text-white"
                    @click="selectedNoteIndex = index"
                    class="q-mb-sm rounded-borders"
                    :disable="showAddNoteInput || showEditNoteInput"
                  >
                    <q-item-section>
                      <q-item-label lines="1" style="white-space: nowrap">
                        {{ n.title }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </template>

          <!-- RIGHT -->
          <template v-slot:after>
            <div v-if="showEditNoteInput" class="q-gutter-sm q-ml-xs">
              <q-btn
                color="grey-6"
                size="sm"
                flat
                dense
                icon="label"
                @click="showTagSelect = !showTagSelect"
              >
                <q-tooltip class="bg-secondary"> tags </q-tooltip>
              </q-btn>
              <q-btn
                color="grey-6"
                size="sm"
                flat
                dense
                icon="person_add"
                @click="showShareUser = !showShareUser"
              >
                <q-tooltip class="bg-secondary"> share </q-tooltip>
              </q-btn>
              <q-btn
                color="grey-6"
                size="sm"
                flat
                dense
                :icon="isPublic ? 'public' : 'lock'"
                @click="isPublic = !isPublic"
              >
                <q-tooltip class="bg-secondary"> {{ isPublic ? 'public' : 'private' }} </q-tooltip>
              </q-btn>
            </div>
            <!-- for tags -->
            <q-select
              v-if="showTagSelect && showEditNoteInput"
              outlined
              v-model="selectedTags"
              :options="tagOptions"
              label="Select tags"
              use-chips
              multiple
              emit-value
              map-options
              dense
              option-value="value"
              option-label="label"
              color="secondary"
            >
              <!-- Custom chip rendering -->
              <template v-slot:chip="scope">
                <q-chip
                  removable
                  @remove="removeTag(scope.option.value)"
                  :label="scope.option.label"
                  :text-color="getTextColor(scope.option.color)"
                  class="q-mx-xs"
                  :class="`bg-${scope.option.color}`"
                />
              </template>

              <!-- Option rendering -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar>
                    <q-icon name="label" :color="scope.opt.color" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="column full-height q-pa-md">
              <div class="col-auto text-subtitle1">Note Detail</div>
              <div class="col scroll">
                <div v-if="showAddNoteInput">
                  <q-input
                    v-model="newNote.title"
                    placeholder="Title..."
                    dense
                    borderless
                    class="text-h5"
                  />
                  <q-input
                    v-model="newNote.description"
                    placeholder="Description..."
                    dense
                    borderless
                    type="textarea"
                  />
                </div>
                <div v-else>
                  <div v-if="notes.length > 0">
                    <div v-if="showEditNoteInput" class="text-h6">
                      <q-input
                        v-model="newNote.title"
                        placeholder="Title..."
                        dense
                        borderless
                        class="text-h5"
                      />
                    </div>
                    <div v-else class="text-h6">{{ selectedNote?.title }}</div>
                    <div v-if="showEditNoteInput" class="text-body2 q-mt-sm">
                      <q-input
                        v-model="newNote.description"
                        placeholder="Description..."
                        dense
                        borderless
                        type="textarea"
                      />
                    </div>
                    <div v-else class="text-body2 q-mt-sm">{{ selectedNote?.description }}</div>
                  </div>
                  <div v-else class="text-body2 q-mt-sm text-center">
                    No notes available. Please add a note.
                  </div>
                </div>
              </div>
            </div>
          </template>
        </q-splitter>
      </div>

      <!-- RESIZE HANDLE -->
      <div
        class="q-mt-xs resize-handle"
        style="height: 16px; cursor: row-resize; z-index: 10"
        @mousedown.stop.prevent="startResizing"
      ></div>
    </div>
  </q-dialog>
</template>

<script setup>
import { useNoteStore } from 'src/stores/note-store'
import { ref, watch, onBeforeUnmount, computed, onMounted } from 'vue'
const noteStore = useNoteStore()
const splitterModel = ref(30)
const props = defineProps({
  modelValue: Boolean,
  // note: { type: Object, required: true },
  // notes: { type: Array, default: () => [] },
  initialX: { type: Number, default: 200 },
  initialY: { type: Number, default: 150 },
  initialWidth: { type: Number, default: 600 },
  initialHeight: { type: Number, default: 400 },
})

const tagOptions = [
  // Student Tags (Blue - darker for chip bg)
  { label: 'Lecture Notes', value: '#lecture-notes', color: 'blue-4' },
  { label: 'Assignments', value: '#assignments', color: 'blue-5' },
  { label: 'Exam Prep', value: '#exam-prep', color: 'blue-6' },
  { label: 'Summary', value: '#summary', color: 'blue-4' },
  { label: 'Homework', value: '#homework', color: 'blue-5' },

  // Teacher Tags (Green)
  { label: 'Lesson Plan', value: '#lesson-plan', color: 'green-4' },
  { label: 'Class Materials', value: '#class-materials', color: 'green-5' },
  { label: 'Quiz Questions', value: '#quiz-questions', color: 'green-6' },
  { label: 'Syllabus', value: '#syllabus', color: 'green-4' },

  // Subject Tags (Orange)
  { label: 'Math', value: '#math', color: 'orange-4' },
  { label: 'Science', value: '#science', color: 'orange-5' },
  { label: 'History', value: '#history', color: 'orange-6' },
  { label: 'Computer Science', value: '#computer-science', color: 'orange-4' },

  // Utility / Priority (Red/Gray)
  { label: 'Urgent', value: '#urgent', color: 'red-5' },
  { label: 'Important', value: '#important', color: 'red-6' },
  { label: 'To Review', value: '#to-review', color: 'grey-4' },
  { label: 'Completed', value: '#completed', color: 'grey-5' },
]

const isPublic = ref(false)
const showShareUser = ref(false)
const showTagSelect = ref(false)

const selectedTags = ref([])

// helper to remove tag from selection
function removeTag(val) {
  selectedTags.value = selectedTags.value.filter((tag) => tag !== val)
}

// Helper to get text color based on chip bg color for contrast
function getTextColor(bgColor) {
  const darkColors = [
    'blue-4',
    'blue-5',
    'blue-6',
    'green-4',
    'green-5',
    'green-6',
    'red-5',
    'red-6',
    'orange-4',
    'orange-5',
    'orange-6',
    'grey-5',
  ]
  return darkColors.includes(bgColor) ? 'white' : 'black'
}

const notes = ref([
  {
    title: 'Vue 3 Composition API',
    description:
      'Understand how to use ref, reactive, and computed in the Composition API. Great for building scalable components.',
  },
  {
    title: 'Pinia Store Basics',
    description:
      'Learn how to define state, actions, and getters using Pinia, the next-generation state management system for Vue.',
  },
  {
    title: 'Quasar Framework Tips',
    description:
      "Use Quasar's powerful components like QTable, QDialog, and QLayout to build elegant UIs quickly.",
  },
  {
    title: 'Firebase Integration',
    description: 'Integrate Firestore with Vue to fetch, add, and manage user data in real time.',
  },
  {
    title: 'Note Sharing Ideas',
    description:
      'Allow users to share public or private notes with others, and categorize them with tags and filters.',
  },
])
const selectedNoteIndex = ref(0)

const emit = defineEmits(['update:modelValue'])

const selectedNote = computed(() => notes.value[selectedNoteIndex.value])

const position = ref({ x: props.initialX, y: props.initialY })
const size = ref({ width: props.initialWidth, height: props.initialHeight })

function onPan(event) {
  position.value.x += event.delta.x
  position.value.y += event.delta.y
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      position.value = { x: props.initialX, y: props.initialY }
      size.value = { width: props.initialWidth, height: props.initialHeight }
    }
  },
)

const editNote = () => {
  showEditNoteInput.value = true
  newNote.value = {
    title: selectedNote.value.title,
    description: selectedNote.value.description,
  }
  // showEditNoteInput.value = false
}

// Resize logic
let isResizing = false

function startResizing() {
  isResizing = true
  window.addEventListener('mousemove', onResize)
  window.addEventListener('mouseup', stopResizing)
}

function onResize(event) {
  if (!isResizing) return
  size.value.width = Math.max(200, event.clientX - position.value.x)
  size.value.height = Math.max(100, event.clientY - position.value.y)
}

function stopResizing() {
  isResizing = false
  window.removeEventListener('mousemove', onResize)
  window.removeEventListener('mouseup', stopResizing)
}

onBeforeUnmount(() => {
  stopResizing()
})

const showAddNoteInput = ref(false)
const showEditNoteInput = ref(false)
const newNote = ref({
  title: '',
  description: '',
})

function addNoteInput() {
  showAddNoteInput.value = true
}

async function saveNote() {
  if (newNote.value) {
    // notes.value.push({ title: newNote.value.title, description: newNote.value.description })

    const payload = {
      title: newNote.value.title,
      description: newNote.value.description,
      links: '',
      category: '',
      tags: selectedTags.value || [],
      isPublic: isPublic.value,
      sharedWith: '',
    }
    console.log(payload)
    await noteStore.createNote(payload)
    console.log('saved')
    // title, description, links, category, tags, isPublic, sharedWith
    newNote.value = ''
    showAddNoteInput.value = false
    showEditNoteInput.value = false
  }
}

onMounted(async () => {
  notes.value = await noteStore.fetchNotesByUser()

  console.log(notes.value)
})
</script>

<style scoped>
.q-card {
  cursor: grab;
  box-sizing: border-box;
}

/* Resize handle (bottom-right corner) */
.resize-handle {
  position: absolute;
  width: 16px;
  height: 16px;
  bottom: 0;
  right: 0;
  background: #ccc;
  cursor: nwse-resize;
  z-index: 10000;
  border-radius: 3px;
}
</style>
