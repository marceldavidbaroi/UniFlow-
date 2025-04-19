<template>
  <q-list class="q-pa-md">
    <q-item
      v-for="todo in props.todos"
      :key="todo.id"
      class="q-mb-sm rounded-borders shadow-1 bg-white"
    >
      <q-item-section side top> </q-item-section>

      <q-item-section>
        <div class="row justify-between q-gutter-sm">
          <div class="justify-start">
            <q-btn
              flat
              dense
              size="sm"
              :icon="todo.isCompleted ? 'check_circle' : 'radio_button_unchecked'"
              :color="todo.isCompleted ? 'positive' : 'grey-5'"
              @click.stop="markAsDone(todo.id, { isCompleted: !todo.isCompleted })"
              :label="todo.isCompleted ? 'Mark as Undone' : 'Mark as Done'"
            />
          </div>
          {{ todo.priority }}
          <div class="justify-end">
            <q-btn-dropdown
              :label="todo.priority"
              dropdown-icon="expand_more"
              dense
              size="sm"
              :color="getPriorityColor(todo.priority)"
              @click.stop
            >
              <q-list>
                <q-item
                  v-for="option in priorityOptions"
                  :key="option.value"
                  clickable
                  @click="changePriority(todo.id, { priority: option.value })"
                >
                  <q-item-section>
                    {{ option.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-btn
              flat
              round
              dense
              icon="edit"
              size="sm"
              color="primary"
              @click.stop="showCreateDialog = true"
            />
            <CreateTodoDialog v-model="showCreateDialog" />
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="sm"
              color="negative"
              @click.stop="deleteTask(todo)"
            />
          </div>
        </div>
        <div class="q-mt-sm cursor-pointer" @click="toggleDescription(todo)">
          <div class="text-subtitle1">{{ todo.title }}</div>
          <div v-if="todo.showDescription" class="text-caption text-grey-7 q-mt-xs">
            {{ todo.description }}
          </div>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from 'src/stores/todo-store'

const todoStore = useTodoStore()
const props = defineProps({
  todos: Array,
})
const showCreateDialog = ref(false)
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

function toggleDescription(todo) {
  todo.showDescription = !todo.showDescription
}

const getPriorityColor = (priority) => {
  const value = String(priority).toLowerCase()

  switch (value) {
    case 'high':
      return 'red-5'
    case 'medium':
      return 'orange-5'
    case 'low':
      return 'green-5'
    default:
      return 'grey-5'
  }
}

const emit = defineEmits(['todo-updated'])

const markAsDone = async (id, data) => {
  // example: remove from list or mark visually
  await todoStore.updateTodo(id, data)
  emit('todo-updated') // emit to parent
}

const changePriority = async (id, data) => {
  // example: remove from list or mark visually
  await todoStore.updateTodo(id, data)
  emit('todo-updated') // emit to parent
}

function editTask(todo) {
  // open a modal or emit event
  console.log('Edit task:', todo)
}

function deleteTask() {
  // tasks.value = tasks.value.filter((t) => t.id !== todo.id)
}
</script>

<style lang="scss" scoped></style>
