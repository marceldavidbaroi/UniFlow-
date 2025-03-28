import { defineStore } from 'pinia'
import actions from './action' // Fix import

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    currentRole: null,
  }),

  actions: {
    ...actions, // Import actions from the separate 'actions' file
    // You can also define specific actions here if needed
    // initAuthState() {
    //   // Subscribe to Firebase auth state changes
    //   onAuthStateChanged(auth, (user) => {
    //     if (user) {
    //       // If user is signed in
    //       this.currentUser = user
    //       // Optionally, set the user role from Firestore or another source
    //       // this.currentRole = fetchUserRole(user.uid);
    //     } else {
    //       // If no user is signed in
    //       this.currentUser = null
    //       this.currentRole = null
    //     }
    //   })
    // },

    logout() {
      this.currentUser = null
      this.currentRole = null
    },
  },

  persist: {
    key: 'auth',
    pick: ['currentUser', 'currentRole'],
  },

  created() {
    this.initAuthState()
  },
})
