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
      class="absolute bg-grey-1"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 9999,
      }"
      v-touch-pan.prevent.mouse="onPan"
      @mousedown.stop
    >
      <div class="flex justify-end">
        <q-btn flat dense color="red-10" icon="delete" size="sm" />
        <q-btn flat dense color="secondary" icon="save" size="sm" />
        <q-btn
          flat
          dense
          color="secondary"
          icon="close"
          size="sm"
          @click="emit('update:modelValue', false)"
        />
      </div>
      <div class="row full-height bg-grey-1">
        <!-- Left: Notes list -->
        <div class="col-4 bg-grey-1 q-pa-sm scroll">
          <div class="text-subtitle2 q-mb-sm">My Notes</div>
          <q-list bordered>
            <q-item
              v-for="(n, index) in notes"
              :key="index"
              clickable
              v-ripple
              :active="index === selectedNoteIndex"
              active-class="bg-primary text-white"
              @click="selectedNoteIndex = index"
              class="q-mb-sm rounded-borders"
            >
              <q-item-section>
                <q-item-label lines="1">{{ n.title }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Right: Note detail -->
        <div class="col-8 q-pa-md column justify-between">
          <div class="scroll" style="max-height: calc(100% - 50px)">
            <div class="text-h6">{{ selectedNote.title }}</div>
            <div class="text-body2 q-mt-sm">{{ selectedNote.description }}</div>
          </div>
        </div>
      </div>

      <!-- Resize handle in bottom-right corner -->
      <div class="resize-handle" @mousedown.stop.prevent="startResizing"></div>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
const props = defineProps({
  modelValue: Boolean,
  note: { type: Object, required: true },
  notes: { type: Array, default: () => [] },
  initialX: { type: Number, default: 200 },
  initialY: { type: Number, default: 150 },
  initialWidth: { type: Number, default: 600 },
  initialHeight: { type: Number, default: 400 },
})
const selectedNoteIndex = ref(0)

const emit = defineEmits(['update:modelValue'])

const selectedNote = computed(() => props.notes[selectedNoteIndex.value] || props.note)

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

// Resize logic
let isResizing = false

function startResizing(event) {
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
