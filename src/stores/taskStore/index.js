import { defineStore } from 'pinia'
import actions from './action'

export const useTaskStore = defineStore('task', {
  state: () => ({
    taskList: [],
    taskCount: 0,
  }),

  actions,

  persist: {
    key: 'task',
    storage: localStorage, // ✅ Correct usage
    paths: ['taskList', 'taskCount'],
  },
})
