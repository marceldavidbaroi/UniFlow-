import { defineStore } from 'pinia'
import actions from './action'


export const useAdminStore = defineStore('admin', {
  state: () => ({
    allUser: [],
    selectedUser: null,
    allGroup: [],
    selectedGroup: null,
    allSession: [],
    selectedSession: null,
    allTask: [],
    selectedTask: null,
    allTodo: [],
    selectedTodo: null,
    allNote: [],
    selectedNote: null,
    allSubject: [],
    selectedSubject: null,
    allLog: [],
    selectedLog: null,
    loading: false,
    error: null,
  }),
  actions,
  persist: {
    enabled: true,
    key: 'auth',
    storage: localStorage,
    paths: [],
  },
})
