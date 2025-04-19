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
              v-if="!todo.done"
              flat
              dense
              size="sm"
              icon="radio_button_unchecked"
              color="grey-5"
              @click.stop="markAsDone(todo)"
              :label="'Mark as Done'"
            />
            <q-btn v-else flat round dense icon="check_circle" color="positive" :label="'Done'" />
          </div>

          <div class="justify-end">
            <q-btn-dropdown
              v-model="todo.priority"
              split
              label="Priority"
              dropdown-icon="expand_more"
              dense
              outlined
              :color="priorityColor(todo.priority)"
              @click.stop
            >
              <q-list>
                <q-item
                  v-for="option in priorityOptions"
                  :key="option.value"
                  clickable
                  @click="todo.priority = option.value"
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
              @click.stop="editTask(todo)"
            />
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
const props = defineProps({
  todos: Array,
})
const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

function toggleDescription(todo) {
  todo.showDescription = !todo.showDescription
}

function priorityColor(priority) {
  return (
    {
      low: 'blue',
      medium: 'orange',
      high: 'red',
    }[priority] || 'grey'
  )
}

function markAsDone(todo) {
  // example: remove from list or mark visually
  console.log('Marked as done:', todo)
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
