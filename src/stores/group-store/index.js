import { defineStore } from 'pinia'
import actions from './action'

export const useGroupStore = defineStore('group', {
  state: () => ({
    group: null,
  }),
  actions,
  persist: {
    key: 'group',
    pick: ['group'],
  },
  // created() {
  //   this.initAuthState()
  // },
})
