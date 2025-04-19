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
          <!-- <q-list class="q-pa-md">
            <q-item
              v-for="todo in todayTasks"
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
                    <q-btn
                      v-else
                      flat
                      round
                      dense
                      icon="check_circle"
                      color="positive"
                      :label="'Done'"
                    />
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
                  <div class="text-subtitle1">{{ todo.text }}</div>
                  <div v-if="todo.showDescription" class="text-caption text-grey-7 q-mt-xs">
                    {{ todo.description }}
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list> -->
        </q-tab-panel>

        <q-tab-panel name="today">
          <q-list bordered>
            <q-item v-for="todo in todayTasks" :key="todo.id">
              <q-item-section>{{ todo.text }}</q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="yesterday">
          <q-list bordered>
            <q-item v-for="todo in yesterdayTasks" :key="todo.id">
              <q-item-section>{{ todo.text }}</q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="upcoming">
          <q-list bordered>
            <q-item v-for="todo in upcomingTasks" :key="todo.id">
              <q-item-section>{{ todo.text }}</q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel name="completed">
          <q-list bordered>
            <q-item v-for="todo in completedTasks" :key="todo.id">
              <q-item-section>{{ todo.text }}</q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </div>
    <!-- Left Side Tabs -->
    <div class="col-auto flex flex-center" style="height: 100vh">
      <q-tabs
        v-model="selectedTab"
        vertical
        dense
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
})
const selectedTab = ref('today')

// Dummy Tasks
const todayTasks = ref([
  { id: 1, text: 'Buy groceries' },
  { id: 2, text: 'Call Alice' },
])

const yesterdayTasks = ref([{ id: 3, text: 'Finish report' }])

const upcomingTasks = ref([{ id: 4, text: 'Schedule dentist appointment' }])

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
const onAddTodo = () => {
  console.log('Add Todo clicked')
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
