import { defineStore } from 'pinia'
import actions from './action'

export const useNoteStore = defineStore('note', {
  state: () => ({
    userNotes: [], // All fetched notes
    publicNotes: [], // All fetched notes
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

getters: {
  sortedUserNotes: (state) => {
    return [...state.userNotes].sort((a, b) => {
      return b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.()
    })
  },
  sortedPublicNotes: (state) => {
    return [...state.publicNotes].sort((a, b) => {
      return b.createdAt?.toMillis?.() - a.createdAt?.toMillis?.()
    })
  },
},

  actions,

  persist: {
    enabled: true,
    key: 'note',
    storage: localStorage,
    paths: ['notes', 'filters', 'searchKeyword', 'sortCriteria', 'groupBy'],
  },
})
