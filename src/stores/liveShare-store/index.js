import { defineStore } from 'pinia'
import actions from './action'

export const useLiveShareStore = defineStore('liveShare', {
  state: () => ({
    session: null,
    participants: [],
    messages: [],
    isActive: false,
  }),
  actions,
})
