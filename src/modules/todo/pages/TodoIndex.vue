<template>
  <q-page class="row q-col-gutter-md" padding>
    <!-- Right Content with Actions and Tasks -->
    <div class="col">
      <!-- Action Buttons -->

      <div class="q-gutter-sm q-mb-md action-buttons text-center">
        <div class="text-h4 brand_sb text-center">Todos</div>

        <q-btn icon="search" label="Search" @click="onSearch" />
        <q-btn icon="clear" label="Clear" @click="onClear" />
        <q-btn icon="filter_list" label="Filter" @click="onFilter" />
        <q-btn icon="sort" label="Sort" @click="onSort" />
      </div>

      <!-- Task List Panels -->
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="all">
          <TodoList :todos="todoStore.todos" />
        </q-tab-panel>

        <q-tab-panel name="today">
          <TodoList :todos="todayTasks" />
        </q-tab-panel>

        <q-tab-panel name="yesterday">
          <TodoList :todos="yesterdayTasks" />
        </q-tab-panel>

        <q-tab-panel name="upcoming">
          <TodoList :todos="upcomingTasks" />
        </q-tab-panel>

        <q-tab-panel name="completed">
          <TodoList :todos="completedTasks" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <!-- Left Side Tabs -->
    <div class="col-auto flex flex-center" style="height: 100vh">
      <q-tabs
        v-model="selectedTab"
        vertical
        active-color="primary"
        indicator-color="primary"
        class="q-py-xl bg-grey-2"
      >
        <q-tab name="all" label="" icon="list" class="q-mb-lg">
          <q-tooltip class="bg-secondary text-white">All Todos</q-tooltip>
        </q-tab>

        <q-tab name="today" label="" icon="today" class="q-mb-lg">
          <q-tooltip class="bg-secondary text-white">Today’s Todos</q-tooltip>
        </q-tab>

        <q-tab name="yesterday" label="" icon="history" class="q-mb-lg">
          <q-tooltip class="bg-secondary text-white">Yesterday’s Todos</q-tooltip>
        </q-tab>

        <q-tab name="upcoming" label="" icon="event" class="q-mb-lg">
          <q-tooltip class="bg-secondary text-white">Upcoming Todos</q-tooltip>
        </q-tab>

        <q-tab name="completed" label="" icon="check_circle">
          <q-tooltip class="bg-secondary text-white">Completed Todos</q-tooltip>
        </q-tab>
      </q-tabs>
    </div>

    <!-- Floating Action Button -->
    <q-btn fab color="secondary" icon="add" class="fab-button" @click="showCreateDialog = true" />
    <CreateTodoDialog v-model="showCreateDialog" />
  </q-page>
</template>

<script setup>
import { useTodoStore } from 'src/stores/todo-store'
import { onMounted, ref } from 'vue'
import TodoList from '../components/TodoList.vue'
import CreateTodoDialog from '../components/CreateTodoDialog.vue'
const todoStore = useTodoStore()

const showCreateDialog = ref(false)

onMounted(async () => {
  await todoStore.getTodos()
  console.log(todoStore.todos)
  todayTasks.value = findTodosUpdatedToday(todoStore.todos)
  upcomingTasks.value = findUpcomingTodos(todoStore.todos)
  upcomingTasks.value = findYesterdayTodos(todoStore.todos)

  const completed = todoStore.filterTodos((todo) => todo.isCompleted)
  completedTasks.value = completed.data
})
const selectedTab = ref('today')

// Dummy Tasks
const todayTasks = ref([])

function findTodosUpdatedToday(todos) {
  const today = new Date().toLocaleDateString()
  const matchingTodos = []

  for (const todo of todos) {
    if (todo.updatedAt) {
      let updatedDate
      if (typeof todo.updatedAt.toDate === 'function') {
        // Assuming updatedAt is a Firebase Timestamp
        updatedDate = todo.updatedAt.toDate().toLocaleDateString()
      } else if (typeof todo.updatedAt === 'string' || typeof todo.updatedAt === 'number') {
        // Assuming updatedAt is an ISO string or a Unix timestamp (in milliseconds)
        updatedDate = new Date(todo.updatedAt).toLocaleDateString()
      } else if (todo.updatedAt instanceof Date) {
        // Assuming updatedAt is a JavaScript Date object
        updatedDate = todo.updatedAt.toLocaleDateString()
      } else {
        console.warn(
          `Warning: Could not parse 'updatedAt' value: ${todo.updatedAt} for todo:`,
          todo,
        )
        continue // Skip this todo if parsing fails
      }

      if (updatedDate === today) {
        matchingTodos.push(todo)
      }
    }
  }

  return matchingTodos
}

function findUpcomingTodos(todos) {
  const currentDate = new Date()
  const upcomingTodos = []

  for (const todo of todos) {
    if (todo.dueDate) {
      let dueDate
      if (typeof todo.dueDate === 'string') {
        dueDate = new Date(todo.dueDate)
      } else if (todo.dueDate instanceof Date) {
        dueDate = todo.dueDate
      } else {
        console.warn(`Warning: Could not parse 'dueDate' value: ${todo.dueDate} for todo:`, todo)
        continue // Skip this todo if parsing fails
      }

      // Compare dueDate with the current date
      if (dueDate >= currentDate) {
        upcomingTodos.push(todo)
      }
    }
  }

  return upcomingTodos
}

function findYesterdayTodos(todos) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const yesterdayString = yesterday.toLocaleDateString()
  const yesterdayTodos = []

  for (const todo of todos) {
    if (todo.dueDate) {
      let dueDate
      if (typeof todo.dueDate === 'string') {
        dueDate = new Date(todo.dueDate).toLocaleDateString()
      } else if (todo.dueDate instanceof Date) {
        dueDate = todo.dueDate.toLocaleDateString()
      } else {
        console.warn(`Warning: Could not parse 'dueDate' value: ${todo.dueDate} for todo:`, todo)
        continue // Skip this todo if parsing fails
      }

      if (dueDate === yesterdayString) {
        yesterdayTodos.push(todo)
      }
    }
  }

  return yesterdayTodos
}
const yesterdayTasks = ref()

const upcomingTasks = ref()

const completedTasks = ref([{ id: 5, text: 'Submit timesheet' }])

// Action Handlers
const onSearch = () => {
  console.log('Search clicked')
}
const onClear = () => {
  console.log('Clear clicked')
}
const onFilter = () => {
  console.log('Filter clicked')
}
const onSort = () => {
  console.log('Sort clicked')
}
</script>

<style lang="scss" scoped>
.fab-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 10;
}

.action-buttons {
  position: sticky;
  top: 0;
  background: white;
  padding: 60px 0;
  z-index: 5;
}
</style>
