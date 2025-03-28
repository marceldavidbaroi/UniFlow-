import { defineStore } from 'pinia'
// import { auth } from 'boot/firebase' // Assuming you're importing your Firebase auth setup
// import { onAuthStateChanged } from 'firebase/auth'
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
      // Implement your logout logic here (clear user data, etc.)
      this.currentUser = null
      this.currentRole = null
    },
  },

  persist: {
    key: 'auth', // LocalStorage key for persistence
    pick: ['currentUser', 'currentRole'], // Persist the currentUser and currentRole
  },

  created() {
    this.initAuthState()
  },
})
