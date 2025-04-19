import { defineStore } from 'pinia'
import actions from './action'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [],
  }),

  actions,

  persist: {
    key: 'todo',
    storage: localStorage, // ✅ Correct usage
    paths: ['todos'],
  },
})
