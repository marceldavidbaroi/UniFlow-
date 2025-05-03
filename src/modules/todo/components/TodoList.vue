<template>
  <q-list class="q-pa-md">
    <q-item
      v-for="todo in props.todos"
      :key="todo.id"
      class="q-mb-lg rounded-borders bg-grey-1 my-card"
      style="border-radius: 8px"
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
          <div class="justify-end q-gutter-x-md">
            <q-btn-dropdown
              :label="todo.priority"
              dropdown-icon="expand_more"
              dense
              unelevated
              size="sm"
              class="q-pl-sm"
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
              color="secondary"
              @click.stop="showCreateDialog = true"
            />
            <CreateTodoDialog
              v-model="showCreateDialog"
              :todo="todo"
              :isEdit="true"
              @todo-updated="handleTodoUpdated"
            />
            <q-btn
              flat
              round
              dense
              icon="delete"
              size="sm"
              color="negative"
              @click="showDeleteDialog = true"
            />
            <DeleteDialog
              v-model="showDeleteDialog"
              card-title="Delete Todo"
              description="Are you sure you want to permanently delete this todo?"
              button-label="Confirm Delete"
              @confirm-delete="handleDelete(todo.id)"
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

  <div v-if="!props.todos.length" class="q-pa-md text-center text-grey-6">
    <q-icon name="info" size="lg" color="grey-5" class="q-mb-sm" />
    <div class="text-h6">No Todos Found</div>
    <div class="text-caption">You can add a new todo to get started!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTodoStore } from 'src/stores/todo-store'
import CreateTodoDialog from './CreateTodoDialog.vue'
import DeleteDialog from 'src/components/DeleteDialog.vue'
import { Notify } from 'quasar'

const todoStore = useTodoStore()
const props = defineProps({
  todos: Array,
})
const showCreateDialog = ref(false)
const showDeleteDialog = ref(false)

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const handleTodoUpdated = async () => {
  emit('todo-updated') // emit to parent
}
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
async function handleDelete(id) {
  try {
    const response = await todoStore.deleteTodo(id)
    if (response && response.success) {
      Notify.create({
        message: response.message || 'Todo deleted successfully!',
        color: 'positive',
        icon: 'check',
        position: 'top',
        timeout: 2500,
      })
      emit('todo-updated') // Emit event to update the list immediately
    }
  } catch {
    Notify.create({
      message: 'An error occurred while deleting the todo.',
      color: 'negative',
      icon: 'error',
      position: 'top',
      timeout: 5000,
    })
  }
}
</script>

<style lang="scss" scoped>
.my-card {
  width: 100%;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
