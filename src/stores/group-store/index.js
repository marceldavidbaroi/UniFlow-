import { defineStore } from 'pinia'
import actions from './action'

export const useGroupStore = defineStore('group', {
  state: () => ({
    group: null,
    groupList: [],
  }),
  actions,
  persist: {
    key: 'group',
    pick: ['group', 'groupList'],
  },
  // created() {
  //   this.initAuthState()
  // },
})
