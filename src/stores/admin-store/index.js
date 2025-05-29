import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    groups: [],
    sessions: [],
    tasks: [],
    todos: [],
    notes: [],
    subjects: [],
    logs: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUsers() {
      // TODO: implement API call
    },
    async fetchGroups() {
      // TODO: implement API call
    },
    async fetchSessions() {
      // TODO: implement API call
    },
    async fetchTasks() {
      // TODO: implement API call
    },
    async fetchTodos() {
      // TODO: implement API call
    },
    async fetchNotes() {
      // TODO: implement API call
    },
    async fetchSubjects() {
      // TODO: implement API call
    },
    async fetchLogs() {
      // TODO: implement API call
    },
  },
})
