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
            v-if="showAddNoteInput"
            flat
            dense
            color="red-10"
            icon="arrow_back"
            size="sm"
            @click="showAddNoteInput = false"
          />
          <q-btn
            v-if="notes.length && !showAddNoteInput"
            flat
            dense
            color="red-10"
            icon="delete"
            size="sm"
            @click="showDeleteDialog = true"
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
            v-if="!showAddNoteInput && !showEditNoteInput && notes.length"
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
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle1">Notes</div>
                <q-btn
                  dense
                  unelevated
                  size="xs"
                  :color="isUserNotes ? 'blue-2' : 'green-2'"
                  text-color="blue-10"
                  :label="isUserNotes ? 'Your notes' : 'Public notes'"
                  @click="toggleNotes"
                />
              </div>

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
            <!-- <div v-if="isLoading" class="flex flex-center items-center">
              <q-spinner-grid color="primary" size="40px" />
            </div> -->
            <div v-if="isLoading" class="flex flex-center" style="height: 400px">
              <div class="text-center">
                <q-spinner-grid color="secondary" size="2em" />
                <div>Loading note...</div>
              </div>
            </div>
            <div v-else>
              <div v-if="showEditNoteInput || showAddNoteInput" class="q-gutter-sm q-ml-xs">
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
                  size="sm"
                  flat
                  dense
                  :icon="newNote?.isPublic ? 'public' : 'lock'"
                  :color="newNote?.isPublic ? 'green-4' : 'grey-5'"
                  @click="newNote.isPublic = !newNote.isPublic"
                >
                  <q-tooltip class="bg-secondary">
                    {{ newNote.isPublic ? 'public' : 'private' }}
                  </q-tooltip>
                </q-btn>
              </div>
              <!-- for tags -->
              <q-select
                v-if="showTagSelect && (showEditNoteInput || showAddNoteInput)"
                filled
                v-model="newNote.tags"
                :options="tagOptions"
                label="Select tags"
                use-chips
                multiple
                dense
                option-value="value"
                option-label="label"
                color="secondary"
                class="q-mx-md"
              >
                <!-- Custom chip rendering -->
                <template v-slot:chip="scope">
                  <q-chip
                    removable
                    square
                    @remove="removeTag(scope.option.value)"
                    :label="scope.option.label"
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
              <!-- {{ userStore.allUsers }} -->
              <!-- shared With -->
              <q-select
                v-if="showShareUser && (showEditNoteInput || showAddNoteInput)"
                filled
                v-model="newNote.sharedWith"
                :options="userStore.allUsers"
                label="Select user"
                use-chips
                multiple
                dense
                option-value="id"
                option-label="name"
                color="secondary"
                class="q-mx-md"
              >
                <!-- Custom chip rendering -->
                <template v-slot:chip="scope">
                  <q-chip
                    removable
                    square
                    @remove="removeSharedUser(scope.option.value)"
                    :label="scope.option.label"
                    class="q-mx-xs"
                  />
                </template>
                <!-- Option rendering -->
                <template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                    <q-item-section avatar>
                      <q-icon name="label" :color="scope.opt.color" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ scope.opt.name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>

              <div class="column full-height q-pa-md">
                <div v-if="!showAddNoteInput" class="row">
                  <div v-for="(tag, tagIndex) in selectedNote?.tags" :key="tagIndex">
                    <q-chip
                      square
                      dense
                      :color="tag.color"
                      :text-color="tag.textColor"
                      :label="tag.value"
                      size="md"
                    />
                  </div>
                </div>
                <div class="col-auto text-subtitle1">
                  <!-- <q-icon
                    :name="newNote.isPublic ? 'public' : 'lock'"
                    :color="newNote.isPublic ? 'green-4' : 'grey-5'"
                  /> -->
                </div>
                <!-- {{ selectedNote }} -->
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
                      <div v-else class="text-h6">
                        <q-icon
                          size="xs"
                          :name="selectedNote?.isPublic ? 'public' : 'lock'"
                          :color="selectedNote?.isPublic ? 'green-4' : 'grey-5'"
                        />&nbsp;{{ selectedNote?.title }}
                      </div>
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

    <DeleteDialog :modelValue="showDeleteDialog" @confirm-delete="deleteNote" />
  </q-dialog>
</template>

<script setup>
import { useNoteStore } from 'src/stores/note-store'
import { ref, watch, onBeforeUnmount, computed, onMounted } from 'vue'
import DeleteDialog from './DeleteDialog.vue'
import { useUserStore } from 'src/stores/user-store'
const userStore = useUserStore()

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
const showDeleteDialog = ref(false)
const tagOptions = ref([])
const isLoading = ref(false)

const studentTags = [
  { label: 'Lecture Notes', value: '#lecture-notes', color: 'blue-1', textColor: 'blue-10' },
  { label: 'Assignments', value: '#assignments', color: 'blue-2', textColor: 'blue-10' },
  { label: 'Exam Prep', value: '#exam-prep', color: 'blue-3', textColor: 'blue-10' },
  { label: 'Summary', value: '#summary', color: 'blue-1', textColor: 'blue-10' },
  { label: 'Homework', value: '#homework', color: 'blue-2', textColor: 'blue-10' },
  { label: 'Group Work', value: '#group-work', color: 'cyan-1', textColor: 'cyan-10' },
  { label: 'Reading Material', value: '#reading', color: 'cyan-2', textColor: 'cyan-10' },
  {
    label: 'Class Notes',
    value: '#class-notes',
    color: 'light-blue-1',
    textColor: 'light-blue-10',
  },
  {
    label: 'Practice Problems',
    value: '#practice',
    color: 'blue-grey-1',
    textColor: 'blue-grey-10',
  },
  { label: 'Peer Review', value: '#peer-review', color: 'teal-1', textColor: 'teal-10' },
]

const teacherTags = [
  { label: 'Lesson Plan', value: '#lesson-plan', color: 'green-1', textColor: 'green-10' },
  { label: 'Class Materials', value: '#class-materials', color: 'green-2', textColor: 'green-10' },
  { label: 'Quiz Questions', value: '#quiz-questions', color: 'green-3', textColor: 'green-10' },
  { label: 'Syllabus', value: '#syllabus', color: 'green-1', textColor: 'green-10' },
  { label: 'Lecture Slides', value: '#slides', color: 'lime-1', textColor: 'lime-10' },
  { label: 'Project Guide', value: '#project-guide', color: 'lime-2', textColor: 'lime-10' },
  {
    label: 'Attendance Sheet',
    value: '#attendance',
    color: 'light-green-1',
    textColor: 'light-green-10',
  },
  { label: 'Marking Rubric', value: '#rubric', color: 'teal-1', textColor: 'teal-10' },
]

const adminTags = [
  { label: 'Policy', value: '#policy', color: 'orange-1', textColor: 'orange-10' },
  { label: 'Notices', value: '#notices', color: 'amber-1', textColor: 'amber-10' },
  { label: 'Meeting Notes', value: '#meeting-notes', color: 'purple-1', textColor: 'purple-10' },
  {
    label: 'Event Plan',
    value: '#event-plan',
    color: 'deep-purple-1',
    textColor: 'deep-purple-10',
  },
  { label: 'Budget', value: '#budget', color: 'grey-2', textColor: 'grey-10' },
  { label: 'Feedback', value: '#feedback', color: 'pink-1', textColor: 'pink-10' },
  { label: 'Circular', value: '#circular', color: 'deep-orange-1', textColor: 'deep-orange-10' },
  { label: 'Meeting Agenda', value: '#agenda', color: 'purple-2', textColor: 'purple-10' },
]

const statusTags = [
  { label: 'Urgent', value: '#urgent', color: 'red-1', textColor: 'red-10' },
  { label: 'Important', value: '#important', color: 'pink-1', textColor: 'pink-10' },
  { label: 'To Review', value: '#to-review', color: 'grey-1', textColor: 'grey-10' },
  { label: 'Completed', value: '#completed', color: 'grey-3', textColor: 'grey-10' },
  { label: 'In Progress', value: '#in-progress', color: 'yellow-1', textColor: 'yellow-10' },
  { label: 'Pending Approval', value: '#pending', color: 'orange-2', textColor: 'orange-10' },
  { label: 'Archived', value: '#archived', color: 'grey-4', textColor: 'grey-10' },
  { label: 'Draft', value: '#draft', color: 'blue-grey-2', textColor: 'blue-grey-10' },
]

const showShareUser = ref(false)
const showTagSelect = ref(false)
const isUserNotes = ref(true)
const toggleNotes = () => {
  isLoading.value = true
  isUserNotes.value = !isUserNotes.value
  if (isUserNotes.value) {
    notes.value = noteStore.userNotes
    selectedNoteIndex.value = 0
  } else {
    notes.value = noteStore.publicNotes
    selectedNoteIndex.value = 0
  }
  isLoading.value = false
}

// const selectedTags = ref([])

// helper to remove tag from selection
function removeTag(val) {
  newNote.value.tags = newNote.value.tagsfilter((tag) => tag !== val)
}
function removeSharedUser(val) {
  newNote.value.sharedWith = newNote.value.sharedWithfilter((tag) => tag !== val)
}

// Helper to get text color based on chip bg color for contrast
// function getTextColor(bgColor) {
//   const darkColors = [
//     'blue-4',
//     'blue-5',
//     'blue-6',
//     'green-4',
//     'green-5',
//     'green-6',
//     'red-5',
//     'red-6',
//     'orange-4',
//     'orange-5',
//     'orange-6',
//     'grey-5',
//   ]
//   return darkColors.includes(bgColor) ? 'white' : 'black'
// }

const notes = ref(noteStore.userNotes)

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

const isEdit = ref(false)

const editNote = () => {
  showEditNoteInput.value = true
  isEdit.value = true
  newNote.value = {
    title: selectedNote.value.title,
    description: selectedNote.value.description,
    tags: selectedNote.value.tags,
    sharedWith: selectedNote.value.sharedWith,
    isPublic: selectedNote.value.isPublic,
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
  links: [],
  category: [],
  tags: [],
  isPublic: false,
  sharedWith: [],
})
const resetNewNote = () => {
  newNote.value = {
    title: '',
    description: '',
    links: [],
    category: [],
    tags: [],
    isPublic: false,
    sharedWith: [],
  }
}

function addNoteInput() {
  showAddNoteInput.value = true
  selectedNote.value = null
}

async function saveNote() {
  isLoading.value = true
  if (newNote.value) {
    // notes.value.push({ title: newNote.value.title, description: newNote.value.description })

    const payload = {
      title: newNote.value.title || '',
      description: newNote.value.description || '',
      links: newNote.value.links || [],
      category: newNote.value.category || [],
      tags: newNote.value.tags || [],
      isPublic: newNote.value.isPublic || false,
      sharedWith: newNote.value.sharedWith || [],
    }
    if (isEdit.value) {
      await noteStore.updateNote(selectedNote.value.id, payload)

      isEdit.value = false
    } else {
      await noteStore.createNote(payload)
      selectedNoteIndex.value = notes.value.length
    }
    await noteStore.fetchNotesByUser()
    await noteStore.fetchPublicNotes()

    notes.value = noteStore.userNotes

    // title, description, links, category, tags, isPublic, sharedWith
    resetNewNote()
    showAddNoteInput.value = false
    showEditNoteInput.value = false
    showShareUser.value = false
    showTagSelect.value = false
  }
  isLoading.value = false
}
const deleteNote = async () => {
  isLoading.value = true
  await noteStore.deleteNote(selectedNote.value.id)
  notes.value = noteStore.userNotes
  await noteStore.fetchNotesByUser()
  isLoading.value = false
}

onMounted(async () => {
  await noteStore.fetchNotesByUser()
  await noteStore.fetchPublicNotes()
  await userStore.getAllUsers()

  notes.value = noteStore.userNotes

  if (userStore.currentRole === 'teacher') {
    tagOptions.value = [...teacherTags, ...statusTags]
  } else if (userStore.currentRole === 'student') {
    tagOptions.value = [...studentTags, ...statusTags]
  } else {
    tagOptions.value = [...adminTags, ...statusTags]
  }
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
