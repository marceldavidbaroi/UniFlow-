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
          <q-btn icon="clear" label="Clear All Filters" @click="onClear" />
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
          <q-btn icon="delete" color="negative" label="Delete" @click="onDeleteAll" />
        </div>
      </div>
      <div>
        <!-- Category filter as a QSelect dropdown -->
        <q-select
          v-model="selectedType"
          :options="selectTypeOptions"
          label="Select Category"
          outlined
          color="secondary"
          dense
          map-options
          emit-value
          @update:model-value="applyListFilters"
          style="max-width: 200px"
          class="q-px-md"
        />
      </div>

      <TodoList :todos="filteredTodos" @todo-updated="handleTodoUpdated" />
    </div>

    <!-- Floating Action Button -->
    <q-btn fab color="secondary" icon="add" class="fab-button" @click="showCreateDialog = true" />
    <CreateTodoDialog v-model="showCreateDialog" />

    <DeleteDialog
      v-model="showDialog"
      :card-title="'Delete Todos'"
      :description="'Are you sure you want to delete all todos?'"
      :input-field="false"
      :button-label="'Delete Forever'"
      @confirm-delete="handleDelete"
    />
  </q-page>
</template>

<script setup>
// Organize imports
import { useTodoStore } from 'src/stores/todo-store'
import { onMounted, ref, watch } from 'vue'
import TodoList from '../components/TodoList.vue'
import CreateTodoDialog from '../components/CreateTodoDialog.vue'
import DeleteDialog from '../../../components/DeleteDialog.vue'

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
const selectedSort = ref('priority')
// const todayTasks = ref([])
// const yesterdayTasks = ref()
// const upcomingTasks = ref()
const completedTasks = ref([{ id: 5, text: 'Submit timesheet' }])
const showSearchBox = ref(false)
const searchQuery = ref('')

const selectedType = ref()
const selectTypeOptions = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
  { label: 'Uncompleted', value: 'uncompleted' },
]

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

const applyListFilters = (data) => {
  const result = todoStore.filterTodos(todoStore.todos, (todo) => {
    if (data === 'all') {
      return true
    } else if (data === 'today') {
      return new Date(todo.dueDate).toLocaleDateString() === new Date().toLocaleDateString()
    } else if (data === 'yesterday') {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      return new Date(todo.dueDate).toLocaleDateString() === yesterday.toLocaleDateString()
    } else if (data === 'upcoming') {
      return new Date(todo.dueDate) >= new Date()
    } else if (data === 'completed') {
      return todo.isCompleted
    } else if (data === 'uncompleted') {
      return !todo.isCompleted
    }
  })
  filteredTodos.value = result.data
}
function applyFilters() {
  let filterFn
  const noFiltersSelected = !filters.value.high && !filters.value.medium && !filters.value.low

  if (filters.value.all || noFiltersSelected) {
    filterFn = () => true
  } else {
    filterFn = (todo) => {
      const matchPriority =
        (filters.value.high && todo.priority.toLowerCase() === 'high') ||
        (filters.value.medium && todo.priority.toLowerCase() === 'medium') ||
        (filters.value.low && todo.priority.toLowerCase() === 'low')

      return matchPriority
    }
  }

  const result = todoStore.filterTodos(todoStore.todos, filterFn)
  filteredTodos.value = result.data
  console.log(filteredTodos.value)
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
    // todayTasks.value = findTodosUpdatedToday(todoStore.todos)
    // upcomingTasks.value = findUpcomingTodos(todoStore.todos)
    // yesterdayTasks.value = findYesterdayTodos(todoStore.todos)
    const completed = todoStore.filterTodos(data.value, (todo) => todo.isCompleted)
    completedTasks.value = completed.data
    filteredTodos.value = todoStore.todos
    // data.value = todoStore.todos
  })
}

// function findTodosUpdatedToday(todos) {
//   const today = new Date().toLocaleDateString()
//   return todos.filter((todo) => {
//     const updatedDate = new Date(todo.updatedAt).toLocaleDateString()
//     return updatedDate === today
//   })
// }

// function findUpcomingTodos(todos) {
//   const currentDate = new Date()
//   return todos.filter((todo) => new Date(todo.dueDate) >= currentDate)
// }

// function findYesterdayTodos(todos) {
//   const yesterday = new Date()
//   yesterday.setDate(yesterday.getDate() - 1)
//   const yesterdayString = yesterday.toLocaleDateString()
//   return todos.filter((todo) => new Date(todo.dueDate).toLocaleDateString() === yesterdayString)
// }

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
const showDialog = ref(false)
const onDeleteAll = () => {
  showDialog.value = true
}

const handleDelete = async () => {
  await todoStore.deleteAllTodos()
  await todoStore.getTodos()
}
// Ensure todos are fetched before searching
onMounted(async () => {
  await todoStore.getTodos()
  filteredTodos.value = todoStore.todos
  selectedType.value = 'all'
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
