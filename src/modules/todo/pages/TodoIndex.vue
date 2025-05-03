<template>
  <q-page class="row q-col-gutter-md" padding>
    <!-- Right Content with Actions and Tasks -->
    <div class="col">
      <!-- Action Buttons -->

      <div class="q-gutter-sm q-mb-md action-buttons text-center">
        <div class="text-h4 brand_sb text-center">Todos</div>

        <!-- Modern and stylish search box -->
        <div v-if="showSearchBox" class="row justify-center">
          <q-input
            v-model="searchQuery"
            placeholder="Search todos..."
            @input="applySearch"
            clearable
            outlined
            dense
            class="modern-search-box col-6"
          >
            <template v-slot:append>
              <q-icon name="close" class="cursor-pointer" @click="closeSearchBox" />
            </template>
          </q-input>
        </div>

        <div v-else>
          <q-btn icon="search" label="Search" @click="toggleSearchBox" />
          <q-btn icon="clear" label="Clear" @click="onClear" />
          <q-btn-dropdown icon="filter_list" label="Filter">
            <q-list style="min-width: 150px">
              <!-- ALL Option -->
              <q-item v-ripple>
                <q-item-section>
                  <q-checkbox v-model="filters.all" label="All" @update:model-value="onAllChange" />
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item v-ripple>
                <q-item-section>
                  <q-checkbox
                    v-model="filters.high"
                    label="High"
                    @update:model-value="onOtherChange"
                  />
                </q-item-section>
              </q-item>

              <q-item v-ripple>
                <q-item-section>
                  <q-checkbox
                    v-model="filters.medium"
                    label="Medium"
                    @update:model-value="onOtherChange"
                  />
                </q-item-section>
              </q-item>

              <q-item v-ripple>
                <q-item-section>
                  <q-checkbox
                    v-model="filters.low"
                    label="Low"
                    @update:model-value="onOtherChange"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-btn-dropdown icon="sort" label="Sort">
            <q-list style="min-width: 150px">
              <q-item v-ripple v-close-popup>
                <q-item-section>
                  <q-radio
                    v-model="selectedSort"
                    val="priority"
                    label="Sort by Priority"
                    @update:model-value="sortTodos('priority')"
                  />
                </q-item-section>
              </q-item>
              <q-item v-ripple v-close-popup>
                <q-item-section>
                  <q-radio
                    v-model="selectedSort"
                    val="dueDate"
                    label="Sort by Due Date"
                    @update:model-value="sortTodos('dueDate')"
                  />
                </q-item-section>
              </q-item>
              <q-item v-ripple v-close-popup>
                <q-item-section>
                  <q-radio
                    v-model="selectedSort"
                    val="createdAt"
                    label="Sort by Created Date"
                    @update:model-value="sortTodos('createdAt')"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>

      <!-- Task List Panels -->
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel name="all">
          <TodoList :todos="filteredTodos" @todo-updated="handleTodoUpdated" />
        </q-tab-panel>

        <q-tab-panel name="today">
          <TodoList :todos="filteredTodos" @todo-updated="handleTodoUpdated" />
        </q-tab-panel>

        <q-tab-panel name="yesterday">
          <TodoList :todos="filteredTodos" @todo-updated="handleTodoUpdated" />
        </q-tab-panel>

        <q-tab-panel name="upcoming">
          <TodoList :todos="filteredTodos" @todo-updated="handleTodoUpdated" />
        </q-tab-panel>

        <q-tab-panel name="completed">
          <TodoList :todos="filteredTodos" @todo-updated="handleTodoUpdated" />
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <!-- Left Side Tabs -->
    <div class="col-auto flex flex-center" style="height: 100vh">
      <q-tabs
        v-model="selectedTab"
        vertical
        active-color="secondary"
        indicator-color="secondary"
        class="q-py-xl bg-grey-2"
      >
        <q-tab name="all" label="" icon="checklist" class="q-mb-lg">
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
// Organize imports
import { useTodoStore } from 'src/stores/todo-store'
import { onMounted, ref, watch } from 'vue'
import TodoList from '../components/TodoList.vue'
import CreateTodoDialog from '../components/CreateTodoDialog.vue'

// Reactive references
const todoStore = useTodoStore()
const showCreateDialog = ref(false)
const filteredTodos = ref([])
const filters = ref({
  all: true,
  high: false,
  medium: false,
  low: false,
})
const data = ref()
const selectedTab = ref('all')
const selectedSort = ref('priority')
const todayTasks = ref([])
const yesterdayTasks = ref()
const upcomingTasks = ref()
const completedTasks = ref([{ id: 5, text: 'Submit timesheet' }])
const showSearchBox = ref(false)
const searchQuery = ref('')

// Functions
function onAllChange(val) {
  if (val) {
    filters.value.high = false
    filters.value.medium = false
    filters.value.low = false
  }
  applyFilters()
}

function onOtherChange() {
  if (filters.value.high || filters.value.medium || filters.value.low) {
    filters.value.all = false
  }
  applyFilters()
}

function applyFilters() {
  if (selectedTab.value === 'all') {
    data.value = todoStore.todos
  } else if (selectedTab.value === 'today') {
    data.value = todayTasks.value
  } else if (selectedTab.value === 'yesterday') {
    data.value = yesterdayTasks.value
  } else if (selectedTab.value === 'upcoming') {
    data.value = upcomingTasks.value
  } else if (selectedTab.value === 'completed') {
    data.value = completedTasks.value
  }

  let filterFn
  const noFiltersSelected = !filters.value.high && !filters.value.medium && !filters.value.low

  if (filters.value.all || noFiltersSelected) {
    filterFn = () => true
  } else {
    filterFn = (todo) => {
      const matchPriority =
        (filters.value.high && todo.priority === 'high') ||
        (filters.value.medium && todo.priority === 'medium') ||
        (filters.value.low && todo.priority === 'low')
      return matchPriority
    }
  }

  const result = todoStore.filterTodos(data.value, filterFn)
  filteredTodos.value = result.data
}

function sortTodos(criteria) {
  let key
  let direction = 'asc'
  switch (criteria) {
    case 'priority':
      key = 'priority'
      break
    case 'dueDate':
      key = 'dueDate'
      break
    case 'createdAt':
      key = 'createdAt'
      direction = 'desc'
      break
    default:
      return
  }

  const result = todoStore.sortTodos(filteredTodos.value, key, direction)
  if (result.success) {
    filteredTodos.value = result.data
  }
}

function handleTodoUpdated() {
  todoStore.getTodos().then(() => {
    todayTasks.value = findTodosUpdatedToday(todoStore.todos)
    upcomingTasks.value = findUpcomingTodos(todoStore.todos)
    yesterdayTasks.value = findYesterdayTodos(todoStore.todos)

    const completed = todoStore.filterTodos(data.value, (todo) => todo.isCompleted)
    completedTasks.value = completed.data
    filteredTodos.value = todoStore.todos
    data.value = todoStore.todos
  })
}

function findTodosUpdatedToday(todos) {
  const today = new Date().toLocaleDateString()
  return todos.filter((todo) => {
    const updatedDate = new Date(todo.updatedAt).toLocaleDateString()
    return updatedDate === today
  })
}

function findUpcomingTodos(todos) {
  const currentDate = new Date()
  return todos.filter((todo) => new Date(todo.dueDate) >= currentDate)
}

function findYesterdayTodos(todos) {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toLocaleDateString()
  return todos.filter((todo) => new Date(todo.dueDate).toLocaleDateString() === yesterdayString)
}

// Watchers
watch(selectedTab, (newVal) => {
  if (newVal === 'today') {
    filteredTodos.value = todayTasks.value
  } else if (newVal === 'yesterday') {
    filteredTodos.value = yesterdayTasks.value
  } else if (newVal === 'upcoming') {
    filteredTodos.value = upcomingTasks.value
  } else if (newVal === 'completed') {
    filteredTodos.value = completedTasks.value
  } else {
    filteredTodos.value = todoStore.todos
  }
})

const onClear = () => {
  filters.value.all = true
  filters.value.high = false
  filters.value.medium = false
  filters.value.low = false
  applyFilters()
}

// Function to toggle the search box visibility
function toggleSearchBox() {
  showSearchBox.value = true
}

// Function to close the search box
function closeSearchBox() {
  showSearchBox.value = false
  searchQuery.value = ''
  applySearch() // Reset the search results
}

// Function to apply search logic
async function applySearch() {
  try {
    console.log('Searching for:', searchQuery.value)
    const result = await todoStore.searchTodos(searchQuery.value)
    if (result.success) {
      console.log('Search results:', result.data)
      filteredTodos.value = result.data
    } else {
      console.error('Search failed:', result.message)
    }
  } catch (error) {
    console.error('Error during search:', error)
  }
}

// Watch for changes in the search input and trigger search
watch(searchQuery, (newVal) => {
  console.log('Search input changed:', newVal)
  applySearch()
})

// Ensure todos are fetched before searching
onMounted(async () => {
  await todoStore.getTodos()
  filteredTodos.value = todoStore.todos
})
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

.modern-search-box {
  border-radius: 8px;
  transition: all 0.3s ease;
}
</style>
