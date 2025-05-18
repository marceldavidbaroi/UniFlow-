import { defineStore } from 'pinia'
import actions from './action'

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [], // All fetched notes
    selectedNote: null, // Currently selected note
    filters: {
      tags: [],
      category: '',
      isPublic: null,
    },
    searchKeyword: '',
    sortCriteria: 'dateCreated', // or 'title', 'dateModified'
    groupBy: null, // 'tags' or 'category'
  }),

  actions,

  persist: {
    enabled: true,
    key: 'note',
    storage: localStorage,
    paths: ['notes', 'filters', 'searchKeyword', 'sortCriteria', 'groupBy'],
  },
})
