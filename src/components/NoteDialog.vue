<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    persistent
    no-backdrop-dismiss
    transition-show="scale"
    transition-hide="scale"
  >
    <div
      class="absolute bg-grey-1 column"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 9999,
        maxWidth: 'none',
        borderRadius: '8px',
      }"
      style="border: 1px solid red"
      v-touch-pan.prevent.mouse="onPan"
      @mousedown.stop
    >
      <!-- Header -->
      <div
        class="row justify-between q-pa-sm bg-grey-2"
        style="position: sticky; top: 0; z-index: 10; border: 1px solid green"
      >
        <div class="text-subtitle2 q-ml-sm">
          My Notes
          <q-btn flat dense size="sm" color="secondary" icon="add" @click="addNoteInput" />
        </div>
        <div>
          <q-btn flat dense color="red-10" icon="delete" size="sm" />
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

      <!-- Body -->
      <div class="row" style="flex: 1; overflow-x: hidden; border: 1px solid blue">
        <q-splitter v-model="splitterModel">
          <!-- Left: Notes List -->
          <template v-slot:before>
            <div class="col-4 bg-grey-1 q-pa-sm column" style="height: 100%">
              <div class="scroll" style="flex: 1; overflow-y: auto; overflow-x: auto">
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
                      <q-item-label lines="1" style="white-space: nowrap">{{
                        n.title
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </div>
          </template>
          <template v-slot:after>
            <!-- Right: Note Detail -->
            <div class="col-8 q-pa-md column" style="height: 100%">
              <div class="scroll" style="flex: 1">
                <!-- New note input form -->
                <div v-if="showAddNoteInput" class="q-mt-sm">
                  <q-input
                    v-model="newNote.title"
                    placeholder="Title..."
                    dense
                    borderless
                    class="text-h5"
                  />
                  <q-input
                    v-model="newNote.description"
                    placeholder=" Description..."
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
                        placeholder=" Description..."
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

      <!-- Resize Handle (unchanged) -->
      <div
        class="resize-handle"
        style="position: sticky; left: 100%; z-index: 10; border: 1px solid purple"
        @mousedown.stop.prevent="startResizing"
      ></div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
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

function saveNote() {
  if (newNote.value) {
    notes.value.push({ title: newNote.value.title, description: newNote.value.description })
    newNote.value = ''
    showAddNoteInput.value = false
    showEditNoteInput.value = false
  }
}
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
