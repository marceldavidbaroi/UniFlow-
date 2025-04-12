import { defineStore } from 'pinia'
import actions from './action'

export const useGroupStore = defineStore('group', {
  state: () => ({
    group: null,
    groupList: [],
    groupCount: 0,
    totalMemberCount: 0,
    filterActive: false,
  }),

  actions,

  persist: {
    enabled: true,
    key: 'group',
    storage: localStorage,
    paths: ['group', 'groupList', 'groupCount', 'totalMemberCount', 'filterActive'],
  },
})
