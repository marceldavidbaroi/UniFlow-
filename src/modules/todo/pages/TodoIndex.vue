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
          <q-list bordered>
            <q-item v-for="todo in todayTasks" :key="todo.id">
              <q-item-section>{{ todo.text }}</q-item-section>
            </q-item>
          </q-list>
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
    <q-btn fab color="secondary" icon="add" class="fab-button" @click="onAddTodo" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

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
